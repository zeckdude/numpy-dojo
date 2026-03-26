import type { createHighlighter } from 'shiki';

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((m) =>
      m.createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['python'],
      }),
    );
  }
  return highlighterPromise;
}

export async function highlightPython(code: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: 'python',
    themes: { dark: 'github-dark', light: 'github-light' },
    defaultColor: false,
  });
}
