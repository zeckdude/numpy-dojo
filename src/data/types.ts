/* eslint-disable @typescript-eslint/no-explicit-any */

/** External resource link (opens in new tab). Logo is chosen from URL via `docLinkSources`. */
export interface LessonDocLink {
  label: string;
  href: string;
}

export interface Lesson {
  section: string;
  title: string;
  instruction: string;
  /** Optional HTML: motivation, connections, figures—shown in a collapsed details panel by default. */
  whyItMatters?: string;
  task: string;
  hint: string;
  starter: string;
  validate: (scope: Record<string, any>) => string | true;
}

export interface Scenario {
  id: string;
  title: string;
  section: string;
  /** HTML fragment (paragraphs, figures). Plain text scenarios are escaped when rendered. */
  context: string;
  steps: ScenarioStep[];
  lessonsUsed: number[]; // indices into lessons array
}

export interface ScenarioStep {
  title: string;
  task: string;
  hint: string;
  starter: string;
  validate: (scope: Record<string, any>) => string | true;
}

export type QuizFormat = 'multiple_choice' | 'true_false' | 'short_answer' | 'code_output';

export interface QuizQuestion {
  id: string;
  format: QuizFormat;
  question: string;
  code?: string; // optional code block shown with the question
  choices?: string[]; // for multiple_choice and true_false
  correctAnswer: string;
  explanation: string;
  lessonRef: { index: number; title: string };
  category: 'how' | 'why' | 'when';
}
