import { describe, expect, it } from 'vitest';
import { executeCode } from '../executor';
import { NDArray } from '../numpy';

describe('executeCode', () => {
  it('runs print and assignments', () => {
    const { output, scope } = executeCode('x = 3\nprint(x)');
    expect(output).toEqual(['3']);
    expect(scope.x).toBe(3);
  });

  it('maps np to NP and supports comments', () => {
    const { output } = executeCode('import numpy as np\n# c\nprint(np.arange(3))');
    expect(output.some((l) => l.includes('0'))).toBe(true);
  });

  it('supports @ matmul', () => {
    const { output } = executeCode(`
a = np.array([[1, 2], [3, 4]])
b = np.array([[1, 0], [0, 1]])
print(a @ b)
`);
    expect(output.length).toBe(1);
  });

  it('supports 1d indexing assignment', () => {
    const { scope } = executeCode(`
a = np.array([1, 2, 3])
a[1] = 9
`);
    expect((scope.a as NDArray).get(1)).toBe(9);
  });

  it('maps True/False', () => {
    const { scope } = executeCode('ok = True');
    expect(scope.ok).toBe(true);
  });

  it('boolean indexing with comparisons', () => {
    const { output } = executeCode(`
a = np.array([1, 2, 3, 4])
print(a[a >= 3])
`);
    expect(output[0]).toContain('3');
  });

  it('supports > filter', () => {
    const { output } = executeCode(`
a = np.array([1, 2, 3, 4])
print(a[a > 2])
`);
    expect(output[0]).toContain('3');
  });

  it('fancy integer list indexing', () => {
    const { output } = executeCode(`
a = np.array([10, 20, 30])
print(a[[0, 2]])
`);
    expect(output[0]).toContain('10');
    expect(output[0]).toContain('30');
  });

  it('open-ended slice', () => {
    const { output } = executeCode(`
a = np.array([1, 2, 3, 4])
print(a[1:])
`);
    expect(output[0]).toContain('3');
  });

  it('scalar modulo and power', () => {
    const { output } = executeCode('print(10 % 3)\nprint(2 ** 4)');
    expect(output).toContain('1');
    expect(output).toContain('16');
  });

  it('scalar divided by array', () => {
    const { output } = executeCode(`
a = np.array([2.0, 4.0])
print(8 / a)
`);
    expect(output[0]).toContain('4');
  });

  it('variable fancy index on ndarray', () => {
    const { output } = executeCode(`
a = np.array([1, 2, 3, 4])
idx = np.array([0, 2])
print(a[idx])
`);
    expect(output[0]).toContain('1');
    expect(output[0]).toContain('3');
  });

  it('Shape join print', () => {
    const { output } = executeCode(`
a = np.array([[1, 2]])
print("Shape:", a.shape)
`);
    expect(output[0]).toMatch(/Shape/);
  });
});
