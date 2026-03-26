'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import { Lesson } from '../data/types';
import { Scenario } from '../data/types';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentIndex: number;
  completedSet: Set<number>;
  onSelect: (idx: number) => void;
  mobileOpen?: boolean;
  mobileAnimated?: boolean;
  scenarios?: never;
  completedScenarios?: never;
}

interface ScenarioSidebarProps {
  scenarios: Scenario[];
  currentIndex: number;
  completedScenarios: Set<string>;
  onSelect: (idx: number) => void;
  mobileOpen?: boolean;
  mobileAnimated?: boolean;
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

function navClassName(mobileOpen?: boolean, mobileAnimated?: boolean) {
  const cls: string[] = [];
  if (mobileAnimated) cls.push('mobile-nav-animated');
  if (mobileOpen) cls.push('mobile-open');
  return cls.join(' ');
}

function LessonSidebar({ lessons, currentIndex, completedSet, onSelect, mobileOpen, mobileAnimated }: LessonSidebarProps) {
  let currentSection = '';
  const navRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLDivElement | null>(null);
  const scrollMemRef = useRef(0);
  const sidebarClickRef = useRef(false);

  const captureScroll = useCallback(() => {
    const el = navRef.current;
    if (el) scrollMemRef.current = el.scrollTop;
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (sidebarClickRef.current) {
      sidebarClickRef.current = false;
      nav.scrollTop = scrollMemRef.current;
      return;
    }

    activeItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [currentIndex]);

  return (
    <nav ref={navRef} className={navClassName(mobileOpen, mobileAnimated)} onScroll={captureScroll}>
      {lessons.map((lesson, i) => {
        const showSection = lesson.section !== currentSection;
        if (showSection) currentSection = lesson.section;
        const isActive = i === currentIndex;
        const isDone = completedSet.has(i);

        return (
          <div key={i}>
            {showSection && <div className="sec-label">{lesson.section}</div>}
            <div
              ref={isActive ? activeItemRef : undefined}
              className={`nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                sidebarClickRef.current = true;
                captureScroll();
                onSelect(i);
              }}
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

function ScenarioSidebar({ scenarios, currentIndex, completedScenarios, onSelect, mobileOpen, mobileAnimated }: ScenarioSidebarProps) {
  let currentSection = '';
  const navRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLDivElement | null>(null);
  const scrollMemRef = useRef(0);
  const sidebarClickRef = useRef(false);

  const captureScroll = useCallback(() => {
    const el = navRef.current;
    if (el) scrollMemRef.current = el.scrollTop;
  }, []);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (sidebarClickRef.current) {
      sidebarClickRef.current = false;
      nav.scrollTop = scrollMemRef.current;
      return;
    }

    activeItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [currentIndex]);

  return (
    <nav ref={navRef} className={navClassName(mobileOpen, mobileAnimated)} onScroll={captureScroll}>
      {scenarios.map((scenario, i) => {
        const showSection = scenario.section !== currentSection;
        if (showSection) currentSection = scenario.section;
        const isActive = i === currentIndex;
        const isDone = completedScenarios.has(scenario.id);

        return (
          <div key={scenario.id}>
            {showSection && <div className="sec-label">{scenario.section}</div>}
            <div
              ref={isActive ? activeItemRef : undefined}
              className={`nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                sidebarClickRef.current = true;
                captureScroll();
                onSelect(i);
              }}
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
