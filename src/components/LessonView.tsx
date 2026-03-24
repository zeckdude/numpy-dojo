'use client';

import { Lesson } from '../data/types';

interface Props {
  lesson: Lesson;
  index: number;
  isComplete: boolean;
  onResetLesson: () => void;
}

export function LessonView({ lesson, index, isComplete, onResetLesson }: Props) {
  return (
    <div className="learn" key={index}>
      <div className="badge">{lesson.badge}</div>
      <h2>{lesson.title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.instruction }} />
      <div className="task">
        <div className="task-label">🎯 Your Task</div>
        <p dangerouslySetInnerHTML={{ __html: lesson.task }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        <button
          className="hint-btn"
          onClick={(e) => {
            const box = (e.currentTarget.parentElement?.querySelector('.hint-box') as HTMLElement);
            if (box) box.classList.toggle('show');
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
