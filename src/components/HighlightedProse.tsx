'use client';

import { useEffect, useState } from 'react';
import { highlightPython } from '../lib/highlighter';

const PYTHON_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 255" width="14" height="14" class="code-sample-icon" aria-hidden="true">' +
  '<defs><linearGradient id="pyA" x1="12.959%" x2="79.639%" y1="12.039%" y2="78.201%"><stop offset="0%" stop-color="#387EB8"/><stop offset="100%" stop-color="#366994"/></linearGradient>' +
  '<linearGradient id="pyB" x1="19.128%" x2="90.742%" y1="20.579%" y2="88.429%"><stop offset="0%" stop-color="#FFE052"/><stop offset="100%" stop-color="#FFC331"/></linearGradient></defs>' +
  '<path fill="url(#pyA)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072ZM92.802 19.66a11.12 11.12 0 1 1 0 22.24 11.12 11.12 0 0 1 0-22.24Z"/>' +
  '<path fill="url(#pyB)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897Zm34.114-19.586a11.12 11.12 0 1 1 0-22.24 11.12 11.12 0 0 1 0 22.24Z"/>' +
  '</svg>';

const PRE_RE = /<pre(?:\s[^>]*)?>([^]*?)<\/pre>/gi;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function wrapHighlighted(shikiHtml: string): string {
  return (
    '<div class="code-sample">' +
    `<div class="code-sample-header">${PYTHON_ICON}<span>Python</span></div>` +
    shikiHtml +
    '</div>'
  );
}

async function enhanceHtml(raw: string): Promise<string> {
  const matches: { full: string; code: string }[] = [];
  let m: RegExpExecArray | null;

  PRE_RE.lastIndex = 0;
  while ((m = PRE_RE.exec(raw)) !== null) {
    matches.push({ full: m[0], code: decodeHtmlEntities(m[1]) });
  }

  if (matches.length === 0) return raw;

  const highlighted = await Promise.all(
    matches.map((entry) => highlightPython(entry.code)),
  );

  let result = raw;
  for (let i = 0; i < matches.length; i++) {
    result = result.replace(matches[i].full, wrapHighlighted(highlighted[i]));
  }
  return result;
}

interface Props {
  html: string;
  className?: string;
}

export function HighlightedProse({ html, className }: Props) {
  const [enhanced, setEnhanced] = useState(html);

  useEffect(() => {
    let cancelled = false;
    enhanceHtml(html).then((result) => {
      if (!cancelled) setEnhanced(result);
    });
    return () => { cancelled = true; };
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: enhanced }}
    />
  );
}
