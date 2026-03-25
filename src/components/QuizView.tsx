'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { quizPool } from '../data/quizzes';
import { QuizQuestion } from '../data/types';
import { lessonSlugAt } from '../lib/routes';
import { loadQuizHistory, saveQuizHistory, QuizHistoryEntry } from '../lib/storage';
import { ShareSiteMenu } from './ShareSiteMenu';

interface Props {
  toast: (msg: string) => void;
}

type Phase = 'setup' | 'active' | 'retry' | 'results' | 'history';

interface AnswerRecord {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
  lessonRef: { index: number; title: string };
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizView({ toast }: Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [questionCount, setQuestionCount] = useState(15);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [retryQuestions, setRetryQuestions] = useState<QuizQuestion[]>([]);
  const [retryAnswers, setRetryAnswers] = useState<AnswerRecord[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadQuizHistory());
  }, []);

  const startQuiz = useCallback(() => {
    const shuffled = shuffleArray(quizPool).slice(0, questionCount);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setAnswers([]);
    setRetryQuestions([]);
    setRetryAnswers([]);
    setSelectedChoice(null);
    setShortAnswer('');
    setFeedback(null);
    setPhase('active');
  }, [questionCount]);

  const currentQuestion = phase === 'retry'
    ? retryQuestions[currentIdx]
    : questions[currentIdx];

  const submitAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const userAns = currentQuestion.format === 'short_answer' || currentQuestion.format === 'code_output'
      ? shortAnswer.trim()
      : selectedChoice || '';

    let correct = false;
    if (currentQuestion.format === 'short_answer') {
      correct = userAns.toLowerCase().replace(/[^a-z0-9@_.]/g, '') === currentQuestion.correctAnswer.toLowerCase().replace(/[^a-z0-9@_.]/g, '');
    } else if (currentQuestion.format === 'code_output') {
      correct = userAns.replace(/\s/g, '') === currentQuestion.correctAnswer.replace(/\s/g, '');
    } else {
      correct = userAns === currentQuestion.correctAnswer;
    }

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: userAns,
      correctAnswer: currentQuestion.correctAnswer,
      correct,
      lessonRef: currentQuestion.lessonRef,
    };

    setFeedback({ correct, explanation: currentQuestion.explanation });

    if (phase === 'retry') {
      setRetryAnswers(prev => [...prev, record]);
    } else {
      setAnswers(prev => [...prev, record]);
    }
  }, [currentQuestion, selectedChoice, shortAnswer, phase]);

  const nextQuestion = useCallback(() => {
    setSelectedChoice(null);
    setShortAnswer('');
    setFeedback(null);

    const isRetry = phase === 'retry';
    const pool = isRetry ? retryQuestions : questions;

    if (currentIdx < pool.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      if (!isRetry) {
        // Check for wrong answers to retry
        const wrong = answers.filter(a => !a.correct);
        // Include the current answer if it was just added
        const allAnswers = [...answers];
        const lastFeedback = feedback;
        if (lastFeedback && !lastFeedback.correct && currentQuestion) {
          // The wrong answer was already added via submitAnswer
        }

        const wrongFromAll = [...allAnswers].filter(a => !a.correct);
        const wrongQs = wrongFromAll.map(a => quizPool.find(q => q.id === a.questionId)!).filter(Boolean);

        if (wrongQs.length > 0) {
          setRetryQuestions(wrongQs);
          setRetryAnswers([]);
          setCurrentIdx(0);
          setPhase('retry');
          toast(`${wrongQs.length} question${wrongQs.length > 1 ? 's' : ''} to retry!`);
        } else {
          finishQuiz(allAnswers, []);
        }
      } else {
        finishQuiz(answers, retryAnswers);
      }
    }
  }, [phase, currentIdx, questions, retryQuestions, answers, retryAnswers, feedback, currentQuestion, toast]);

  const finishQuiz = useCallback((firstRound: AnswerRecord[], retry: AnswerRecord[]) => {
    const allRecords = [...firstRound];
    // Update with retry results
    retry.forEach(r => {
      const idx = allRecords.findIndex(a => a.questionId === r.questionId);
      if (idx >= 0) allRecords[idx] = { ...allRecords[idx], correct: r.correct, userAnswer: r.userAnswer };
    });

    const entry: QuizHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      totalQuestions: allRecords.length,
      correctCount: allRecords.filter(a => a.correct).length,
      questions: allRecords.map(a => ({
        questionId: a.questionId,
        question: a.question,
        userAnswer: a.userAnswer,
        correctAnswer: a.correctAnswer,
        correct: a.correct,
        lessonRef: a.lessonRef,
      })),
    };

    const updated = [entry, ...loadQuizHistory()].slice(0, 50); // keep last 50
    saveQuizHistory(updated);
    setHistory(updated);
    setAnswers(allRecords);
    setPhase('results');
  }, []);

  // ─── SETUP SCREEN ───
  if (phase === 'setup') {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        <div className="quiz-container" style={{ flex: 1 }}>
          <div className="quiz-setup">
            <h2>🧠 NumPy Knowledge Quiz</h2>
            <p>Test your understanding of NumPy — not just how, but when and why to use each feature.</p>

            <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-mid)' }}>Number of questions:</div>
            <div className="quiz-option-group">
              {[10, 15, 20, 25].map(n => (
                <button
                  key={n}
                  className={`quiz-option-btn ${questionCount === n ? 'selected' : ''}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>

            <button className="quiz-start-btn" onClick={startQuiz}>Start Quiz</button>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <ShareSiteMenu
                title="NumPy Dojo — Quizzes"
                text="Free NumPy quizzes with instant feedback on NumPy Dojo."
                ariaLabel="Share NumPy Dojo quizzes"
                variant="compact"
              />
            </div>

            {history.length > 0 && (
              <div style={{ marginTop: 40, textAlign: 'left' }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  📊 Quiz History
                  <button className="sm-btn" onClick={() => setPhase('history')} style={{ marginTop: 0 }}>
                    View All →
                  </button>
                </h3>
                {history.slice(0, 3).map(entry => (
                  <QuizHistoryCard
                    key={entry.id}
                    entry={entry}
                    expanded={expandedHistory === entry.id}
                    onToggle={() => setExpandedHistory(expandedHistory === entry.id ? null : entry.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── HISTORY SCREEN ───
  if (phase === 'history') {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        <div className="quiz-container" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button className="sm-btn" onClick={() => setPhase('setup')} style={{ marginTop: 0 }}>← Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24 }}>📊 Quiz History</h2>
          </div>

          {history.length === 0 ? (
            <p style={{ color: 'var(--text-mid)' }}>No quizzes taken yet.</p>
          ) : (
            history.map(entry => (
              <QuizHistoryCard
                key={entry.id}
                entry={entry}
                expanded={expandedHistory === entry.id}
                onToggle={() => setExpandedHistory(expandedHistory === entry.id ? null : entry.id)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS SCREEN ───
  if (phase === 'results') {
    const correct = answers.filter(a => a.correct).length;
    const total = answers.length;
    const pct = Math.round((correct / total) * 100);
    const scoreClass = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';

    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        <div className="quiz-container" style={{ flex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{pct >= 80 ? '🎉' : pct >= 60 ? '📈' : '💪'}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>Quiz Complete!</h2>
            <div className={`quiz-score ${scoreClass}`} style={{ fontSize: 36, marginTop: 8 }}>{correct}/{total}</div>
            <p style={{ color: 'var(--text-mid)', marginTop: 8 }}>{pct}% correct</p>
          </div>

          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Review</h3>
          {answers.map((a, i) => (
            <div key={i} className="quiz-history-row" style={{ padding: '12px 16px', marginBottom: 8, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span className="indicator">{a.correct ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 4 }}>{a.question}</div>
                {!a.correct && (
                  <>
                    <div style={{ fontSize: 11, color: 'var(--error)' }}>Your answer: {a.userAnswer || '(none)'}</div>
                    <div style={{ fontSize: 11, color: 'var(--success)' }}>Correct: {a.correctAnswer}</div>
                    <Link
                      href={`/lessons/${lessonSlugAt(a.lessonRef.index)}`}
                      className="lesson-link"
                    >
                      📘 Review: {a.lessonRef.title}
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}

          <div
            style={{
              textAlign: 'center',
              marginTop: 24,
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button className="quiz-start-btn" onClick={startQuiz}>Take Another Quiz</button>
            <button className="sm-btn" onClick={() => setPhase('setup')} style={{ marginTop: 0 }}>Back to Setup</button>
            <ShareSiteMenu
              title="NumPy Dojo — Quizzes"
              text="Free NumPy quizzes with instant feedback on NumPy Dojo."
              ariaLabel="Share NumPy Dojo quizzes"
              variant="compact"
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE / RETRY QUESTION ───
  if (!currentQuestion) return null;

  const isRetryPhase = phase === 'retry';
  const pool = isRetryPhase ? retryQuestions : questions;
  const answered = feedback !== null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
      <div className="quiz-container" style={{ flex: 1 }}>
        <div className="quiz-progress">
          {isRetryPhase ? '🔄 Retry Round — ' : ''}
          Question {currentIdx + 1} of {pool.length}
          {isRetryPhase && <span style={{ color: 'var(--warn)' }}> (missed questions)</span>}
        </div>

        <div className="quiz-question">
          <h3>{currentQuestion.question}</h3>

          {currentQuestion.code && (
            <pre>{currentQuestion.code}</pre>
          )}

          {/* Multiple choice / True-false */}
          {(currentQuestion.format === 'multiple_choice' || currentQuestion.format === 'true_false') && (
            <div className="quiz-choices">
              {currentQuestion.choices!.map(choice => {
                let cls = 'quiz-choice';
                if (answered) {
                  if (choice === currentQuestion.correctAnswer) cls += ' correct';
                  else if (choice === selectedChoice && !feedback?.correct) cls += ' wrong';
                } else if (choice === selectedChoice) {
                  cls += ' selected';
                }

                return (
                  <button
                    key={choice}
                    className={cls}
                    onClick={() => !answered && setSelectedChoice(choice)}
                    disabled={answered}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          )}

          {/* Short answer / Code output */}
          {(currentQuestion.format === 'short_answer' || currentQuestion.format === 'code_output') && (
            <div>
              <input
                type="text"
                className="quiz-input"
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                placeholder={currentQuestion.format === 'code_output' ? 'What does this code output?' : 'Type your answer...'}
                disabled={answered}
                onKeyDown={(e) => { if (e.key === 'Enter' && !answered && shortAnswer.trim()) submitAnswer(); }}
              />
            </div>
          )}

          {/* Submit button */}
          {!answered && (
            <button
              className="quiz-submit"
              onClick={submitAnswer}
              disabled={!selectedChoice && !shortAnswer.trim()}
            >
              Submit Answer
            </button>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`quiz-feedback ${feedback.correct ? 'correct' : 'wrong'}`}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {feedback.correct ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <div>{feedback.explanation}</div>
              {!feedback.correct && (
                <div style={{ marginTop: 8 }}>
                  <Link
                    href={`/lessons/${lessonSlugAt(currentQuestion.lessonRef.index)}`}
                    className="lesson-link"
                  >
                    📘 Review: {currentQuestion.lessonRef.title}
                  </Link>
                </div>
              )}
              <button className="quiz-submit" onClick={nextQuestion} style={{ marginTop: 12 }}>
                {currentIdx < pool.length - 1 ? 'Next Question →' : isRetryPhase ? 'See Results' : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── History Card ───
function QuizHistoryCard({
  entry,
  expanded,
  onToggle,
}: {
  entry: QuizHistoryEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pct = Math.round((entry.correctCount / entry.totalQuestions) * 100);
  const scoreClass = pct >= 80 ? 'good' : pct >= 60 ? 'mid' : 'bad';

  return (
    <div className="quiz-history-card" onClick={onToggle}>
      <div className="quiz-history-header">
        <div className={`quiz-score ${scoreClass}`}>
          {entry.correctCount}/{entry.totalQuestions} ({pct}%)
        </div>
        <div className="quiz-date">{entry.date}</div>
      </div>

      {expanded && (
        <div className="quiz-history-detail">
          {entry.questions.map((q, i) => (
            <div key={i} className="quiz-history-row">
              <span className="indicator">{q.correct ? '✅' : '❌'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12 }}>{q.question}</div>
                {!q.correct && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--error)' }}>Yours: {q.userAnswer || '(none)'}</span>
                    <span style={{ fontSize: 11, color: 'var(--success)', marginLeft: 12 }}>Correct: {q.correctAnswer}</span>
                    {q.lessonRef && (
                      <Link
                        href={`/lessons/${lessonSlugAt(q.lessonRef.index)}`}
                        className="lesson-link"
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginLeft: 12 }}
                      >
                        📘 {q.lessonRef.title}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
