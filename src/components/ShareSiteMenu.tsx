'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '../lib/analytics';
import { DEFAULT_SHARE_TEXT, DEFAULT_SHARE_TITLE } from '../lib/shareCopy';

export { DEFAULT_SHARE_TEXT, DEFAULT_SHARE_TITLE };

function resolveUrl(explicit?: string) {
  if (explicit) return explicit;
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

export type ShareSiteMenuVariant = 'cta' | 'compact';

export interface ShareSiteMenuProps {
  title?: string;
  text?: string;
  /** If omitted, uses `window.location.href` when the user copies or shares. */
  url?: string;
  triggerLabel?: string;
  ariaLabel?: string;
  variant?: ShareSiteMenuVariant;
  className?: string;
}

export function ShareSiteMenu({
  title = DEFAULT_SHARE_TITLE,
  text = DEFAULT_SHARE_TEXT,
  url: urlProp,
  triggerLabel = 'Share',
  ariaLabel = 'Share NumPy Dojo',
  variant = 'cta',
  className,
}: ShareSiteMenuProps) {
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

  const effectiveUrl = () => resolveUrl(urlProp);

  const handleSystemShare = async () => {
    const url = effectiveUrl();
    if (!navigator.share) return;
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      setOpen(false);
    } catch (err: unknown) {
      const name = err && typeof err === 'object' && 'name' in err ? String((err as Error).name) : '';
      if (name === 'AbortError') return;
    }
  };

  const handleCopy = async () => {
    const url = effectiveUrl();
    try {
      await navigator.clipboard.writeText(url);
      track('share_copy', { variant });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const u = resolveUrl(urlProp);
  const encUrl = encodeURIComponent(u);
  const encText = encodeURIComponent(text);
  const twitterHref = `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`;

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const triggerClass =
    variant === 'compact'
      ? 'dashboard-share-trigger dashboard-share-trigger--compact'
      : 'dashboard-share-trigger';

  const rootClass = ['dashboard-share-menu', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={rootClass} ref={rootRef}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        onClick={() =>
          setOpen((v) => {
            const next = !v;
            if (next) track('share_open', { variant });
            return next;
          })
        }
      >
        {triggerLabel}
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
