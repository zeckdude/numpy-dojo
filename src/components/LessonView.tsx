'use client';

import { useEffect, useState } from 'react';
import { track } from '../lib/analytics';
import { Lesson, LessonDocLink } from '../data/types';
import { docLinkLogoProps } from '../lib/docLinkSources';
import { WhyItMattersSection } from './WhyItMattersSection';
import { ShareSiteMenu } from './ShareSiteMenu';
import { lessonShareText, lessonShareTitle } from '../lib/shareCopy';
import { HighlightedProse } from './HighlightedProse';
import { LearnFontControl } from './LearnFontControl';

interface Props {
  lesson: Lesson;
  index: number;
  isComplete: boolean;
  onResetLesson: () => void;
  onOpenNav?: () => void;
  existingWhyIllustrationSrcs?: string[];
  docLinks: LessonDocLink[];
}

export function LessonView({
  lesson,
  index,
  isComplete,
  onResetLesson,
  onOpenNav,
  existingWhyIllustrationSrcs,
  docLinks,
}: Props) {
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    setHintOpen(false);
  }, [index]);

  return (
    <div className="learn learn--lesson" key={index}>
      <div className="lesson-scroll">
        <div className="lesson-scroll-inner">
          <div className="lesson-reading">
            <div className="learn-pill-row">
              <button
                type="button"
                className="badge badge--nav-trigger"
                onClick={onOpenNav}
              >
                Lesson <span className="badge-caret" aria-hidden>▾</span>
              </button>
              <div className="learn-pill-right">
                <LearnFontControl />
                <ShareSiteMenu
                  title={lessonShareTitle(lesson.title)}
                  text={lessonShareText(lesson.title)}
                  ariaLabel={`Share this lesson: ${lesson.title}`}
                  variant="compact"
                />
              </div>
            </div>
            <h2>{lesson.title}</h2>
            <HighlightedProse html={lesson.instruction} className="prose" />
            {lesson.whyItMatters ? (
              <WhyItMattersSection
                html={lesson.whyItMatters}
                existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
              />
            ) : null}
          </div>

          {docLinks.length > 0 ? (
            <details className="lesson-details lesson-resources-details">
              <summary>
                <span className="lesson-resources-summary-text">
                  <span className="lesson-resources-summary-line">
                    <span className="lesson-docs-icon" aria-hidden>
                      🔗
                    </span>
                    Resources
                  </span>
                  <span className="lesson-docs-sub lesson-resources-summary-sub">
                    Docs, references &amp; more — opens in a new tab
                  </span>
                </span>
              </summary>
              <div className="lesson-details-body lesson-resources-body">
                <ul className="lesson-docs-list">
                  {docLinks.map((link) => {
                    const logo = docLinkLogoProps(link.href);
                    return (
                      <li key={link.href + link.label}>
                        <a
                          className="lesson-docs-link"
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            className="lesson-docs-logo"
                            src={logo.src}
                            alt={logo.alt}
                            width={72}
                            height={22}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="lesson-docs-label">{link.label}</span>
                          <span className="lesson-docs-external" aria-hidden>
                            ↗
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          ) : null}
        </div>
      </div>

      <div className="lesson-task-band">
        <div className="task">
          <div className="task-label">🎯 Your Task</div>
          <p dangerouslySetInnerHTML={{ __html: lesson.task }} />
        </div>
        <div className="lesson-hint-actions">
          <button
            type="button"
            className="hint-btn"
            aria-expanded={hintOpen}
            onClick={() =>
              setHintOpen((o) => {
                const next = !o;
                track('hint_toggled', { open: next, surface: 'lesson' });
                return next;
              })
            }
          >
            {hintOpen ? '💡 Hide Hint' : '💡 Show Hint'}
          </button>
          {isComplete && (
            <button className="sm-btn danger" onClick={onResetLesson}>
              🔄 Reset Lesson
            </button>
          )}
        </div>
        <div className={`hint-box${hintOpen ? ' show' : ''}`}>{lesson.hint}</div>
      </div>
    </div>
  );
}
