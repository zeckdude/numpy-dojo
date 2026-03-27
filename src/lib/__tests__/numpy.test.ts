import { describe, expect, it } from 'vitest';
import { NDArray, NP } from '../numpy';

describe('NDArray', () => {
  it('constructs from nested array, scalar, and copy', () => {
    const a = new NDArray([[1, 2], [3, 4]]);
    expect(a.shape).toEqual([2, 2]);
    expect(a.ndim).toBe(2);
    const b = new NDArray(a);
    expect(b.data).toEqual(a.data);
    expect(b).not.toBe(a);
    const s = new NDArray(7);
    expect(s.data).toEqual([7]);
  });

  it('reshape with -1', () => {
    const a = new NDArray(NP.arange(12).data, [12]);
    const r = a.reshape(3, -1);
    expect(r.shape).toEqual([3, 4]);
    expect(() => a.reshape(5, 5)).toThrow(/Cannot reshape/);
  });

  it('transpose and 1d transpose', () => {
    const a = new NDArray([[1, 2], [3, 4]]);
    const t = a.T;
    expect(t.shape).toEqual([2, 2]);
    expect(t.get(0, 1)).toBe(3);
    const v = new NDArray([1, 2, 3]);
    expect(v.T.data).toEqual(v.data);
  });

  it('get set slice filter fancy', () => {
    const a = new NDArray([10, 20, 30]);
    expect(a.get(-1)).toBe(30);
    const m = new NDArray([[1, 2], [3, 4]]);
    expect(m.get(0)).toBeInstanceOf(NDArray);
    m.set(0, 1, 9);
    expect(m.get(0, 1)).toBe(9);
    const s = m.slice(0, 1);
    expect(s.shape[0]).toBe(1);
    const f = a.filter([1, 0, 1]);
    expect(f.data).toEqual([10, 30]);
    const fx = m.fancy([0, -1]);
    expect(fx.shape[0]).toBe(2);
  });

  it('broadcasting _ew and scalars', () => {
    const a = new NDArray([[1, 2, 3], [4, 5, 6]], [2, 3]);
    const row = new NDArray([10, 20, 30]);
    const col = new NDArray([[1], [2]], [2, 1]);
    expect(a.add(1).get(0, 0)).toBe(2);
    expect(a.mul(row).get(0, 1)).toBe(40);
    expect(a.add(col).get(1, 0)).toBe(6);
    const one = new NDArray([99]);
    expect(a.add(one).get(0, 0)).toBe(100);
    const o2 = new NDArray([[1, 2]], [1, 2]);
    expect(() => a.add(o2)).toThrow(/Shape mismatch/);
    expect(() => a.add('x' as unknown as number)).toThrow(/Unsupported operand/);
  });

  it('comparisons', () => {
    const a = new NDArray([1, 2, 3]);
    expect(a.gt(1).data).toEqual([0, 1, 1]);
    expect(a.eq(new NDArray([1, 2, 4])).data).toEqual([1, 1, 0]);
    expect(() => a.gt('x' as unknown as number)).toThrow(/Bad comparison/);
  });

  it('sum mean std min max arg', () => {
    const a = new NDArray([[1, 2], [3, 4]], [2, 2]);
    expect(a.sum()).toBe(10);
    expect((a.sum(1) as NDArray).data).toEqual([3, 7]);
    expect((a.sum(0) as NDArray).data).toEqual([4, 6]);
    expect(a.mean()).toBe(2.5);
    expect(a.std()).toBeGreaterThan(0);
    expect(a.min()).toBe(1);
    expect(a.max()).toBe(4);
    expect(a.argmax()).toBe(3);
    expect(a.argmin()).toBe(0);
    expect(() => new NDArray([1, 2]).sum(0)).toThrow(/axis only for 2D/);
  });

  it('dtype and string toString', () => {
    const n = new NDArray(['ab', 'c']);
    expect(n.dtype.startsWith('<U')).toBe(true);
    expect(n.toString()).toContain("'ab'");
    const f = new NDArray([1.5]);
    expect(f.dtype).toBe('float64');
    const i = new NDArray([1, 2, 3]);
    expect(i.dtype).toBe('int64');
  });

  it('ndim>2 toString uses JSON', () => {
    const a = new NDArray([[[1, 2]], [[3, 4]]]);
    expect(a.ndim).toBe(3);
    expect(a.toString()).toContain('1');
  });
});

describe('NP', () => {
  it('constants and factories', () => {
    expect(NP.pi).toBe(Math.PI);
    expect(NP.zeros(2).data).toEqual([0, 0]);
    expect(NP.ones([2, 2]).data.every((v) => v === 1)).toBe(true);
    expect(NP.full(3, 5).data).toEqual([5, 5, 5]);
  });

  it('arange linspace', () => {
    expect(NP.arange(3).data).toEqual([0, 1, 2]);
    expect(NP.arange(2, 5).data).toEqual([2, 3, 4]);
    expect(NP.arange(3, 0, -1).data).toEqual([3, 2, 1]);
    expect(NP.linspace(0, 1, 1).data).toEqual([0]);
    expect(NP.linspace(0, 1, 2).data).toEqual([0, 1]);
  });

  it('ufuncs', () => {
    const a = new NDArray([0, Math.PI / 2]);
    expect(NP.sin(a).get(0)).toBe(0);
    expect(NP.cos(a).get(1)).toBeCloseTo(0, 5);
    expect(NP.round(new NDArray([1.234]), 2).get(0)).toBeCloseTo(1.23, 2);
  });

  it('where', () => {
    const c = new NDArray([1, 0, 1]);
    const x = new NDArray([1, 2, 3]);
    const y = new NDArray([4, 5, 6]);
    expect(NP.where(c, x, y).data).toEqual([1, 5, 3]);
    expect(NP.where(c, x, 0).data).toEqual([1, 0, 3]);
    expect(NP.where(c, 9, y).data).toEqual([9, 5, 9]);
    expect(NP.where(c, 1, 0).data).toEqual([1, 0, 1]);
  });

  it('sort argsort unique', () => {
    const a = new NDArray([3, 1, 2]);
    expect(NP.sort(a).data).toEqual([1, 2, 3]);
    const m = new NDArray([[3, 1], [2, 4]], [2, 2]);
    const s1 = NP.sort(m, 1);
    expect(s1.get(0, 0)).toBe(1);
    const u = NP.unique(new NDArray([2, 1, 2]));
    expect(u.data).toEqual([1, 2]);
  });

  it('dot matmul', () => {
    const u = new NDArray([1, 2, 3]);
    const v = new NDArray([1, 1, 1]);
    expect(NP.dot(u, v)).toBe(6);
    const A = new NDArray([[1, 2], [3, 4]], [2, 2]);
    const B = new NDArray([[1, 0], [0, 1]], [2, 2]);
    const P = NP.matmul(A, B);
    expect(P.shape).toEqual([2, 2]);
    const x = new NDArray([1, 2]);
    const y = NP.matmul(A, x);
    expect(y.shape).toEqual([2]);
    expect(() => NP.matmul(u, A)).toThrow(/matmul shape mismatch/);
  });

  it('allclose array_equal isclose', () => {
    expect(NP.allclose(new NDArray([1]), new NDArray([1.00000001]))).toBe(true);
    expect(NP.allclose([1, 2], [1, 2])).toBe(true);
    expect(NP.allclose(1, 1.1, 0.2)).toBe(true);
    expect(NP.array_equal(new NDArray([1, 2]), new NDArray([1, 2]))).toBe(true);
    expect(NP.isclose(1, 1.00001, 1e-2)).toBe(true);
  });

  it('vstack hstack concatenate', () => {
    const a = new NDArray([1, 2]);
    const b = new NDArray([3, 4]);
    const h = NP.hstack([a, b]);
    expect(h.shape).toEqual([4]);
    const m1 = new NDArray([[1, 2]], [1, 2]);
    const m2 = new NDArray([[3, 4]], [1, 2]);
    const v = NP.vstack([m1, m2]);
    expect(v.shape).toEqual([2, 2]);
    expect(NP.concatenate([a, b]).data).toEqual(h.data);
    expect(NP.concatenate([m1, m2], 1).shape).toEqual([2, 2]);
  });

  it('linalg', () => {
    const A2 = new NDArray([[1, 2], [3, 4]], [2, 2]);
    expect(NP.linalg.det(A2)).toBe(-2);
    const A3 = new NDArray([1, 0, 0, 0, 1, 0, 0, 0, 1], [3, 3]);
    expect(NP.linalg.det(A3)).toBe(1);
    expect(() => NP.linalg.det(new NDArray([1, 2, 3, 4], [2, 2]))).not.toThrow();
    const inv = NP.linalg.inv(A2);
    expect(inv.shape).toEqual([2, 2]);
    expect(() => NP.linalg.inv(new NDArray([[1, 2], [2, 4]], [2, 2]))).toThrow(/Singular/);
    expect(NP.linalg.norm(new NDArray([3, 4]))).toBe(5);
    const sol = NP.linalg.solve(A2, new NDArray([1, 1], [2, 1]));
    expect(sol.shape).toEqual([2, 1]);
    expect(() => NP.linalg.det(new NDArray([1], [1, 1]))).toThrow(/det only/);
  });

  it('char', () => {
    const s = new NDArray(['ab', 'CD']);
    expect(NP.char.upper(s).get(0)).toBe('AB');
    expect(NP.char.lower(s).get(1)).toBe('cd');
    expect(NP.char.capitalize(s).get(1)).toBe('Cd');
    expect(NP.char.str_len(s).get(0)).toBe(2);
    expect(NP.char.add(s, '!').get(0)).toBe('ab!');
  });

  it('random', () => {
    const rng = NP.random.default_rng(42);
    const r = rng.random(3) as NDArray;
    expect(r.data.length).toBe(3);
    const one = rng.random() as number;
    expect(typeof one).toBe('number');
    const ints = rng.integers(0, 10, 5) as NDArray;
    expect(ints.data.every((n) => n >= 0 && n < 10)).toBe(true);
    const g = rng.normal(0, 1, 4) as NDArray;
    expect(g.data.length).toBe(4);
    const sh = rng.random([2, 3]) as NDArray;
    expect(sh.shape).toEqual([2, 3]);
  });

  it('extra ufuncs dot 2d and hstack 2d', () => {
    NP.tan(new NDArray([0, 0.5]));
    NP.exp(new NDArray([0]));
    NP.log(new NDArray([1, Math.E]));
    NP.sqrt(new NDArray([0, 9]));
    const A = new NDArray([[1, 0], [0, 1]], [2, 2]);
    const B = new NDArray([[2, 3], [4, 5]], [2, 2]);
    expect(NP.dot(A, B).shape).toEqual([2, 2]);
    const r1 = new NDArray([[1, 2]], [1, 2]);
    const r2 = new NDArray([[3, 4]], [1, 2]);
    expect(NP.hstack([r1, r2]).shape).toEqual([1, 4]);
    expect(NP.concatenate([r1, r2], 1).shape).toEqual([2, 2]);
  });
});
