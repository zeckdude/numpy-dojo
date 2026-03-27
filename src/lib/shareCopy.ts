/** User-visible share strings and matching SEO/social metadata copy. */

export const SITE_NAME = 'NumPy Dojo';

export const DEFAULT_SHARE_TITLE = `${SITE_NAME} — Learn NumPy by doing`;

export const DEFAULT_SHARE_DESCRIPTION =
  'Hands-on NumPy lessons with a live editor in the browser. Everything is free: no paywall, no account. Scenarios and quizzes cover arrays, indexing, broadcasting, and more.';

/** Alias for share APIs that use `text` (same copy as meta description). */
export const DEFAULT_SHARE_TEXT = DEFAULT_SHARE_DESCRIPTION;

export function lessonShareTitle(lessonTitle: string): string {
  return `${lessonTitle} · ${SITE_NAME}`;
}

export function lessonShareText(lessonTitle: string): string {
  return `Try the “${lessonTitle}” lesson on ${SITE_NAME}: guided steps and a live NumPy editor. Free to use; no signup.`;
}

export function lessonOgDescription(lessonTitle: string): string {
  return `${lessonTitle} — a hands-on NumPy lesson on ${SITE_NAME} with short explanations, a live editor, and instant checks. Free; no account required.`;
}

export function scenarioShareTitle(scenarioTitle: string): string {
  return `${scenarioTitle} · ${SITE_NAME}`;
}

export function scenarioShareText(scenarioTitle: string): string {
  return `Work through “${scenarioTitle}” on ${SITE_NAME}: multi-step NumPy exercises in the browser. Free to use; no signup.`;
}

export function scenarioOgDescription(scenarioTitle: string, contextPlain: string): string {
  const lead = contextPlain ? truncateMetaDescription(contextPlain, 130) : '';
  const closing = ` Available free on ${SITE_NAME}; no account.`;
  if (!lead) {
    return `Practice real-world NumPy in “${scenarioTitle}”: a multi-step scenario on ${SITE_NAME}. Free; no signup.`;
  }
  return truncateMetaDescription(`${lead}${closing}`, 200);
}

export const QUIZ_SHARE_TITLE = `${SITE_NAME} — Quizzes`;

export const QUIZ_SHARE_TEXT = `NumPy quizzes on ${SITE_NAME} with instant feedback on every answer. Free; no account.`;

export const QUIZ_OG_DESCRIPTION =
  'Adaptive NumPy quizzes with instant feedback, aligned with the lesson path. Free on NumPy Dojo; no signup.';

export const LESSONS_INDEX_TITLE = `Lessons · ${SITE_NAME}`;

export const LESSONS_INDEX_DESCRIPTION =
  'Guided NumPy lessons from your first array through indexing, broadcasting, and linear algebra. Each lesson includes a live editor in the browser. Free; no account.';

export const SCENARIOS_INDEX_TITLE = `Scenarios · ${SITE_NAME}`;

export const SCENARIOS_INDEX_DESCRIPTION =
  'Real-world NumPy scenarios: longer multi-step exercises that build on the lessons. Run in the browser on NumPy Dojo—free, with no paywall.';

export function truncateMetaDescription(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  return `${base}…`;
}
