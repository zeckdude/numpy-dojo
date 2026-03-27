import { describe, expect, it } from 'vitest';
import { htmlToPlainText } from '../htmlPlainText';

describe('htmlToPlainText', () => {
  it('returns empty for falsy', () => {
    expect(htmlToPlainText('')).toBe('');
  });

  it('strips script and style', () => {
    expect(htmlToPlainText('<script>x</script>Hi<style>a{}</style>')).toBe('Hi');
  });

  it('normalizes breaks and block ends', () => {
    const t = htmlToPlainText('<p>a</p><br/><div>b</div>');
    expect(t).toContain('a');
    expect(t).toContain('b');
  });

  it('decodes entities', () => {
    expect(htmlToPlainText('a&nbsp;b &lt; c &gt; &amp; &quot; &apos;')).toContain('a b < c > & " \'');
    expect(htmlToPlainText('&#65; &#x41;')).toBe('A A');
  });

  it('collapses whitespace', () => {
    expect(htmlToPlainText('  hello   \n  world  ')).toBe('hello world');
  });
});
