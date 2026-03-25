'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordPageView } from '@/lib/analytics';

/**
 * Tracks `page_view` and first-hit attribution/session on route changes.
 * Must be rendered inside `<Suspense>` because of `useSearchParams`.
 */
export function AnalyticsPageView() {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const searchStr = searchParams?.toString() ?? '';
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    const search = searchStr ? `?${searchStr}` : '';
    const key = pathname + search;
    if (prevRef.current === key) return;
    prevRef.current = key;

    recordPageView(pathname, search);
  }, [pathname, searchStr]);

  return null;
}
