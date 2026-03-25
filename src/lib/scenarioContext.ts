/** Escape plain-text scenario context; leave HTML fragments unchanged. */
export function scenarioContextHtml(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('<')) return raw;
  return `<p>${raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
}
