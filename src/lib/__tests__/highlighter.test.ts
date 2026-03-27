import { describe, expect, it } from 'vitest';
import { highlightPython } from '../highlighter';

describe('highlightPython', () => {
  it(
    'returns HTML for python',
    async () => {
      const html = await highlightPython('x = 1\n');
      expect(html.length).toBeGreaterThan(10);
      expect(html).toContain('x');
    },
    30_000
  );
});
