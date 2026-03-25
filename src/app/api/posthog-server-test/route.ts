import { NextResponse } from 'next/server';
import { captureServerExceptionAndFlush } from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';

/**
 * Dev-only helper to verify PostHog server-side error tracking.
 * Set POSTHOG_SERVER_TEST=1 in `.env.local`, restart dev, then GET /api/posthog-server-test
 * and look for this error in PostHog (distinct id `$server`). Remove the env var when done.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production' || process.env.POSTHOG_SERVER_TEST !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await captureServerExceptionAndFlush(
    new Error('PostHog server-side verification (safe to ignore)'),
    { surface: 'posthog_server_test' }
  );

  return NextResponse.json({
    ok: true,
    note: 'Sent a test server exception to PostHog. Check Error tracking / Activity for $server.',
  });
}
