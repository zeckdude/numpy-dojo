'use client';

import { useEffect, useRef, useState } from 'react';

const SHARE_TITLE = 'NumPy Dojo';
const SHARE_TEXT =
  'Free hands-on NumPy lessons with a live editor—no paywall, no account.';

function pageUrl() {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

export function ShareSiteMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const handleSystemShare = async () => {
    const url = pageUrl();
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url,
      });
      setOpen(false);
    } catch (err: unknown) {
      const name = err && typeof err === 'object' && 'name' in err ? String((err as Error).name) : '';
      if (name === 'AbortError') return;
    }
  };

  const handleCopy = async () => {
    const url = pageUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const url = pageUrl();
  const encUrl = encodeURIComponent(url);
  const encText = encodeURIComponent(SHARE_TEXT);
  const twitterHref = `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="dashboard-share-menu" ref={rootRef}>
      <button
        type="button"
        className="dashboard-share-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Share NumPy Dojo"
        onClick={() => setOpen((v) => !v)}
      >
        Share
      </button>
      {open ? (
        <div className="dashboard-share-panel" role="menu" aria-label="Share options">
          {canNativeShare ? (
            <button
              type="button"
              role="menuitem"
              className="dashboard-share-item"
              onClick={() => void handleSystemShare()}
            >
              Share using this device…
            </button>
          ) : null}
          <button type="button" role="menuitem" className="dashboard-share-item" onClick={handleCopy}>
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="dashboard-share-item"
            onClick={() => setOpen(false)}
          >
            Share on X
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="dashboard-share-item"
            onClick={() => setOpen(false)}
          >
            Share on LinkedIn
          </a>
        </div>
      ) : null}
    </div>
  );
}
