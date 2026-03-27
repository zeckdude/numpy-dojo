import { beforeEach, describe, expect, it, vi } from 'vitest';

const readdirSync = vi.fn();

vi.mock('fs', () => ({
  default: { readdirSync },
  readdirSync,
}));

describe('illustrationPaths', () => {
  beforeEach(() => {
    readdirSync.mockReset();
    vi.resetModules();
  });

  it('returns [] on read error', async () => {
    readdirSync.mockImplementation(() => {
      throw new Error('no dir');
    });
    const { getExistingWhyIllustrationSrcs } = await import('../illustrationPaths');
    expect(getExistingWhyIllustrationSrcs()).toEqual([]);
  });

  it('filters why- illustration files', async () => {
    readdirSync.mockReturnValue(['why-a.png', 'nope.txt', 'why-b.webp', 'other.png']);
    const { getExistingWhyIllustrationSrcs } = await import('../illustrationPaths');
    const srcs = getExistingWhyIllustrationSrcs();
    expect(srcs).toContain('/illustrations/why-a.png');
    expect(srcs).toContain('/illustrations/why-b.webp');
    expect(srcs.some((s) => s.includes('nope'))).toBe(false);
  });
});
