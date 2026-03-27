import { describe, expect, it } from 'vitest';
import { getModulesFromLessons, MODULE_DESCRIPTIONS } from '../modules';
import { LESSON_DOC_LINKS } from '../lessonDocLinks';
import { lessons } from '../lessons';
import { scenarios } from '../scenarios';
import { quizPool } from '../quizzes';

describe('data modules', () => {
  it('lessons and doc links stay aligned', () => {
    expect(LESSON_DOC_LINKS.length).toBe(lessons.length);
  });

  it('exports non-empty curriculum data', () => {
    expect(lessons.length).toBeGreaterThan(0);
    expect(scenarios.length).toBeGreaterThan(0);
    expect(quizPool.length).toBeGreaterThan(0);
    expect(Object.keys(MODULE_DESCRIPTIONS).length).toBeGreaterThan(0);
    expect(getModulesFromLessons(lessons).length).toBeGreaterThan(0);
  });
});
