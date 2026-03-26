'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ModuleSummary } from '../data/modules';
import { lessonSlugAt } from '../lib/routes';
import { track } from '../lib/analytics';
import { htmlToPlainText } from '../lib/htmlPlainText';
import { ShareSiteMenu } from './ShareSiteMenu';

export interface ScenarioCardSummary {
  index: number;
  id: string;
  title: string;
  section: string;
  description: string;
  stepCount: number;
}

interface DashboardProps {
  modules: ModuleSummary[];
  scenarioCards: ScenarioCardSummary[];
  completedLessonCount: number;
  totalLessons: number;
  completedScenarioCount: number;
  totalScenarios: number;
  nextLessonIndex: number;
}

export function Dashboard({
  modules,
  scenarioCards,
  completedLessonCount,
  totalLessons,
  completedScenarioCount,
  totalScenarios,
  nextLessonIndex,
}: DashboardProps) {
  const [lessonsPanelOpen, setLessonsPanelOpen] = useState(true);
  const [scenariosPanelOpen, setScenariosPanelOpen] = useState(true);

  const lessonPct =
    totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;
  const scenarioPct =
    totalScenarios > 0
      ? Math.round((completedScenarioCount / totalScenarios) * 100)
      : 0;
  const allLessonsDone = totalLessons > 0 && completedLessonCount >= totalLessons;
  const heroCtaLabel = allLessonsDone
    ? 'Open the dojo'
    : completedLessonCount > 0
      ? 'Continue lessons'
      : 'Start with Lesson 1';
  const heroCtaHref = '/lessons';

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <p className="dashboard-kicker">Welcome</p>
        <h2 className="dashboard-title">Learn NumPy by doing</h2>
        <p className="dashboard-lead">
          Short lessons with a live editor, then scenarios and quizzes to reinforce what you
          practiced. Follow the path below—or jump to any lesson topic or scenario when you need a
          refresher.
        </p>
        <div className="dashboard-hero-actions">
          <Link
            href={heroCtaHref}
            className="dashboard-cta"
            onClick={() => track('dashboard_cta_click', { label: heroCtaLabel, href: heroCtaHref })}
          >
            {heroCtaLabel}
          </Link>
          <span className="dashboard-hero-meta">
            {allLessonsDone
              ? `All ${totalLessons} lessons complete—practice scenarios or quizzes next`
              : `Next up: Lesson ${nextLessonIndex + 1} of ${totalLessons}`}
          </span>
        </div>
      </section>

      <div className="dashboard-callouts">
        <aside className="dashboard-callout" aria-labelledby="dashboard-callout-heading">
          <h3 id="dashboard-callout-heading" className="dashboard-callout-title">
            Free for every developer
          </h3>
          <p className="dashboard-callout-text">
            <strong>NumPy Dojo is free</strong> for anyone who wants to learn NumPy hands-on—no
            paywall, no account.
          </p>
          <p className="dashboard-callout-text dashboard-callout-text--follow">
            If it&apos;s useful to you, pass the word to a friend or teammate who&apos;s learning
            too.
          </p>
          <div className="dashboard-callout-share">
            <ShareSiteMenu />
          </div>
        </aside>

        <aside className="dashboard-callout dashboard-callout--author" aria-labelledby="dashboard-author-heading">
          <h3 id="dashboard-author-heading" className="dashboard-callout-title">
            About the developer
          </h3>
          <p className="dashboard-callout-text">
            I&apos;m <strong>Chris Seckler</strong>, a front-end developer. I was learning Python and
            NumPy and wanted a hands-on way to practice—so I built NumPy Dojo for myself. I&apos;m
            sharing it with the community in the same spirit.
          </p>
          <p className="dashboard-callout-text dashboard-callout-text--follow">
            For more on my work and background:
          </p>
          <ul className="dashboard-author-links">
            <li>
              <a href="https://github.com/zeckdude" target="_blank" rel="noopener noreferrer">
                <img
                  className="dashboard-author-link-icon dashboard-author-link-icon--github"
                  src="/logos/github-logo.svg"
                  alt=""
                  width={22}
                  height={22}
                  decoding="async"
                />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://stackoverflow.com/users/83916/zeckdude"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="dashboard-author-link-icon"
                  src="/logos/stack-overflow-logo.svg"
                  alt=""
                  width={22}
                  height={22}
                  decoding="async"
                />
                Stack Overflow
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/chrisseckler/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="dashboard-author-link-icon"
                  src="/logos/linkedin-logo.svg"
                  alt=""
                  width={22}
                  height={22}
                  decoding="async"
                />
                LinkedIn
              </a>
            </li>
          </ul>
        </aside>
      </div>

      <section className="dashboard-path" aria-labelledby="path-heading">
        <h3 id="path-heading" className="dashboard-section-title">
          Recommended path
        </h3>
        <p className="dashboard-path-hint">Click a step to open it in the dojo.</p>
        <ol className="path-steps">
          <li className="path-step">
            <Link href="/lessons" className="path-step-btn">
              <span className="path-step-num" aria-hidden>
                1
              </span>
              <div className="path-step-body">
                <strong>Lessons</strong>
                <p>
                  Go in order inside each topic. Complete the task in the editor, then use the Next
                  button when you pass—concepts stack from Foundations through Linear Algebra.
                </p>
              </div>
            </Link>
          </li>
          <li className="path-step">
            <Link href="/scenarios" className="path-step-btn">
              <span className="path-step-num" aria-hidden>
                2
              </span>
              <div className="path-step-body">
                <strong>Scenarios</strong>
                <p>
                  Apply the same skills in short multi-step stories. They link back to lessons if
                  you need a hint.
                </p>
              </div>
            </Link>
          </li>
          <li className="path-step">
            <Link href="/quizzes" className="path-step-btn">
              <span className="path-step-num" aria-hidden>
                3
              </span>
              <div className="path-step-body">
                <strong>Quizzes</strong>
                <p>
                  Check understanding and revisit weak spots via lesson links in explanations.
                </p>
              </div>
            </Link>
          </li>
        </ol>
      </section>

      <section className="dashboard-lessons" aria-labelledby="lessons-heading">
        <div className="dashboard-modules-head">
          <div className="dashboard-panel-heading">
            <button
              type="button"
              className="dashboard-panel-toggle"
              onClick={() => setLessonsPanelOpen((o) => !o)}
              aria-expanded={lessonsPanelOpen}
              aria-controls="dashboard-lesson-cards"
              title={lessonsPanelOpen ? 'Hide lesson topics' : 'Show lesson topics'}
            >
              <span className="dashboard-panel-toggle-chevron" aria-hidden>
                {lessonsPanelOpen ? '▼' : '▶'}
              </span>
            </button>
            <h3 id="lessons-heading" className="dashboard-section-title dashboard-section-title--inline">
              Lessons
            </h3>
          </div>
          <div className="dashboard-progress-pill" role="status">
            <span className="dashboard-progress-pill-label">Lesson progress</span>
            <span className="dashboard-progress-pill-value">
              {completedLessonCount} / {totalLessons}
              <span className="dashboard-progress-pill-pct">{lessonPct}%</span>
            </span>
          </div>
        </div>
        {lessonsPanelOpen && (
          <div className="module-grid" id="dashboard-lesson-cards">
            {modules.map((m, i) => (
              <Link
                key={m.section}
                href={`/lessons/${lessonSlugAt(m.startLessonIndex)}`}
                className="module-card module-card--link"
                aria-label={`${m.section}: ${m.lessonCount} lesson${m.lessonCount !== 1 ? 's' : ''}`}
              >
                <div className="module-card-top">
                  <span className="module-card-order">{String(i + 1).padStart(2, '0')}</span>
                  <span className="module-card-count">
                    {m.lessonCount} lesson{m.lessonCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <h4 className="module-card-title">{m.section}</h4>
                <p className="module-card-desc module-card-desc--footer">{m.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-scenarios" aria-labelledby="scenarios-heading">
        <div className="dashboard-modules-head">
          <div className="dashboard-panel-heading">
            <button
              type="button"
              className="dashboard-panel-toggle"
              onClick={() => setScenariosPanelOpen((o) => !o)}
              aria-expanded={scenariosPanelOpen}
              aria-controls="dashboard-scenario-cards"
              title={scenariosPanelOpen ? 'Hide scenarios' : 'Show scenarios'}
            >
              <span className="dashboard-panel-toggle-chevron" aria-hidden>
                {scenariosPanelOpen ? '▼' : '▶'}
              </span>
            </button>
            <h3 id="scenarios-heading" className="dashboard-section-title dashboard-section-title--inline">
              Scenarios
            </h3>
          </div>
          <div className="dashboard-progress-pill" role="status">
            <span className="dashboard-progress-pill-label">Scenario progress</span>
            <span className="dashboard-progress-pill-value">
              {completedScenarioCount} / {totalScenarios}
              <span className="dashboard-progress-pill-pct">{scenarioPct}%</span>
            </span>
          </div>
        </div>
        {scenariosPanelOpen && (
          <div className="module-grid" id="dashboard-scenario-cards">
            {scenarioCards.map((s, i) => (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="module-card module-card--link"
                aria-label={`${s.title}: ${s.stepCount} step${s.stepCount !== 1 ? 's' : ''}`}
              >
                <div className="module-card-top">
                  <span className="module-card-order">{String(i + 1).padStart(2, '0')}</span>
                  <span className="module-card-count">
                    {s.stepCount} step{s.stepCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="module-card-meta">{s.section}</p>
                <h4 className="module-card-title">{s.title}</h4>
                <p className="module-card-desc module-card-desc--clamp module-card-desc--footer">
                  {htmlToPlainText(s.description)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
