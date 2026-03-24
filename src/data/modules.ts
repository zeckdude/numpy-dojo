import { Lesson } from './types';

/** Short blurbs for each curriculum section (matches `lesson.section` strings). */
export const MODULE_DESCRIPTIONS: Record<string, string> = {
  Foundations:
    'Arrays, shapes, dtypes, and building blocks—everything later lessons assume you know.',
  'Indexing & Slicing':
    'Select and filter data with indices, slices, booleans, and fancy indexing—core data wrangling skills.',
  Operations:
    'Vectorized math, reductions, and ufuncs: the fast path to numerical work in NumPy.',
  Reshaping:
    'Change layout without losing data: reshape, transpose, stack, and split.',
  Broadcasting:
    'Let NumPy align shapes for you so operations work on mixed-sized arrays safely.',
  'Copies & Views':
    'Know when slices share memory versus when you need an explicit copy—avoids subtle bugs.',
  'Advanced Ops':
    'Conditional logic, sorting, and string utilities for richer array workflows.',
  'Linear Algebra':
    'Dot products, matrix math, inverses, and solving systems—connect arrays to classical LA.',
};

export interface ModuleSummary {
  section: string;
  description: string;
  startLessonIndex: number;
  lessonCount: number;
}

/** Ordered module list derived from the lesson sequence (first occurrence defines order). */
export function getModulesFromLessons(lessons: Lesson[]): ModuleSummary[] {
  const bySection = new Map<string, { start: number; count: number }>();

  lessons.forEach((lesson, i) => {
    const cur = bySection.get(lesson.section);
    if (!cur) {
      bySection.set(lesson.section, { start: i, count: 1 });
    } else {
      cur.count += 1;
    }
  });

  const order: string[] = [];
  for (const l of lessons) {
    if (!order.includes(l.section)) order.push(l.section);
  }

  return order.map((section) => {
    const meta = bySection.get(section)!;
    return {
      section,
      description: MODULE_DESCRIPTIONS[section] ?? '',
      startLessonIndex: meta.start,
      lessonCount: meta.count,
    };
  });
}
