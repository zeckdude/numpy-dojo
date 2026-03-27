import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/posthog-server', () => ({
  captureServerExceptionAndFlush: vi.fn().mockResolvedValue(undefined),
}));

describe('GET /api/posthog-server-test', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 404 in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { GET } = await import('./route');
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it('returns 404 when POSTHOG_SERVER_TEST is not 1', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('POSTHOG_SERVER_TEST', '');
    const { GET } = await import('./route');
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it('returns 200 when dev and POSTHOG_SERVER_TEST=1', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('POSTHOG_SERVER_TEST', '1');
    const { GET } = await import('./route');
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
