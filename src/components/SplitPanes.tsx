'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

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
  const [pct, setPct] = useState(DEFAULT_PCT);
  const [dragging, setDragging] = useState(false);
  const [wide, setWide] = useState(true);

  pctRef.current = pct;

  useEffect(() => {
    setPct(readStoredPct());
  }, []);

  useLayoutEffect(() => {
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
    if (!dragging || !wide) return;
    const el = containerRef.current;
    if (!el) return;

    const applyFromClient = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      if (w <= 0) return;
      applyPct(((clientX - rect.left) / w) * 100);
    };

    const onMouseMove = (e: MouseEvent) => applyFromClient(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) applyFromClient(e.touches[0].clientX);
    };
    const end = () => setDragging(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', end);
      document.removeEventListener('touchcancel', end);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging, wide, applyPct]);

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

  const rootStyle: CSSProperties = wide
    ? { gridTemplateColumns: `${pct}% 6px 1fr` }
    : { gridTemplateColumns: '1fr' };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`panes panes--resizable${dragging ? ' panes--resizing' : ''}`}
      style={rootStyle}
    >
      <div className="panes-learn">{left}</div>
      {wide ? (
        <div
          className="panes-gutter"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize lesson and code panels"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={MIN_PCT}
          aria-valuemax={MAX_PCT}
          tabIndex={0}
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onTouchStart={() => setDragging(true)}
          onKeyDown={onGutterKeyDown}
        />
      ) : null}
      {right}
    </div>
  );
}
