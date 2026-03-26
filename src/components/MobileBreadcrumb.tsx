'use client';

import { useEffect, useState } from 'react';

interface Props {
  currentIndex: number;
  totalCount: number;
  title: string;
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenNav: () => void;
}

export function MobileBreadcrumb({
  currentIndex,
  totalCount,
  title,
  label,
  onPrev,
  onNext,
  onOpenNav,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-breadcrumb">
      <button
        type="button"
        className="mobile-breadcrumb-arrow"
        onClick={onPrev}
        disabled={!onPrev}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        className="mobile-breadcrumb-center"
        onClick={onOpenNav}
      >
        <span className="mobile-breadcrumb-pos">
          {label} {currentIndex + 1} of {totalCount}
        </span>
        <span className="mobile-breadcrumb-title">{title}</span>
      </button>
      <button
        type="button"
        className="mobile-breadcrumb-arrow"
        onClick={onNext}
        disabled={!onNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
