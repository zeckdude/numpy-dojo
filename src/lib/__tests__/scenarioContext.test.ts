import { describe, expect, it } from 'vitest';
import { scenarioContextHtml } from '../scenarioContext';

describe('scenarioContextHtml', () => {
  it('passes through HTML', () => {
    const h = '<p class="x">ok</p>';
    expect(scenarioContextHtml(h)).toBe(h);
  });

  it('escapes plain text', () => {
    expect(scenarioContextHtml('a < b & c')).toBe('<p>a &lt; b &amp; c</p>');
  });

  it('trims before detecting HTML', () => {
    expect(scenarioContextHtml('  <span>x</span>')).toBe('  <span>x</span>');
  });
});
