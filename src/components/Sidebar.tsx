'use client';

import { Lesson } from '../data/types';
import { Scenario } from '../data/types';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentIndex: number;
  completedSet: Set<number>;
  onSelect: (idx: number) => void;
  scenarios?: never;
  completedScenarios?: never;
}

interface ScenarioSidebarProps {
  scenarios: Scenario[];
  currentIndex: number;
  completedScenarios: Set<string>;
  onSelect: (idx: number) => void;
  lessons?: never;
  completedSet?: never;
}

type SidebarProps = LessonSidebarProps | ScenarioSidebarProps;

export function Sidebar(props: SidebarProps) {
  if (props.lessons) {
    return <LessonSidebar {...props} />;
  }
  return <ScenarioSidebar {...(props as ScenarioSidebarProps)} />;
}

function LessonSidebar({ lessons, currentIndex, completedSet, onSelect }: LessonSidebarProps) {
  let currentSection = '';

  return (
    <nav>
      {lessons.map((lesson, i) => {
        const showSection = lesson.section !== currentSection;
        if (showSection) currentSection = lesson.section;
        const isActive = i === currentIndex;
        const isDone = completedSet.has(i);

        return (
          <div key={i}>
            {showSection && <div className="sec-label">{lesson.section}</div>}
            <div
              className={`nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => onSelect(i)}
            >
              <div className="nav-dot">{isDone ? '✓' : i + 1}</div>
              <div className="nav-title">{lesson.title}</div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function ScenarioSidebar({ scenarios, currentIndex, completedScenarios, onSelect }: ScenarioSidebarProps) {
  let currentSection = '';

  return (
    <nav>
      {scenarios.map((scenario, i) => {
        const showSection = scenario.section !== currentSection;
        if (showSection) currentSection = scenario.section;
        const isActive = i === currentIndex;
        const isDone = completedScenarios.has(scenario.id);

        return (
          <div key={scenario.id}>
            {showSection && <div className="sec-label">{scenario.section}</div>}
            <div
              className={`nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => onSelect(i)}
            >
              <div className="nav-dot">{isDone ? '✓' : i + 1}</div>
              <div className="nav-title">{scenario.title}</div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
