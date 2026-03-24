/* eslint-disable @typescript-eslint/no-explicit-any */

const isBrowser = typeof window !== 'undefined';

/** Last lesson URL slug (for tab switches from quiz/scenario). */
export const KEY_LAST_LESSON_SLUG = 'np_dojo_last_lesson_slug';
/** Last scenario id in URL form. */
export const KEY_LAST_SCENARIO_ID = 'np_dojo_last_scenario_id';

export function loadJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: any) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export function loadSet(key: string): Set<number> {
  const arr = loadJSON<number[]>(key, []);
  return new Set(arr);
}

export function saveSet(key: string, set: Set<number>) {
  saveJSON(key, Array.from(set));
}

export function loadString(key: string, fallback: string): string {
  if (!isBrowser) return fallback;
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function saveString(key: string, value: string) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch { /* ignore */ }
}

export interface QuizHistoryEntry {
  id: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  questions: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
    lessonRef?: { index: number; title: string };
  }[];
}

export function loadQuizHistory(): QuizHistoryEntry[] {
  return loadJSON<QuizHistoryEntry[]>('np_dojo_quiz_history', []);
}

export function saveQuizHistory(history: QuizHistoryEntry[]) {
  saveJSON('np_dojo_quiz_history', history);
}
