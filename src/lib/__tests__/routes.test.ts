import { describe, expect, it } from 'vitest';
import {
  LESSON_PATH_SLUGS,
  SCENARIO_PATH_IDS,
  lessonIndexFromSlug,
  lessonSlugAt,
  lessonSlugFromTitle,
  scenarioIndexFromId,
} from '../routes';

describe('routes', () => {
  it('slugifies titles', () => {
    expect(lessonSlugFromTitle('Foo & Bar')).toBe('foo-and-bar');
    expect(lessonSlugFromTitle('A---B__c')).toMatch(/^a-b-c$/);
  });

  it('lessonSlugAt matches LESSON_PATH_SLUGS', () => {
    expect(lessonSlugAt(0)).toBe(LESSON_PATH_SLUGS[0]);
  });

  it('lessonIndexFromSlug round-trips first lesson', () => {
    const slug = LESSON_PATH_SLUGS[0];
    expect(lessonIndexFromSlug(slug)).toBe(0);
    expect(lessonIndexFromSlug('__no_such_slug__')).toBeNull();
  });

  it('scenario paths align with scenarioIndexFromId', () => {
    const id = SCENARIO_PATH_IDS[0];
    expect(scenarioIndexFromId(id)).toBe(0);
    expect(scenarioIndexFromId('missing')).toBeNull();
  });

  it('has unique lesson slugs invariant', () => {
    expect(new Set(LESSON_PATH_SLUGS).size).toBe(LESSON_PATH_SLUGS.length);
  });
});
