'use client';

import { useEffect } from 'react';
import { initPosthog } from '@/lib/analytics';

/** Initializes PostHog once on the client (analytics + exception autocapture). */
export function PostHogInit() {
  useEffect(() => {
    initPosthog();
  }, []);
  return null;
}
