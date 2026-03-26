'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import { lessons } from '../data/lessons';
import { LESSON_DOC_LINKS } from '../data/lessonDocLinks';
import { scenarios } from '../data/scenarios';
import { getModulesFromLessons } from '../data/modules';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { LessonView } from './LessonView';
import { ScenarioView } from './ScenarioView';
import { QuizView } from './QuizView';
import { CodeEditor } from './CodeEditor';
import { Toast } from './Toast';
import { ThemeSwitch } from './ThemeSwitch';
import { SplitPanes } from './SplitPanes';
import { ShareSiteMenu } from './ShareSiteMenu';
import { ConfirmDialog } from './ConfirmDialog';
import { MobileBreadcrumb } from './MobileBreadcrumb';
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
import { track } from '../lib/analytics';

export type TabId = 'lessons' | 'scenarios' | 'quizzes';

export type AppRoute =
  | { kind: 'dashboard' }
  | { kind: 'lesson'; slug: string }
  | { kind: 'scenario'; id: string }
  | { kind: 'quiz' };

export function NumPyDojoApp({
  route,
  existingWhyIllustrationSrcs,
}: {
  route: AppRoute;
  /** `/illustrations/...` paths that exist on disk; figures for missing files are hidden. */
  existingWhyIllustrationSrcs?: string[];
}) {
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileNavAnimated, setMobileNavAnimated] = useState(false);

  const openMobileNav = useCallback(() => {
    setMobileNavAnimated(true);
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    setTimeout(() => setMobileNavAnimated(false), 300);
  }, []);
  const [dialog, setDialog] = useState<{
    title: string;
    msg: string;
    label: string;
    onConfirm: () => void;
  } | null>(null);
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
  }, []);

  useLayoutEffect(() => {
    if (lessonSlug === null) return;
    const idx = lessonIndexFromSlug(lessonSlug);
    if (idx !== null) setCurrentLesson(idx);
  }, [lessonSlug]);

  useLayoutEffect(() => {
    if (scenarioId === null) return;
    const idx = scenarioIndexFromId(scenarioId);
    if (idx !== null) setCurrentScenario(idx);
  }, [scenarioId]);

  const headerMoreRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = headerMoreRef.current;
    if (!details) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!details.open) return;
      const t = e.target;
      if (!(t instanceof Node) || details.contains(t)) return;
      details.open = false;
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    closeMobileNav();
  }, [route, closeMobileNav]);

  useEffect(() => {
    saveString(KEY_LAST_LESSON_SLUG, lessonSlugAt(currentLesson));
  }, [currentLesson]);

  useEffect(() => {
    saveString(KEY_LAST_SCENARIO_ID, scenarios[currentScenario].id);
  }, [currentScenario]);

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
      track('lesson_completed', {
        lesson_index: idx,
        lesson_slug: lessonSlugAt(idx),
        title: lessons[idx]?.title,
      });
    },
    [completedLessons, saveLessons, lessons]
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
      track('tab_selected', { tab });
      if (tab === 'lessons') {
        const fallback = lessonSlugAt(nextLessonIndex);
        const slug = loadString(KEY_LAST_LESSON_SLUG, fallback) || fallback;
        router.push('/lessons/' + slug, { scroll: false });
      } else if (tab === 'scenarios') {
        const fallback = scenarios[nextScenarioIndex].id;
        const id = loadString(KEY_LAST_SCENARIO_ID, fallback) || fallback;
        router.push('/scenarios/' + id, { scroll: false });
      } else {
        router.push('/quizzes', { scroll: false });
      }
    },
    [router, nextLessonIndex, nextScenarioIndex]
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
    if (route.kind !== 'lesson') return;
    const l = lessons[currentLesson];
    if (!l) return;
    track('lesson_opened', {
      lesson_index: currentLesson,
      lesson_slug: lessonSlugAt(currentLesson),
      title: l.title,
    });
  }, [route.kind, currentLesson]);

  useEffect(() => {
    if (route.kind !== 'scenario') return;
    const s = scenarios[currentScenario];
    if (!s) return;
    track('scenario_opened', {
      scenario_id: s.id,
      title: s.title,
    });
  }, [route.kind, currentScenario]);

  useEffect(() => {
    if (route.kind !== 'quiz') return;
    track('quiz_opened', {});
  }, [route.kind]);

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

  const headerShareProps = useMemo(() => {
    if (route.kind === 'lesson') {
      const lesson = lessons[currentLesson];
      return {
        title: `${lesson.title} · NumPy Dojo`,
        text: `Practice "${lesson.title}" on NumPy Dojo—free lesson with a live NumPy editor.`,
        ariaLabel: `Share this lesson: ${lesson.title}`,
        triggerLabel: 'Share' as const,
        variant: 'compact' as const,
      };
    }
    if (route.kind === 'scenario') {
      const scenario = scenarios[currentScenario];
      return {
        title: `${scenario.title} · NumPy Dojo`,
        text: `Try the scenario "${scenario.title}" on NumPy Dojo—short multi-step NumPy exercises.`,
        ariaLabel: `Share this scenario: ${scenario.title}`,
        triggerLabel: 'Share' as const,
        variant: 'compact' as const,
      };
    }
    if (route.kind === 'quiz') {
      return {
        title: 'NumPy Dojo — Quizzes',
        text: 'Free NumPy quizzes with instant feedback on NumPy Dojo.',
        ariaLabel: 'Share NumPy Dojo quizzes',
        triggerLabel: 'Share' as const,
        variant: 'compact' as const,
      };
    }
    return null;
  }, [route.kind, currentLesson, currentScenario]);

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
          </div>
          <div className="header-right">
            <ThemeSwitch />
            <div className="header-tools-desktop">
              {dojoOpen && headerShareProps ? (
                <ShareSiteMenu {...headerShareProps} className="dashboard-share-menu--header" />
              ) : null}
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
            <details ref={headerMoreRef} className="header-more">
              <summary className="header-more-trigger hamburger hamburger--elastic" aria-label="Menu">
                <span className="hamburger-box" aria-hidden="true">
                  <span className="hamburger-inner" />
                </span>
              </summary>
              <div className="header-more-panel">
                {dojoOpen && headerShareProps ? (
                  <div className="header-more-section">
                    <h2 className="header-more-section-title">Invite others</h2>
                    <ShareSiteMenu
                      {...headerShareProps}
                      className="dashboard-share-menu--header dashboard-share-menu--header-more"
                    />
                  </div>
                ) : null}
                <div className="header-more-section">
                  <h2 className="header-more-section-title">Progress</h2>
                  <div className="meter meter--stacked">
                    <span className="meter-label">
                      <b>{totalComplete}</b> / {totalItems}
                    </span>
                    <div className="meter-track meter-track--wide">
                      <div
                        className="meter-fill"
                        style={{ width: `${(totalComplete / totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {totalComplete > 0 && (
                  <div className="header-more-section">
                    <h2 className="header-more-section-title">Saved data</h2>
                    <button
                      className="hdr-btn header-more-reset"
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
                  </div>
                )}
              </div>
            </details>
          </div>
        </header>

        {dojoOpen && activeTab === 'lessons' && (
          <Sidebar
            lessons={lessons}
            currentIndex={currentLesson}
            completedSet={completedLessons}
            onSelect={(i) => {
              setMobileNavOpen(false);
              router.push('/lessons/' + lessonSlugAt(i), { scroll: false });
            }}
            mobileOpen={mobileNavOpen}
            mobileAnimated={mobileNavAnimated}
          />
        )}
        {dojoOpen && activeTab === 'scenarios' && (
          <Sidebar
            scenarios={scenarios}
            currentIndex={currentScenario}
            completedScenarios={completedScenarios}
            onSelect={(i) => {
              closeMobileNav();
              router.push('/scenarios/' + scenarios[i].id, { scroll: false });
            }}
            mobileOpen={mobileNavOpen}
            mobileAnimated={mobileNavAnimated}
          />
        )}
        {mobileNavOpen && (
          <div
            className="mobile-nav-backdrop"
            onClick={closeMobileNav}
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
                <MobileBreadcrumb
                  currentIndex={currentLesson}
                  totalCount={lessons.length}
                  title={lessons[currentLesson].title}
                  label="Lesson"
                  onPrev={
                    currentLesson > 0
                      ? () => router.push('/lessons/' + lessonSlugAt(currentLesson - 1), { scroll: false })
                      : undefined
                  }
                  onNext={
                    currentLesson < lessons.length - 1
                      ? () => router.push('/lessons/' + lessonSlugAt(currentLesson + 1), { scroll: false })
                      : undefined
                  }
                  onOpenNav={openMobileNav}
                />
              )}

              {activeTab === 'scenarios' && (
                <MobileBreadcrumb
                  currentIndex={currentScenario}
                  totalCount={scenarios.length}
                  title={scenarios[currentScenario].title}
                  label="Scenario"
                  onPrev={
                    currentScenario > 0
                      ? () => router.push('/scenarios/' + scenarios[currentScenario - 1].id, { scroll: false })
                      : undefined
                  }
                  onNext={
                    currentScenario < scenarios.length - 1
                      ? () => router.push('/scenarios/' + scenarios[currentScenario + 1].id, { scroll: false })
                      : undefined
                  }
                  onOpenNav={openMobileNav}
                />
              )}

              {activeTab === 'lessons' && (
                <SplitPanes
                  id="panes"
                  left={
                    <LessonView
                      lesson={lessons[currentLesson]}
                      index={currentLesson}
                      isComplete={completedLessons.has(currentLesson)}
                      existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
                      docLinks={LESSON_DOC_LINKS[currentLesson] ?? []}
                      onOpenNav={openMobileNav}
                      onResetLesson={() =>
                        setDialog({
                          title: `Reset "${lessons[currentLesson].title}"`,
                          msg: 'Clear progress and code for this lesson?',
                          label: 'Reset Lesson',
                          onConfirm: () => resetLesson(currentLesson),
                        })
                      }
                    />
                  }
                  right={
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
                  }
                />
              )}

              {activeTab === 'scenarios' && (
                <ScenarioView
                  scenario={scenarios[currentScenario]}
                  savedCode={savedCode}
                  onSaveCode={saveCodeForKey}
                  onOpenNav={openMobileNav}
                  completedScenarios={completedScenarios}
                  onCompleteScenario={(id) => {
                    const next = new Set(completedScenarios);
                    next.add(id);
                    saveScenarioCompletion(next);
                    track('scenario_completed', { scenario_id: id });
                  }}
                  toast={toast}
                />
              )}

              {activeTab === 'quizzes' && (
                <QuizView toast={toast} />
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
