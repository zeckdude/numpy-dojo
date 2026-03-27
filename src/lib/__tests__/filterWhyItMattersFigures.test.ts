import { describe, expect, it } from 'vitest';
import { filterWhyItMattersFiguresByExistingSrcs } from '../filterWhyItMattersFigures';

describe('filterWhyItMattersFiguresByExistingSrcs', () => {
  const html =
    '<figure><img src="/illustrations/why-a.png"/></figure><p>t</p><figure><img src="/illustrations/missing.png"/></figure>';

  it('returns unchanged when existing is undefined', () => {
    expect(filterWhyItMattersFiguresByExistingSrcs(html, undefined)).toBe(html);
  });

  it('removes figures whose src is not in the set', () => {
    const out = filterWhyItMattersFiguresByExistingSrcs(html, new Set(['/illustrations/why-a.png']));
    expect(out).toContain('why-a.png');
    expect(out).not.toContain('missing.png');
    expect(out).toContain('<p>t</p>');
  });

  it('keeps figure without img src', () => {
    const fig = '<figure>no img</figure>';
    expect(filterWhyItMattersFiguresByExistingSrcs(fig, new Set())).toBe(fig);
  });
});
