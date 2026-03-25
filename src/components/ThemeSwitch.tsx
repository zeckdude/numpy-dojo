'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { readStoredTheme, saveStoredTheme, setDataTheme, type StoredTheme } from '../lib/theme';

export function ThemeSwitch() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const [committed, setCommitted] = useState<StoredTheme | null>(null);
  const [osLight, setOsLight] = useState(false);
  const [uiReady, setUiReady] = useState(false);

  const effective = committed !== null ? committed : osLight ? 'light' : 'dark';

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const stored = readStoredTheme();
      const osl = mq.matches;
      setCommitted(stored);
      setOsLight(osl);
      const t = stored !== null ? stored : osl ? 'light' : 'dark';
      setDataTheme(t);
    };
    apply();
    mq.addEventListener('change', apply);
    setUiReady(true);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (next: StoredTheme) => {
    setCommitted(next);
    saveStoredTheme(next);
    setDataTheme(next);
    setOpen(false);
  };

  const triggerIcon = !uiReady ? '🌓' : effective === 'dark' ? '🌙' : '☀️';

  return (
    <div className="theme-menu" ref={rootRef}>
      <button
        type="button"
        className="theme-menu-trigger"
        aria-label="Color theme"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden suppressHydrationWarning>
          {triggerIcon}
        </span>
      </button>
      {open ? (
        <div className="theme-menu-dropdown" role="menu" aria-label="Choose theme">
          <button
            type="button"
            role="menuitem"
            className={`theme-menu-item${effective === 'light' ? ' active' : ''}`}
            onClick={() => choose('light')}
          >
            <span className="theme-menu-ico" aria-hidden>
              ☀️
            </span>
            Light
          </button>
          <button
            type="button"
            role="menuitem"
            className={`theme-menu-item${effective === 'dark' ? ' active' : ''}`}
            onClick={() => choose('dark')}
          >
            <span className="theme-menu-ico" aria-hidden>
              🌙
            </span>
            Dark
          </button>
        </div>
      ) : null}
    </div>
  );
}
