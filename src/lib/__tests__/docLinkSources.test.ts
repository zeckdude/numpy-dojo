import { describe, expect, it } from 'vitest';
import { docLinkLogoProps, resolveDocLinkSource } from '../docLinkSources';

describe('docLinkSources', () => {
  it('resolves numpy.org', () => {
    expect(resolveDocLinkSource('https://numpy.org/doc/')).toBe('numpy');
    expect(resolveDocLinkSource('https://docs.numpy.org/foo')).toBe('numpy');
  });

  it('defaults for bad URL', () => {
    expect(resolveDocLinkSource('not-a-url')).toBe('numpy');
  });

  it('docLinkLogoProps', () => {
    const p = docLinkLogoProps('https://numpy.org/doc/stable/');
    expect(p.src).toBe('/logos/numpy-logo.svg');
    expect(p.alt).toContain('NumPy');
  });
});
