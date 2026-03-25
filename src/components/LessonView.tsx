'use client';

import { Lesson } from '../data/types';
import { WhyItMattersSection } from './WhyItMattersSection';

interface Props {
  lesson: Lesson;
  index: number;
  isComplete: boolean;
  onResetLesson: () => void;
  existingWhyIllustrationSrcs?: string[];
}

export function LessonView({
  lesson,
  index,
  isComplete,
  onResetLesson,
  existingWhyIllustrationSrcs,
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
    </div>
  );
}
