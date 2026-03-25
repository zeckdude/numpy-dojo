import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

function getServerToken(): string {
  return (process.env.POSTHOG_SERVER_TOKEN ?? process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? '').trim();
}

function getServerHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
}

function serverEnvironment(): string {
  const explicit = process.env.NEXT_PUBLIC_POSTHOG_ENV?.trim().toLowerCase();
  if (
    explicit === 'development' ||
    explicit === 'staging' ||
    explicit === 'preview' ||
    explicit === 'production'
  ) {
    return explicit;
  }
  const vercel = process.env.NEXT_PUBLIC_VERCEL_ENV?.trim().toLowerCase();
  if (vercel === 'development' || vercel === 'preview' || vercel === 'production') {
    return vercel;
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/** Singleton Node client; safe to reuse across a single server process / lambda. */
export function getPosthogServer(): PostHog | null {
  const token = getServerToken();
  if (!token) return null;
  if (!client) {
    client = new PostHog(token, {
      host: getServerHost(),
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

const SERVER_DISTINCT_ID = '$server';

/**
 * Queue a server-side exception for PostHog Error tracking (same project as the browser SDK).
 * Call {@link flushPosthogServer} or {@link shutdownPosthogServer} before the process or lambda ends.
 */
export function captureServerException(
  error: unknown,
  additionalProperties?: Record<string, string | number | boolean | undefined | null>
): void {
  const ph = getPosthogServer();
  if (!ph) return;
  const props: Record<string, string | number | boolean> = { environment: serverEnvironment() };
  if (additionalProperties) {
    for (const [k, v] of Object.entries(additionalProperties)) {
      if (v === undefined || v === null) continue;
      props[k] = typeof v === 'boolean' || typeof v === 'number' ? v : String(v);
    }
  }
  ph.captureException(error, SERVER_DISTINCT_ID, props);
}

export async function flushPosthogServer(): Promise<void> {
  const ph = getPosthogServer();
  if (!ph) return;
  await ph.flush();
}

/** Captures, then flushes — use from Route Handlers / Server Actions so events reach PostHog before the lambda exits. */
export async function captureServerExceptionAndFlush(
  error: unknown,
  additionalProperties?: Record<string, string | number | boolean | undefined | null>
): Promise<void> {
  captureServerException(error, additionalProperties);
  await flushPosthogServer();
}

export async function shutdownPosthogServer(): Promise<void> {
  if (!client) return;
  try {
    await client.shutdown();
  } finally {
    client = null;
  }
}
