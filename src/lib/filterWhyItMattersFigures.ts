/**
 * Remove <figure>...</figure> blocks whose <img src="..."> is not in `existing`.
 * If `existing` is undefined, the HTML is unchanged (all figures kept).
 */
export function filterWhyItMattersFiguresByExistingSrcs(
  html: string,
  existing: ReadonlySet<string> | undefined
): string {
  if (existing === undefined) return html;
  return html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (figureHtml) => {
    const m = figureHtml.match(/<img[^>]*src\s*=\s*["']([^"']+)["']/i);
    const src = m?.[1];
    if (!src) return figureHtml;
    return existing.has(src) ? figureHtml : '';
  });
}
