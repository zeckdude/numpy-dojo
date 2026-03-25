'use client';

import { useEffect } from 'react';
import { captureClientError } from '@/lib/analytics';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureClientError(error, { surface: 'next_error_boundary', digest: error.digest });
  }, [error]);

  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message || 'An unexpected error occurred.'}</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
