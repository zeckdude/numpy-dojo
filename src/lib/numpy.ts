/* eslint-disable @typescript-eslint/no-explicit-any */

export class NDArray {
  data: any[];
  shape: number[];

  constructor(data: any, shape?: number[]) {
    if (data instanceof NDArray) {
      this.data = [...data.data];
      this.shape = [...data.shape];
    } else if (Array.isArray(data)) {
      const { flat, shape: s } = NDArray._flatten(data);
      this.data = flat.map((v: any) => (typeof v === 'string' ? v : Number(v)));
      this.shape = shape || s;
      if (flat.length && typeof flat[0] === 'string') this.data = flat.map(String);
    } else {
      this.data = Array.isArray(data) ? [...data] : [data];
      this.shape = shape || [this.data.length];
    }
  }

  static _flatten(arr: any[]): { flat: any[]; shape: number[] } {
    const shape: number[] = [];
    let cur: any = arr;
    while (Array.isArray(cur)) { shape.push(cur.length); cur = cur[0]; }
    const flat: any[] = [];
    const go = (a: any) => { if (Array.isArray(a)) a.forEach(go); else flat.push(a); };
    go(arr);
    return { flat, shape };
  }

  get ndim() { return this.shape.length; }
  get size() { return this.data.length; }
  get dtype() {
    if (!this.data.length) return 'float64';
    if (typeof this.data[0] === 'string') return '<U' + Math.max(...this.data.map((s: string) => s.length));
    return this.data.some((v: number) => !Number.isInteger(v)) ? 'float64' : 'int64';
  }
  get T() { return this._transpose(); }
  get length() { return this.shape[0] || 0; }

  _transpose(): NDArray {
    if (this.ndim < 2) return this.copy();
    const [r, c] = this.shape;
    const out = new Array(r * c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[j * r + i] = this.data[i * c + j];
    const n = new NDArray([], []);
    n.data = out;
    n.shape = [c, r];
    return n;
  }

  reshape(...args: any[]): NDArray {
    let s = args.length === 1 && Array.isArray(args[0]) ? args[0] : [...args];
    const neg = s.indexOf(-1);
    if (neg >= 0) { const known = s.reduce((a: number, v: number, i: number) => i === neg ? a : a * v, 1); s[neg] = this.data.length / known; }
    if (s.reduce((a: number, b: number) => a * b, 1) !== this.data.length) throw new Error(`Cannot reshape size ${this.data.length} into (${s})`);
    const n = new NDArray([], []);
    n.data = [...this.data];
    n.shape = [...s];
    return n;
  }

  flatten() { return new NDArray([...this.data], [this.data.length]); }
  ravel() { return this.flatten(); }
  copy() { const n = new NDArray([], []); n.data = [...this.data]; n.shape = [...this.shape]; return n; }

  _idx(i: number, j: number) {
    if (this.ndim === 1) return i < 0 ? this.shape[0] + i : i;
    const cols = this.shape[1];
    const ri = i < 0 ? this.shape[0] + i : i;
    const ci = j < 0 ? this.shape[1] + j : j;
    return ri * cols + ci;
  }

  get(i: number, j?: number): any {
    if (this.ndim === 1) return this.data[i < 0 ? this.shape[0] + i : i];
    if (j === undefined) {
      const cols = this.shape[1];
      const ri = i < 0 ? this.shape[0] + i : i;
      return new NDArray(this.data.slice(ri * cols, ri * cols + cols), [cols]);
    }
    return this.data[this._idx(i, j)];
  }

  set(i: number, j: any, v?: any) {
    if (this.ndim === 1) { this.data[i < 0 ? this.shape[0] + i : i] = j; }
    else { this.data[this._idx(i, j)] = v; }
  }

  slice(start: number, end?: number): NDArray {
    const s = start < 0 ? this.shape[0] + start : start;
    const e = end === undefined ? this.shape[0] : end < 0 ? this.shape[0] + end : end;
    if (this.ndim === 1) return new NDArray(this.data.slice(s, e), [e - s]);
    const cols = this.shape[1];
    return new NDArray(this.data.slice(s * cols, e * cols), [e - s, cols]);
  }

  filter(mask: NDArray | number[]): NDArray {
    const m = mask instanceof NDArray ? mask.data : mask;
    const f = this.data.filter((_: any, i: number) => m[i]);
    return new NDArray(f, [f.length]);
  }

  fancy(indices: NDArray | number[]): NDArray {
    const idx = indices instanceof NDArray ? indices.data : indices;
    if (this.ndim === 1) return new NDArray(idx.map((i: number) => this.data[i < 0 ? this.data.length + i : i]), [idx.length]);
    const cols = this.shape[1];
    const rows = idx.map((i: number) => { const ri = i < 0 ? this.shape[0] + i : i; return this.data.slice(ri * cols, ri * cols + cols); });
    return new NDArray(rows.flat(), [idx.length, cols]);
  }

  _ew(other: any, fn: (a: number, b: number) => number): NDArray {
    if (typeof other === 'number') return new NDArray(this.data.map((v: number) => fn(v, other)), [...this.shape]);
    if (other instanceof NDArray) {
      if (this.data.length === other.data.length) return new NDArray(this.data.map((v: number, i: number) => fn(v, other.data[i])), [...this.shape]);
      if (this.ndim === 2 && other.ndim === 1 && other.shape[0] === this.shape[1]) {
        const out: number[] = []; const c = this.shape[1];
        for (let i = 0; i < this.data.length; i++) out.push(fn(this.data[i], other.data[i % c]));
        return new NDArray(out, [...this.shape]);
      }
      if (this.ndim === 2 && other.ndim === 2 && other.shape[1] === 1 && other.shape[0] === this.shape[0]) {
        const out: number[] = []; const c = this.shape[1];
        for (let i = 0; i < this.shape[0]; i++) for (let j = 0; j < c; j++) out.push(fn(this.data[i * c + j], other.data[i]));
        return new NDArray(out, [...this.shape]);
      }
      if (other.data.length === 1) return new NDArray(this.data.map((v: number) => fn(v, other.data[0])), [...this.shape]);
      if (this.data.length === 1) return new NDArray(other.data.map((v: number) => fn(this.data[0], v)), [...other.shape]);
      throw new Error(`Shape mismatch: (${this.shape}) vs (${other.shape})`);
    }
    throw new Error('Unsupported operand');
  }

  add(o: any) { return this._ew(o, (a, b) => a + b); }
  sub(o: any) { return this._ew(o, (a, b) => a - b); }
  mul(o: any) { return this._ew(o, (a, b) => a * b); }
  div(o: any) { return this._ew(o, (a, b) => a / b); }
  pow(o: any) { return this._ew(o, (a, b) => Math.pow(a, b)); }
  mod(o: any) { return this._ew(o, (a, b) => ((a % b) + b) % b); }

  _cmp(other: any, fn: (a: any, b: any) => boolean): NDArray {
    if (typeof other === 'number') return new NDArray(this.data.map((v: any) => fn(v, other) ? 1 : 0), [...this.shape]);
    if (other instanceof NDArray) return new NDArray(this.data.map((v: any, i: number) => fn(v, other.data[i]) ? 1 : 0), [...this.shape]);
    throw new Error('Bad comparison');
  }

  gt(o: any) { return this._cmp(o, (a, b) => a > b); }
  gte(o: any) { return this._cmp(o, (a, b) => a >= b); }
  lt(o: any) { return this._cmp(o, (a, b) => a < b); }
  lte(o: any) { return this._cmp(o, (a, b) => a <= b); }
  eq(o: any) { return this._cmp(o, (a, b) => a === b); }
  neq(o: any) { return this._cmp(o, (a, b) => a !== b); }

  sum(axis?: number): any {
    if (axis === undefined) return this.data.reduce((a: number, b: number) => a + b, 0);
    if (this.ndim !== 2) throw new Error('axis only for 2D');
    const [r, c] = this.shape;
    if (axis === 1) { const out: number[] = []; for (let i = 0; i < r; i++) { let s = 0; for (let j = 0; j < c; j++) s += this.data[i * c + j]; out.push(s); } return new NDArray(out, [r]); }
    if (axis === 0) { const out: number[] = []; for (let j = 0; j < c; j++) { let s = 0; for (let i = 0; i < r; i++) s += this.data[i * c + j]; out.push(s); } return new NDArray(out, [c]); }
  }

  mean(axis?: number): any {
    if (axis === undefined) return this.sum() / this.data.length;
    const s = this.sum(axis);
    const n = axis === 0 ? this.shape[0] : this.shape[1];
    return new NDArray(s.data.map((v: number) => v / n), s.shape);
  }

  std() { const m = this.mean(); return Math.sqrt(this.data.reduce((s: number, v: number) => s + (v - m) ** 2, 0) / this.data.length); }
  min() { return Math.min(...this.data); }
  max() { return Math.max(...this.data); }
  argmax() { let mi = 0; this.data.forEach((v: number, i: number) => { if (v > this.data[mi]) mi = i; }); return mi; }
  argmin() { let mi = 0; this.data.forEach((v: number, i: number) => { if (v < this.data[mi]) mi = i; }); return mi; }

  toString(): string { return ndStr(this); }
}

function ndStr(arr: NDArray): string {
  if (arr.ndim === 1) {
    if (typeof arr.data[0] === 'string') return '[' + arr.data.map((s: string) => `'${s}'`).join(', ') + ']';
    return '[' + arr.data.map(fmtNum).join(', ') + ']';
  }
  if (arr.ndim === 2) {
    const [r, c] = arr.shape;
    const rows: string[] = [];
    for (let i = 0; i < r; i++) {
      const row = arr.data.slice(i * c, i * c + c);
      rows.push('[' + row.map(fmtNum).join(', ') + ']');
    }
    return '[' + rows.join(',\n ') + ']';
  }
  return JSON.stringify(arr.data);
}

function fmtNum(v: any): string {
  if (typeof v === 'string') return `'${v}'`;
  if (Number.isInteger(v)) return String(v);
  let s = v.toFixed(8).replace(/0+$/, '').replace(/\.$/, '.');
  if (s === '-0') s = '0.';
  if (!s.includes('.')) s += '.';
  return s;
}

// ─── np namespace ───
export const NP = {
  NDArray,
  pi: Math.PI,
  e: Math.E,
  inf: Infinity,
  nan: NaN,
  newaxis: 'newaxis' as const,

  array(data: any) { return new NDArray(data); },
  zeros(shape: number | number[]) { if (typeof shape === 'number') shape = [shape]; return new NDArray(new Array((shape as number[]).reduce((a, b) => a * b, 1)).fill(0), shape as number[]); },
  ones(shape: number | number[]) { if (typeof shape === 'number') shape = [shape]; return new NDArray(new Array((shape as number[]).reduce((a, b) => a * b, 1)).fill(1), shape as number[]); },
  full(shape: number | number[], val: number) { if (typeof shape === 'number') shape = [shape]; return new NDArray(new Array((shape as number[]).reduce((a, b) => a * b, 1)).fill(val), shape as number[]); },

  arange(start: number, stop?: number, step?: number) {
    if (stop === undefined) { stop = start; start = 0; }
    if (!step) step = 1;
    const out: number[] = [];
    if (step > 0) for (let i = start; i < stop; i += step) out.push(i);
    else for (let i = start; i > stop; i += step) out.push(i);
    return new NDArray(out, [out.length]);
  },

  linspace(start: number, stop: number, num?: number) {
    num = num || 50;
    if (num === 1) return new NDArray([start], [1]);
    const step = (stop - start) / (num - 1);
    const out: number[] = [];
    for (let i = 0; i < num; i++) out.push(start + step * i);
    return new NDArray(out, [num]);
  },

  sin(a: NDArray) { return new NDArray(a.data.map(Math.sin), [...a.shape]); },
  cos(a: NDArray) { return new NDArray(a.data.map(Math.cos), [...a.shape]); },
  tan(a: NDArray) { return new NDArray(a.data.map(Math.tan), [...a.shape]); },
  exp(a: NDArray) { return new NDArray(a.data.map(Math.exp), [...a.shape]); },
  log(a: NDArray) { return new NDArray(a.data.map(Math.log), [...a.shape]); },
  sqrt(a: NDArray) { return new NDArray(a.data.map(Math.sqrt), [...a.shape]); },
  abs(a: NDArray) { return new NDArray(a.data.map(Math.abs), [...a.shape]); },

  round(a: NDArray, decimals?: number) {
    const d = decimals || 0;
    const f = Math.pow(10, d);
    return new NDArray(a.data.map((v: number) => Math.round(v * f) / f), [...a.shape]);
  },

  where(cond: NDArray, x: any, y: any) {
    if (x instanceof NDArray && y instanceof NDArray)
      return new NDArray(cond.data.map((c: number, i: number) => c ? x.data[i] : y.data[i]), [...cond.shape]);
    if (x instanceof NDArray)
      return new NDArray(cond.data.map((c: number, i: number) => c ? x.data[i] : y), [...cond.shape]);
    if (y instanceof NDArray)
      return new NDArray(cond.data.map((c: number, i: number) => c ? x : y.data[i]), [...cond.shape]);
    return new NDArray(cond.data.map((c: number) => c ? x : y), [...cond.shape]);
  },

  sort(a: NDArray, axis?: number): NDArray {
    if (a.ndim === 1 || axis === undefined) return new NDArray([...a.data].sort((x: number, y: number) => x - y), [...a.shape]);
    if (a.ndim === 2 && axis === 1) {
      const [r, c] = a.shape; const out: number[] = [];
      for (let i = 0; i < r; i++) out.push(...a.data.slice(i * c, i * c + c).sort((x: number, y: number) => x - y));
      return new NDArray(out, [r, c]);
    }
    return NP.sort(a);
  },

  argsort(a: NDArray) { const idx = Array.from(a.data.keys()).sort((i, j) => a.data[i] - a.data[j]); return new NDArray(idx, [idx.length]); },
  unique(a: NDArray) { const u = Array.from(new Set(a.data as number[])).sort((x, y) => x - y); return new NDArray(u, [u.length]); },

  dot(a: NDArray, b: NDArray): any {
    if (a.ndim === 1 && b.ndim === 1) return a.data.reduce((s: number, v: number, i: number) => s + v * b.data[i], 0);
    return NP.matmul(a, b);
  },

  matmul(a: NDArray, b: NDArray): NDArray {
    if (a.ndim === 2 && b.ndim === 1) {
      const [r, c] = a.shape; const out: number[] = [];
      for (let i = 0; i < r; i++) { let s = 0; for (let k = 0; k < c; k++) s += a.data[i * c + k] * b.data[k]; out.push(s); }
      return new NDArray(out, [r]);
    }
    if (a.ndim === 2 && b.ndim === 2) {
      const [m, n] = a.shape; const p = b.shape[1]; const out: number[] = [];
      for (let i = 0; i < m; i++) for (let j = 0; j < p; j++) { let s = 0; for (let k = 0; k < n; k++) s += a.data[i * n + k] * b.data[k * p + j]; out.push(s); }
      return new NDArray(out, [m, p]);
    }
    throw new Error('matmul shape mismatch');
  },

  allclose(a: any, b: any, atol?: number) {
    atol = atol || 1e-7;
    if (a instanceof NDArray && b instanceof NDArray) return a.data.every((v: number, i: number) => Math.abs(v - b.data[i]) < atol!);
    if (a instanceof NDArray) a = a.data;
    if (b instanceof NDArray) b = b.data;
    if (Array.isArray(a) && Array.isArray(b)) return a.every((v: number, i: number) => Math.abs(v - (b as number[])[i]) < atol!);
    return Math.abs(a - b) < atol;
  },

  isclose(a: number, b: number, atol?: number) { atol = atol || 1e-5; return Math.abs(a - b) < atol; },

  array_equal(a: NDArray, b: NDArray) {
    if (a.data.length !== b.data.length) return false;
    return a.data.every((v: any, i: number) => v === b.data[i]);
  },

  vstack(arrays: NDArray[]) {
    const fixed = arrays.map(a => a.ndim === 1 ? a.reshape(1, a.shape[0]) : a);
    const cols = fixed[0].shape[1]; const allData: any[] = []; let rows = 0;
    fixed.forEach(a => { allData.push(...a.data); rows += a.shape[0]; });
    return new NDArray(allData, [rows, cols]);
  },

  hstack(arrays: NDArray[]) {
    if (arrays[0].ndim === 1) { const d: any[] = []; arrays.forEach(a => d.push(...a.data)); return new NDArray(d, [d.length]); }
    const r = arrays[0].shape[0]; const totalC = arrays.reduce((s, a) => s + a.shape[1], 0);
    const out = new Array(r * totalC); let cOff = 0;
    arrays.forEach(a => { const c = a.shape[1]; for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) out[i * totalC + cOff + j] = a.data[i * c + j]; cOff += c; });
    return new NDArray(out, [r, totalC]);
  },

  concatenate(arrays: NDArray[], axis?: number) { if (!axis) return NP.hstack(arrays); return NP.vstack(arrays); },

  linalg: {
    det(a: NDArray) {
      if (a.shape[0] === 2 && a.shape[1] === 2) return a.data[0] * a.data[3] - a.data[1] * a.data[2];
      if (a.shape[0] === 3) {
        const d = a.data;
        return d[0] * (d[4] * d[8] - d[5] * d[7]) - d[1] * (d[3] * d[8] - d[5] * d[6]) + d[2] * (d[3] * d[7] - d[4] * d[6]);
      }
      throw new Error('det only for 2x2 and 3x3');
    },
    inv(a: NDArray) {
      if (a.shape[0] !== 2 || a.shape[1] !== 2) throw new Error('inv only for 2x2');
      const [aa, bb, cc, dd] = a.data; const det = aa * dd - bb * cc;
      if (Math.abs(det) < 1e-12) throw new Error('Singular matrix');
      return new NDArray([dd / det, -bb / det, -cc / det, aa / det], [2, 2]);
    },
    norm(a: NDArray) { return Math.sqrt(a.data.reduce((s: number, v: number) => s + v * v, 0)); },
    solve(A: NDArray, b: NDArray) {
      if (A.shape[0] !== 2) throw new Error('solve only for 2x2');
      return NP.matmul(NP.linalg.inv(A), b);
    },
  },

  char: {
    upper(a: NDArray) { return new NDArray(a.data.map((s: string) => s.toUpperCase()), [...a.shape]); },
    lower(a: NDArray) { return new NDArray(a.data.map((s: string) => s.toLowerCase()), [...a.shape]); },
    capitalize(a: NDArray) { return new NDArray(a.data.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()), [...a.shape]); },
    str_len(a: NDArray) { return new NDArray(a.data.map((s: string) => s.length), [...a.shape]); },
    add(a: NDArray, s: string) { return new NDArray(a.data.map((v: string) => v + s), [...a.shape]); },
  },

  random: {
    default_rng(seed?: number) {
      let s = seed || 0;
      function next() { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
      return {
        random(shape?: number | number[]) {
          if (!shape) return next();
          const n = Array.isArray(shape) ? shape.reduce((a, b) => a * b, 1) : shape;
          const sh = Array.isArray(shape) ? shape : [shape];
          const d: number[] = []; for (let i = 0; i < n; i++) d.push(next());
          return new NDArray(d, sh);
        },
        integers(low: number, high: number, size: number | number[]) {
          const n = typeof size === 'number' ? size : Array.isArray(size) ? size.reduce((a, b) => a * b, 1) : 1;
          const sh = typeof size === 'number' ? [size] : Array.isArray(size) ? size : [n];
          const d: number[] = []; for (let i = 0; i < n; i++) d.push(Math.floor(next() * (high - low)) + low);
          return new NDArray(d, sh);
        },
        normal(mean?: number, std?: number, shape?: number | number[]) {
          mean = mean || 0; std = std || 1;
          const n = Array.isArray(shape) ? shape.reduce((a, b) => a * b, 1) : shape || 1;
          const sh = Array.isArray(shape) ? shape : [n];
          const d: number[] = [];
          for (let i = 0; i < n; i++) { const u1 = next(), u2 = next(); d.push(mean! + std! * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)); }
          return new NDArray(d, sh);
        },
      };
    },
  },
};
