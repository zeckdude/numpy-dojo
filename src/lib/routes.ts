import { lessons } from '../data/lessons';
import { scenarios } from '../data/scenarios';

/** URL segment for a lesson (from title). */
export function lessonSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function lessonSlugAt(index: number): string {
  return lessonSlugFromTitle(lessons[index].title);
}

export function lessonIndexFromSlug(slug: string): number | null {
  const idx = lessons.findIndex((l) => lessonSlugFromTitle(l.title) === slug);
  return idx === -1 ? null : idx;
}

export const LESSON_PATH_SLUGS: string[] = lessons.map((l) => lessonSlugFromTitle(l.title));

function assertUniqueLessonSlugs(): void {
  const set = new Set(LESSON_PATH_SLUGS);
  if (set.size !== LESSON_PATH_SLUGS.length) {
    throw new Error('Duplicate lesson URL slugs — fix lesson titles or slug logic');
  }
}

assertUniqueLessonSlugs();

export function scenarioIndexFromId(id: string): number | null {
  const idx = scenarios.findIndex((s) => s.id === id);
  return idx === -1 ? null : idx;
}

export const SCENARIO_PATH_IDS: string[] = scenarios.map((s) => s.id);
