import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { QuizHistoryEntry } from '../../lib/storage';
import { QuizView } from '../QuizView';

const quizStore = vi.hoisted(() => {
  let history: QuizHistoryEntry[] = [];
  return {
    getHistory: () => history,
    setHistory: (h: QuizHistoryEntry[]) => {
      history = h;
    },
    reset: () => {
      history = [];
    },
  };
});

vi.mock('../../data/quizzes', () => ({
  quizPool: [
    {
      id: 'mt1',
      format: 'multiple_choice',
      question: 'Choose A',
      choices: ['A', 'B'],
      correctAnswer: 'A',
      explanation: 'A is right',
      lessonRef: { index: 0, title: 'Lesson Zero' },
      category: 'how',
    },
    {
      id: 'mt2',
      format: 'multiple_choice',
      question: 'Choose Y',
      choices: ['X', 'Y'],
      correctAnswer: 'Y',
      explanation: 'Y is right',
      lessonRef: { index: 0, title: 'Lesson Zero' },
      category: 'how',
    },
  ],
}));

vi.mock('../../lib/storage', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../lib/storage')>();
  return {
    ...mod,
    loadQuizHistory: () => quizStore.getHistory(),
    saveQuizHistory: (h: QuizHistoryEntry[]) => quizStore.setHistory(h),
  };
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('../ShareSiteMenu', () => ({
  ShareSiteMenu: () => null,
}));

vi.mock('../../lib/analytics', () => ({
  track: vi.fn(),
}));

function quizChoiceButton(label: string) {
  const buttons = screen.getAllByRole('button');
  const found = buttons.find(
    (b) => b.classList.contains('quiz-choice') && b.textContent?.trim() === label
  );
  if (!found) throw new Error(`Missing quiz choice: ${label}`);
  return found;
}

describe('QuizView', () => {
  const toast = vi.fn();

  beforeEach(() => {
    quizStore.reset();
    toast.mockClear();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
  });

  afterEach(() => {
    vi.spyOn(Math, 'random').mockRestore();
  });

  it('completes a quiz with all correct and saves history', async () => {
    const user = userEvent.setup();
    render(<QuizView toast={toast} />);

    await user.click(screen.getByRole('button', { name: /start quiz/i }));

    await user.click(quizChoiceButton('A'));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /next question/i }));

    await user.click(quizChoiceButton('Y'));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('heading', { name: /quiz complete/i })).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(quizStore.getHistory()).toHaveLength(1);
    expect(quizStore.getHistory()[0].correctCount).toBe(2);
    expect(quizStore.getHistory()[0].totalQuestions).toBe(2);
  });

  it('enters retry round after a wrong answer and can finish', async () => {
    const user = userEvent.setup();
    render(<QuizView toast={toast} />);

    await user.click(screen.getByRole('button', { name: /start quiz/i }));

    await user.click(quizChoiceButton('B'));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /next question/i }));

    await user.click(quizChoiceButton('Y'));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(toast).toHaveBeenCalledWith(expect.stringMatching(/retry/i));
    expect(screen.getByText(/retry round/i)).toBeInTheDocument();

    await user.click(quizChoiceButton('A'));
    await user.click(screen.getByRole('button', { name: /submit answer/i }));
    await user.click(screen.getByRole('button', { name: /see results/i }));

    expect(screen.getByRole('heading', { name: /quiz complete/i })).toBeInTheDocument();
    expect(quizStore.getHistory()).toHaveLength(1);
  });
});
