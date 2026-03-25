'use client';

import { Lesson, LessonDocLink } from '../data/types';
import { docLinkLogoProps } from '../lib/docLinkSources';
import { WhyItMattersSection } from './WhyItMattersSection';

interface Props {
  lesson: Lesson;
  index: number;
  isComplete: boolean;
  onResetLesson: () => void;
  existingWhyIllustrationSrcs?: string[];
  docLinks: LessonDocLink[];
}

export function LessonView({
  lesson,
  index,
  isComplete,
  onResetLesson,
  existingWhyIllustrationSrcs,
  docLinks,
}: Props) {
  return (
    <div className="learn" key={index}>
      <div className="badge">{lesson.badge}</div>
      <h2>{lesson.title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.instruction }} />
      {lesson.whyItMatters ? (
        <WhyItMattersSection
          html={lesson.whyItMatters}
          existingWhyIllustrationSrcs={existingWhyIllustrationSrcs}
        />
      ) : null}
      <div className="task">
        <div className="task-label">🎯 Your Task</div>
        <p dangerouslySetInnerHTML={{ __html: lesson.task }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        <button
          className="hint-btn"
          onClick={(e) => {
            const row = e.currentTarget.parentElement;
            const box = row?.nextElementSibling;
            if (box instanceof HTMLElement && box.classList.contains('hint-box')) {
              box.classList.toggle('show');
            }
          }}
        >
          💡 Show Hint
        </button>
        {isComplete && (
          <button className="sm-btn danger" onClick={onResetLesson}>↺ Reset Lesson</button>
        )}
      </div>
      <div className="hint-box">{lesson.hint}</div>

      {docLinks.length > 0 ? (
        <div className="lesson-docs">
          <div className="lesson-docs-heading">
            <span className="lesson-docs-icon" aria-hidden>
              🔗
            </span>
            <span>Resources</span>
            <span className="lesson-docs-sub">Docs, references &amp; more — opens in a new tab</span>
          </div>
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
      ) : null}
    </div>
  );
}
