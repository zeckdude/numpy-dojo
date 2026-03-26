'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { filterWhyItMattersFiguresByExistingSrcs } from '../lib/filterWhyItMattersFigures';
import { LearnFontControl } from './LearnFontControl';

function proseWithoutFigures(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (block) => {
      const m = block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      return m ? `<div class="lightbox-prose-figcaption">${m[1]}</div>` : '';
    });
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll('figure').forEach((fig) => {
    const cap = fig.querySelector('figcaption');
    const div = doc.createElement('div');
    div.className = 'lightbox-prose-figcaption';
    if (cap) div.innerHTML = cap.innerHTML;
    fig.replaceWith(div);
  });
  return doc.body.innerHTML;
}

interface LightboxState {
  src: string;
  alt: string;
}

interface Props {
  html: string;
  /** If set, `<figure>` blocks whose `<img src>` is not listed are omitted (file missing under public/). */
  existingWhyIllustrationSrcs?: string[];
  /** When false, render prose only (no `<details>`). Used for scenario Context. Default true. */
  collapsible?: boolean;
  summaryLabel?: string;
  lightboxTitle?: string;
  /** Wrapper class for the injected HTML. Defaults from `collapsible`. */
  contentClassName?: string;
}

export function WhyItMattersSection({
  html,
  existingWhyIllustrationSrcs,
  collapsible = true,
  summaryLabel = 'Why this matters',
  lightboxTitle = 'Why this matters',
  contentClassName,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const titleId = useId();

  const existingSet = useMemo(
    () =>
      existingWhyIllustrationSrcs === undefined
        ? undefined
        : new Set(existingWhyIllustrationSrcs),
    [existingWhyIllustrationSrcs]
  );

  const displayHtml = useMemo(
    () => filterWhyItMattersFiguresByExistingSrcs(html, existingSet),
    [html, existingSet]
  );

  const close = useCallback(() => setLightbox(null), []);

  // React reapplies dangerouslySetInnerHTML when state changes, replacing <img> nodes.
  // Delegate clicks/keydown from the stable container so listeners survive re-renders.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;

    const openFromImg = (img: HTMLImageElement) => {
      setLightbox({
        src: img.getAttribute('src') || img.currentSrc || '',
        alt: img.getAttribute('alt') || '',
      });
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const img = el.closest('img');
      if (!img || !(img instanceof HTMLImageElement) || !root.contains(img)) return;
      e.preventDefault();
      openFromImg(img);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target;
      if (!(el instanceof HTMLImageElement) || !root.contains(el)) return;
      e.preventDefault();
      openFromImg(el);
    };

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
    };
  }, [displayHtml]);

  // Re-apply after each paint: new img nodes from innerHTML resets need tabIndex/role again.
  useLayoutEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    root.querySelectorAll('img').forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
    });
  }, [displayHtml, lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close]);

  const duplicateHtml = useMemo(() => proseWithoutFigures(displayHtml), [displayHtml]);

  const proseWrapperClass =
    contentClassName ?? (collapsible ? 'prose lesson-details-body' : 'prose scenario-intro-body');

  const proseBlock = (
    <div
      ref={bodyRef}
      className={proseWrapperClass}
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  );

  return (
    <>
      {collapsible ? (
        <details className="lesson-details">
          <summary>{summaryLabel}</summary>
          {proseBlock}
        </details>
      ) : (
        proseBlock
      )}

      {lightbox ? (
        <div
          className="why-matters-lightbox-overlay show"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="why-matters-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="why-matters-lightbox-header">
              <h3 id={titleId} className="why-matters-lightbox-title">
                {lightboxTitle}
              </h3>
              <div className="why-matters-lightbox-actions">
                <LearnFontControl />
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="why-matters-lightbox-close"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="why-matters-lightbox-img-wrap">
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="why-matters-lightbox-img"
                decoding="async"
              />
            </div>
            <div
              className="prose why-matters-lightbox-copy"
              dangerouslySetInnerHTML={{ __html: duplicateHtml }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
