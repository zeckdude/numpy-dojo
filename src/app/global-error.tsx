'use client';

import { useEffect } from 'react';
import { captureClientError } from '@/lib/analytics';

/**
 * Catches errors in the root layout. Replaces the whole document tree, so it must render html/body.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientError(error, { surface: 'next_global_error', digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{error.message || 'An unexpected error occurred.'}</p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
