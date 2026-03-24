/* eslint-disable @typescript-eslint/no-explicit-any */
import { NP, NDArray } from './numpy';

function __op(a: any, op: string, b: any): any {
  const aA = a instanceof NDArray, bA = b instanceof NDArray;
  if (!aA && !bA) {
    switch (op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; case '**': return a ** b; case '%': return a % b; }
  }
  if (!aA && typeof a === 'number' && bA) {
    switch (op) {
      case '+': return b.add(a); case '-': return new NDArray(b.data.map((v: number) => a - v), [...b.shape]);
      case '*': return b.mul(a); case '/': return new NDArray(b.data.map((v: number) => a / v), [...b.shape]);
      case '**': return new NDArray(b.data.map((v: number) => a ** v), [...b.shape]);
    }
  }
  if (aA) {
    switch (op) {
      case '+': return a.add(bA ? b : b); case '-': return a.sub(bA ? b : b);
      case '*': return a.mul(bA ? b : b); case '/': return a.div(bA ? b : b);
      case '**': return a.pow(bA ? b : b); case '%': return a.mod(bA ? b : b);
    }
  }
}

function __bix(arr: any, op: string, val: any) {
  if (!(arr instanceof NDArray)) return arr;
  let mask: NDArray;
  switch (op) {
    case '>=': mask = arr.gte(val); break; case '>': mask = arr.gt(val); break;
    case '<=': mask = arr.lte(val); break; case '<': mask = arr.lt(val); break;
    default: mask = arr.eq(val);
  }
  return arr.filter(mask);
}

function __fix(arr: any, indices: any) {
  if (arr instanceof NDArray) return arr.fancy(Array.isArray(indices) ? indices : indices.data);
  return indices.map((i: number) => arr[i]);
}

function __sl(arr: any, s: number, e?: number) {
  if (arr instanceof NDArray) return arr.slice(s, e);
  return arr.slice(s, e);
}

function __vi(arr: any, idx: any) {
  if (arr instanceof NDArray && idx instanceof NDArray) return arr.fancy(idx);
  if (arr instanceof NDArray && typeof idx === 'number') return arr.get(idx);
  return arr[idx];
}

function __gi(arr: any, idx: number) {
  if (arr instanceof NDArray) return arr.get(idx);
  return arr[idx];
}

function txExpr(expr: string): string {
  let e = expr;
  e = e.replace(/(\b\w+)\s*@\s*(\b\w+)/g, 'NP.matmul($1,$2)');
  e = e.replace(/(\w+)\[(\w+)\s*(>=|>|<=|<|==|!=)\s*([\w.]+)\]/g, '__bix($1,"$3",$4)');
  e = e.replace(/(\w+)\[(\[[\d,\s]+\])\]/g, '__fix($1,$2)');
  e = e.replace(/(\w+)\[(\d+):(\d+)\]/g, '__sl($1,$2,$3)');
  e = e.replace(/(\w+)\[(\d+):]/g, '__sl($1,$2)');
  e = e.replace(/(\w+)\[(-?\d+)\]/g, (m: string, name: string, idx: string) => {
    if (['__p', 'console'].includes(name)) return m;
    return `__gi(${name},${idx})`;
  });
  e = e.replace(/(\w+)\[(\b[a-zA-Z_]\w*\b)\]/g, (m: string, arr: string, idx: string) => {
    if (['NP', 'Math', 'console', '__p', 'window', 'parseInt', 'parseFloat', 'String', 'Number', 'JSON', 'Array'].includes(arr)) return m;
    if (['length', 'size', 'ndim'].includes(idx)) return m;
    return `__vi(${arr},${idx})`;
  });
  e = transformArith(e);
  e = e.replace(/"Shape:",\s*(\w+)\.shape/g, '"Shape:","("+$1.shape.join(", ")+")"');
  return e;
}

function transformArith(expr: string): string {
  let e = expr;
  e = e.replace(/(\b\w+(?:\.\w+(?:\([^)]*\))?)*)\s*\*\*\s*(\b\w+|\d+(?:\.\d+)?)/g,
    (_m: string, a: string, b: string) => `__op(${a},'**',${b})`);
  for (let i = 0; i < 5; i++)
    e = e.replace(/(__op\([^)]+\)|(?:\([^()]+\))|[\w.]+(?:\([^)]*\))?)\s*(\*|\/)\s*(__op\([^)]+\)|(?:\([^()]+\))|[\w.]+(?:\.\w+(?:\([^)]*\))?)*|\d+(?:\.\d+)?)/,
      (_m: string, a: string, op: string, b: string) => `__op(${a},'${op}',${b})`);
  for (let i = 0; i < 5; i++)
    e = e.replace(/(__op\([^)]+\)|(?:\([^()]+\))|[\w.]+(?:\([^)]*\))?)\s*(\+|\-)\s*(__op\([^)]+\)|(?:\([^()]+\))|[\w.]+(?:\.\w+(?:\([^)]*\))?)*|\d+(?:\.\d+)?)/,
      (_m: string, a: string, op: string, b: string) => {
        if (/"/.test(a) || /'/.test(a)) return _m;
        return `__op(${a},'${op}',${b})`;
      });
  return e;
}

export function executeCode(code: string): { output: string[]; scope: Record<string, any> } {
  const out: string[] = [];
  const exports: Record<string, any> = {};

  const lines = code.split('\n');
  const jsLines: string[] = [];
  const declaredVars = new Set<string>();

  for (const raw of lines) {
    let line = raw;
    if (/^\s*(import|from)\s+/.test(line)) continue;
    if (/^\s*#/.test(line)) { jsLines.push(line.replace(/#/, '//')); continue; }
    if (!line.trim()) { jsLines.push(''); continue; }
    line = line.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');
    line = line.replace(/\bnp\b(?=\.)/g, 'NP');

    const pm = line.match(/^(\s*)print\((.+)\)\s*$/);
    if (pm) { jsLines.push(`${pm[1]}__p(${txExpr(pm[2])});`); continue; }

    const ia = line.match(/^(\s*)(\w+)\[(\d+)\]\s*=\s*(.+)\s*$/);
    if (ia) { jsLines.push(`${ia[1]}${ia[2]}.data[${ia[3]}]=${txExpr(ia[4])};`); continue; }

    const asgn = line.match(/^(\s*)([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (asgn && !line.includes('==') && !line.includes('!=') && !/^\s*(if|for|while|else|return)/.test(line)) {
      const [, ws, name, expr] = asgn;
      const d = declaredVars.has(name) ? '' : 'let ';
      declaredVars.add(name);
      jsLines.push(`${ws}${d}${name}=${txExpr(expr.trim())};`);
      continue;
    }

    jsLines.push(txExpr(line));
  }

  const js = jsLines.join('\n');

  function __p(...args: any[]) {
    out.push(args.map((a: any) => {
      if (a instanceof NDArray) return a.toString();
      if (Array.isArray(a)) return '(' + a.join(', ') + ')';
      return String(a);
    }).join(' '));
  }

  const allVars = Array.from(declaredVars);
  const fn = new Function('NP', '__p', '__op', '__bix', '__fix', '__sl', '__vi', '__gi',
    `${js}\n${allVars.map(v => `try{this.${v}=${v}}catch(e){}`).join('\n')}`
  );
  fn.call(exports, NP, __p, __op, __bix, __fix, __sl, __vi, __gi);

  return { output: out, scope: exports };
}
