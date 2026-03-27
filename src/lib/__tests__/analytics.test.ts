/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const capture = vi.fn();
const captureException = vi.fn();
const register = vi.fn();
const register_once = vi.fn();
const init = vi.fn((_, opts: { loaded?: (ph: unknown) => void }) => {
  opts.loaded?.({
    debug: vi.fn(),
    startExceptionAutocapture: vi.fn(),
  });
});

vi.mock('posthog-js', () => ({
  default: {
    init,
    register,
    register_once,
    capture,
    captureException,
  },
}));

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    capture.mockClear();
    captureException.mockClear();
    register.mockClear();
    register_once.mockClear();
    init.mockClear();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getPosthogAppEnvironment uses explicit NEXT_PUBLIC_POSTHOG_ENV', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_ENV', 'staging');
    const { getPosthogAppEnvironment } = await import('../analytics');
    expect(getPosthogAppEnvironment()).toBe('staging');
  });

  it('getPosthogAppEnvironment uses VERCEL_ENV', async () => {
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', 'preview');
    const { getPosthogAppEnvironment } = await import('../analytics');
    expect(getPosthogAppEnvironment()).toBe('preview');
  });

  it('routeKindFromPath', async () => {
    const { routeKindFromPath } = await import('../analytics');
    expect(routeKindFromPath('/')).toBe('dashboard');
    expect(routeKindFromPath('/lessons/x')).toBe('lesson');
    expect(routeKindFromPath('/scenarios/x')).toBe('scenario');
    expect(routeKindFromPath('/quizzes')).toBe('quiz');
    expect(routeKindFromPath('/other')).toBe('other');
  });

  it('track is no-op without token', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', '');
    const { track } = await import('../analytics');
    track('evt');
    expect(capture).not.toHaveBeenCalled();
  });

  it('initPosthog and track with token', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    const { initPosthog, track, isAnalyticsReady } = await import('../analytics');
    initPosthog();
    expect(init).toHaveBeenCalled();
    expect(isAnalyticsReady()).toBe(true);
    track('hello', { a: 1 });
    expect(capture).toHaveBeenCalledWith('hello', { a: 1 });
  });

  it('captureClientError calls captureException when ready', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    const { initPosthog, captureClientError } = await import('../analytics');
    initPosthog();
    captureClientError(new Error('x'));
    expect(captureException).toHaveBeenCalled();
  });

  it('recordPageView captures when inited', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    const { initPosthog, recordPageView } = await import('../analytics');
    initPosthog();
    recordPageView('/lessons/foo', '?utm_source=x');
    expect(capture.mock.calls.some((c) => c[0] === '$pageview')).toBe(true);
  });

  it('captureAttributionOnce registers once', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    const { initPosthog, captureAttributionOnce } = await import('../analytics');
    initPosthog();
    captureAttributionOnce('/p', '?utm_source=email');
    captureAttributionOnce('/p', '');
    expect(register_once).toHaveBeenCalledTimes(1);
  });

  it('captureSessionStarted fires once per session', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_TOKEN', 'phc_test');
    const { initPosthog, captureSessionStarted } = await import('../analytics');
    initPosthog();
    captureSessionStarted('/', '', 'dashboard');
    captureSessionStarted('/', '', 'dashboard');
    const sessionStarts = capture.mock.calls.filter((c) => c[0] === 'session_started');
    expect(sessionStarts.length).toBe(1);
  });
});
