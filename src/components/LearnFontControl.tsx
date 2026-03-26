'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'np_dojo_learn_fs';
const DEFAULT_FS = 14;
const MIN_FS = 12;
const MAX_FS = 20;

function loadLearnFs(): number {
  try {
    const v = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '');
    if (Number.isFinite(v) && v >= MIN_FS && v <= MAX_FS) return v;
  } catch { /* */ }
  return DEFAULT_FS;
}

function applyLearnFs(px: number) {
  document.documentElement.style.setProperty('--learn-fs', `${px}px`);
}

export function LearnFontControl() {
  const [fs, setFs] = useState(DEFAULT_FS);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadLearnFs();
    setFs(saved);
    applyLearnFs(saved);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Node)) return;
      if (wrapRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const change = useCallback((delta: number) => {
    setFs((prev) => {
      const next = Math.max(MIN_FS, Math.min(MAX_FS, prev + delta));
      applyLearnFs(next);
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch { /* */ }
      return next;
    });
  }, []);

  const pct = Math.round((fs / DEFAULT_FS) * 100);

  return (
    <div className="learn-font-control" ref={wrapRef}>
      <button
        type="button"
        className="learn-font-btn"
        onClick={() => setOpen((o) => !o)}
        title="Content font size"
        aria-expanded={open}
      >
        Aa
      </button>
      {open && (
        <div className="learn-font-popover">
          <button
            type="button"
            className="learn-font-step"
            onClick={() => change(-1)}
            disabled={fs <= MIN_FS}
            aria-label="Decrease font size"
          >
            −
          </button>
          <span className="learn-font-label">{pct}%</span>
          <button
            type="button"
            className="learn-font-step"
            onClick={() => change(1)}
            disabled={fs >= MAX_FS}
            aria-label="Increase font size"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
