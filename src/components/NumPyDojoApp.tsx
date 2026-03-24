'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { lessons } from '../data/lessons';
import { scenarios } from '../data/scenarios';
import { getModulesFromLessons } from '../data/modules';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { LessonView } from './LessonView';
import { ScenarioView } from './ScenarioView';
import { QuizView } from './QuizView';
import { CodeEditor } from './CodeEditor';
import { Toast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';
import {
  loadSet,
  saveSet,
  loadJSON,
  saveJSON,
  loadString,
  saveString,
  KEY_LAST_LESSON_SLUG,
  KEY_LAST_SCENARIO_ID,
} from '../lib/storage';
import { lessonSlugAt, lessonIndexFromSlug, scenarioIndexFromId } from '../lib/routes';

export type TabId = 'lessons' | 'scenarios' | 'quizzes';

export type AppRoute =
  | { kind: 'dashboard' }
  | { kind: 'lesson'; slug: string }
  | { kind: 'scenario'; id: string }
  | { kind: 'quiz' };

export function NumPyDojoApp({ route }: { route: AppRoute }) {
  const router = useRouter();
  const dojoOpen = route.kind !== 'dashboard';

  const lessonSlug = route.kind === 'lesson' ? route.slug : null;
  const scenarioId = route.kind === 'scenario' ? route.id : null;

  const activeTab: TabId =
    route.kind === 'lesson'
      ? 'lessons'
      : route.kind === 'scenario'
        ? 'scenarios'
        : route.kind === 'quiz'
          ? 'quizzes'
          : 'lessons';

  const [currentLesson, setCurrentLesson] = useState(() =>
    route.kind === 'lesson' ? (lessonIndexFromSlug(route.slug) ?? 0) : 0
  );
  const [currentScenario, setCurrentScenario] = useState(() =>
    route.kind === 'scenario' ? (scenarioIndexFromId(route.id) ?? 0) : 0
  );
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [savedCode, setSavedCode] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState('');
  const [dialog, setDialog] = useState<{
    title: string;
    msg: string;
    label: string;
    onConfirm: () => void;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompletedLessons(loadSet('np_dojo'));
    setCompletedScenarios(new Set(loadJSON<string[]>('np_dojo_scenarios', [])));
    setSavedCode(loadJSON('np_dojo_code', {}));

    const fs = loadString('np_dojo_fs', '13.5');
    document.documentElement.style.setProperty('--editor-fs', fs + 'px');

    if (route.kind !== 'lesson') {
      const completed = loadSet('np_dojo');
      for (let i = 0; i < lessons.length; i++) {
        if (!completed.has(i)) {
          setCurrentLesson(i);
          break;
        }
      }
    }

    if (route.kind !== 'scenario') {
      const done = new Set(loadJSON<string[]>('np_dojo_scenarios', []));
      for (let i = 0; i < scenarios.length; i++) {
        if (!done.has(scenarios[i].id)) {
          setCurrentScenario(i);
          break;
        }
      }
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (lessonSlug === null) return;
    const idx = lessonIndexFromSlug(lessonSlug);
    if (idx !== null) setCurrentLesson(idx);
  }, [lessonSlug]);

  useEffect(() => {
    if (scenarioId === null) return;
    const idx = scenarioIndexFromId(scenarioId);
    if (idx !== null) setCurrentScenario(idx);
  }, [scenarioId]);

  useEffect(() => {
    if (!mounted) return;
    saveString(KEY_LAST_LESSON_SLUG, lessonSlugAt(currentLesson));
  }, [currentLesson, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveString(KEY_LAST_SCENARIO_ID, scenarios[currentScenario].id);
  }, [currentScenario, mounted]);

  const saveLessons = useCallback((set: Set<number>) => {
    setCompletedLessons(set);
    saveSet('np_dojo', set);
  }, []);

  const saveScenarioCompletion = useCallback((set: Set<string>) => {
    setCompletedScenarios(set);
    saveJSON('np_dojo_scenarios', Array.from(set));
  }, []);

  const saveCodeForKey = useCallback((key: string, code: string) => {
    setSavedCode((prev) => {
      const next = { ...prev, [key]: code };
      saveJSON('np_dojo_code', next);
      return next;
    });
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  }, []);

  const completeLesson = useCallback(
    (idx: number) => {
      const next = new Set(completedLessons);
      next.add(idx);
      saveLessons(next);
    },
    [completedLessons, saveLessons]
  );

  const resetLesson = useCallback(
    (idx: number) => {
      const next = new Set(completedLessons);
      next.delete(idx);
      saveLessons(next);
      setSavedCode((prev) => {
        const copy = { ...prev };
        delete copy[`lesson_${idx}`];
        saveJSON('np_dojo_code', copy);
        return copy;
      });
    },
    [completedLessons, saveLessons]
  );

  const resetAll = useCallback(() => {
    saveLessons(new Set());
    saveScenarioCompletion(new Set());
    setSavedCode({});
    saveJSON('np_dojo_code', {});
    setCurrentLesson(0);
  }, [saveLessons, saveScenarioCompletion]);

  const nextLessonIndex = useMemo(() => {
    for (let i = 0; i < lessons.length; i++) {
      if (!completedLessons.has(i)) return i;
    }
    return Math.max(0, lessons.length - 1);
  }, [completedLessons]);

  const nextScenarioIndex = useMemo(() => {
    for (let i = 0; i < scenarios.length; i++) {
      if (!completedScenarios.has(scenarios[i].id)) return i;
    }
    return Math.max(0, scenarios.length - 1);
  }, [completedScenarios]);

  const navigateToTab = useCallback(
    (tab: TabId) => {
      if (tab === 'lessons') {
        const fallback = lessonSlugAt(nextLessonIndex);
        const slug = loadString(KEY_LAST_LESSON_SLUG, fallback) || fallback;
        router.push('/lessons/' + slug);
      } else if (tab === 'scenarios') {
        const fallback = scenarios[nextScenarioIndex].id;
        const id = loadString(KEY_LAST_SCENARIO_ID, fallback) || fallback;
        router.push('/scenarios/' + id);
      } else {
        router.push('/quizzes');
      }
    },
    [router, nextLessonIndex, nextScenarioIndex]
  );

  const goToLessonByIndex = useCallback(
    (idx: number) => {
      router.push('/lessons/' + lessonSlugAt(idx));
    },
    [router]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDialog(null);
        return;
      }
      if (!dojoOpen) return;
      if (!e.metaKey && !e.ctrlKey) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeTab === 'lessons' && currentLesson < lessons.length - 1) {
          router.push('/lessons/' + lessonSlugAt(currentLesson + 1));
        }
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeTab === 'lessons' && currentLesson > 0) {
          router.push('/lessons/' + lessonSlugAt(currentLesson - 1));
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dojoOpen, activeTab, currentLesson, router]);

  useEffect(() => {
    const handler = () => saveJSON('np_dojo_code', savedCode);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [savedCode]);

  const totalComplete = completedLessons.size + completedScenarios.size;
  const totalItems = lessons.length + scenarios.length;

  const modules = useMemo(() => getModulesFromLessons(lessons), []);

  const scenarioCards = useMemo(
    () =>
      scenarios.map((s, index) => ({
        index,
        id: s.id,
        title: s.title,
        section: s.section,
        description: s.context,
        stepCount: s.steps.length,
      })),
    []
  );

  if (!mounted) return <div className="app app--dashboard" />;

  return (
    <>
      <div className={`app ${dojoOpen ? '' : 'app--dashboard'}`}>
        <header>
          <div className="header-left">
            <Link href="/" className="brand brand-btn" aria-label="Go to dashboard">
              <span className="brand-mark" aria-hidden>
                🥋
              </span>
              <span className="brand-title">
                <span className="brand-name-np">NumPy</span>
                <span className="brand-name-dojo"> Dojo</span>
              </span>
            </Link>
            {dojoOpen && (
              <Link href="/" className="hdr-nav-dashboard">
                Dashboard
              </Link>
            )}
          </div>
          <div className="header-right">
            <div className="meter">
              <span className="meter-label">
                <b>{totalComplete}</b> / {totalItems}
              </span>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{ width: `${(totalComplete / totalItems) * 100}%` }}
                />
              </div>
            </div>
            {totalComplete > 0 && (
              <button
                className="hdr-btn"
                type="button"
                onClick={() =>
                  setDialog({
                    title: 'Reset All Progress',
                    msg: 'This will clear all progress and saved code. Cannot be undone.',
                    label: 'Reset Everything',
                    onConfirm: resetAll,
                  })
                }
              >
                Reset All
              </button>
            )}
          </div>
        </header>

        {dojoOpen && activeTab === 'lessons' && (
          <Sidebar
            lessons={lessons}
            currentIndex={currentLesson}
            completedSet={completedLessons}
            onSelect={(i) => router.push('/lessons/' + lessonSlugAt(i))}
          />
        )}
        {dojoOpen && activeTab === 'scenarios' && (
          <Sidebar
            scenarios={scenarios}
            currentIndex={currentScenario}
            completedScenarios={completedScenarios}
            onSelect={(i) => router.push('/scenarios/' + scenarios[i].id)}
          />
        )}
        {dojoOpen && activeTab === 'quizzes' && (
          <div
            className="sidebar-placeholder"
            style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}
          />
        )}

        <main>
          {!dojoOpen ? (
            <Dashboard
              modules={modules}
              scenarioCards={scenarioCards}
              completedLessonCount={completedLessons.size}
              totalLessons={lessons.length}
              completedScenarioCount={completedScenarios.size}
              totalScenarios={scenarios.length}
              nextLessonIndex={nextLessonIndex}
            />
          ) : (
            <>
              <div className="tab-bar">
                {(['lessons', 'scenarios', 'quizzes'] as TabId[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => navigateToTab(tab)}
                  >
                    {tab === 'lessons'
                      ? '📘 Lessons'
                      : tab === 'scenarios'
                        ? '🌍 Scenarios'
                        : '📝 Quizzes'}
                  </button>
                ))}
              </div>

              {activeTab === 'lessons' && (
                <div className="panes" id="panes">
                  <LessonView
                    lesson={lessons[currentLesson]}
                    index={currentLesson}
                    isComplete={completedLessons.has(currentLesson)}
                    onResetLesson={() =>
                      setDialog({
                        title: `Reset "${lessons[currentLesson].title}"`,
                        msg: 'Clear progress and code for this lesson?',
                        label: 'Reset Lesson',
                        onConfirm: () => resetLesson(currentLesson),
                      })
                    }
                  />
                  <CodeEditor
                    key={`lesson_${currentLesson}`}
                    codeKey={`lesson_${currentLesson}`}
                    savedCode={savedCode[`lesson_${currentLesson}`] || lessons[currentLesson].starter}
                    validate={lessons[currentLesson].validate}
                    onSaveCode={(code) => saveCodeForKey(`lesson_${currentLesson}`, code)}
                    onPass={() => completeLesson(currentLesson)}
                    onNext={
                      currentLesson < lessons.length - 1
                        ? () => router.push('/lessons/' + lessonSlugAt(currentLesson + 1))
                        : undefined
                    }
                    toast={toast}
                  />
                </div>
              )}

              {activeTab === 'scenarios' && (
                <ScenarioView
                  scenario={scenarios[currentScenario]}
                  savedCode={savedCode}
                  onSaveCode={saveCodeForKey}
                  completedScenarios={completedScenarios}
                  onCompleteScenario={(id) => {
                    const next = new Set(completedScenarios);
                    next.add(id);
                    saveScenarioCompletion(next);
                  }}
                  toast={toast}
                  onGoToLesson={goToLessonByIndex}
                />
              )}

              {activeTab === 'quizzes' && (
                <QuizView onGoToLesson={goToLessonByIndex} toast={toast} />
              )}
            </>
          )}
        </main>
      </div>

      <Toast message={toastMsg} />
      <ConfirmDialog dialog={dialog} onClose={() => setDialog(null)} />
    </>
  );
}
