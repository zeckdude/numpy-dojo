/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  KEY_LAST_LESSON_SLUG,
  loadJSON,
  loadQuizHistory,
  loadSet,
  loadString,
  saveJSON,
  saveQuizHistory,
  saveSet,
  saveString,
} from '../storage';

describe('storage', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loadJSON returns fallback when empty or invalid', () => {
    expect(loadJSON('k', 42)).toBe(42);
    localStorage.setItem('k', 'not-json');
    expect(loadJSON('k', 7)).toBe(7);
  });

  it('saveJSON and loadJSON round-trip', () => {
    saveJSON('x', { a: 1 });
    expect(loadJSON('x', null)).toEqual({ a: 1 });
  });

  it('loadSet and saveSet', () => {
    saveSet('s', new Set([1, 2]));
    const s = loadSet('s');
    expect(s.has(1)).toBe(true);
    expect(s.size).toBe(2);
  });

  it('loadString and saveString', () => {
    expect(loadString('m', 'd')).toBe('d');
    saveString('m', 'hi');
    expect(loadString('m', '')).toBe('hi');
  });

  it('quiz history', () => {
    expect(loadQuizHistory()).toEqual([]);
    const h = [
      {
        id: '1',
        date: 'today',
        totalQuestions: 1,
        correctCount: 1,
        questions: [],
      },
    ];
    saveQuizHistory(h);
    expect(loadQuizHistory()).toEqual(h);
  });

  it('exports key constants', () => {
    expect(KEY_LAST_LESSON_SLUG).toContain('lesson');
  });
});
