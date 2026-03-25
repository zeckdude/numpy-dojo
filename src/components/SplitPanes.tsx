'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';

const STORAGE_KEY = 'np_dojo_split_pct';
const DEFAULT_PCT = 50;
const MIN_PCT = 28;
const MAX_PCT = 72;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function readStoredPct(): number {
  try {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '');
    if (Number.isFinite(v)) return clamp(v, MIN_PCT, MAX_PCT);
  } catch {
    /* ignore */
  }
  return DEFAULT_PCT;
}

type Props = {
  id?: string;
  left: ReactNode;
  right: ReactNode;
};

export function SplitPanes({ id, left, right }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef(DEFAULT_PCT);
  const [pct, setPct] = useState(() =>
    typeof window !== 'undefined' ? readStoredPct() : DEFAULT_PCT
  );
  const [dragging, setDragging] = useState(false);
  const [wide, setWide] = useState(true);

  pctRef.current = pct;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const applyPct = useCallback((raw: number) => {
    const c = clamp(raw, MIN_PCT, MAX_PCT);
    setPct(c);
    try {
      localStorage.setItem(STORAGE_KEY, String(Math.round(c * 10) / 10));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      if (w <= 0) return;
      const x = e.clientX - rect.left;
      applyPct((x / w) * 100);
    };
    const onUp = () => setDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, applyPct]);

  const onGutterKeyDown = (e: KeyboardEvent) => {
    const p = pctRef.current;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyPct(p - 3);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyPct(p + 3);
    } else if (e.key === 'Home') {
      e.preventDefault();
      applyPct(MIN_PCT);
    } else if (e.key === 'End') {
      e.preventDefault();
      applyPct(MAX_PCT);
    }
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`panes panes--resizable${dragging ? ' panes--resizing' : ''}`}
      style={wide ? { gridTemplateColumns: `${pct}% 6px 1fr` } : undefined}
    >
      <div className="panes-learn">{left}</div>
      <div
        className="panes-gutter"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize lesson and code panels"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={MIN_PCT}
        aria-valuemax={MAX_PCT}
        tabIndex={wide ? 0 : -1}
        onMouseDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onKeyDown={onGutterKeyDown}
      />
      {right}
    </div>
  );
}
