import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const captureException = vi.fn();
const flush = vi.fn().mockResolvedValue(undefined);
const shutdown = vi.fn().mockResolvedValue(undefined);

vi.mock('posthog-node', () => ({
  PostHog: vi.fn().mockImplementation(() => ({
    captureException,
    flush,
    shutdown,
  })),
}));

describe('posthog-server', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    captureException.mockClear();
    flush.mockClear();
    shutdown.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getPosthogServer returns null without token', async () => {
    const { getPosthogServer } = await import('../posthog-server');
    expect(getPosthogServer()).toBeNull();
  });

  it('getPosthogServer creates client once', async () => {
    vi.stubEnv('POSTHOG_SERVER_TOKEN', 'phx');
    const { getPosthogServer } = await import('../posthog-server');
    const a = getPosthogServer();
    const b = getPosthogServer();
    expect(a).toBe(b);
    expect(vi.mocked((await import('posthog-node')).PostHog)).toHaveBeenCalledTimes(1);
  });

  it('captureServerException forwards to client', async () => {
    vi.stubEnv('POSTHOG_SERVER_TOKEN', 'phx');
    const { getPosthogServer, captureServerException } = await import('../posthog-server');
    getPosthogServer();
    captureServerException(new Error('e'), { k: 'v' });
    expect(captureException).toHaveBeenCalled();
  });

  it('flushPosthogServer and shutdownPosthogServer are safe when no client', async () => {
    const { flushPosthogServer, shutdownPosthogServer } = await import('../posthog-server');
    await expect(flushPosthogServer()).resolves.toBeUndefined();
    await expect(shutdownPosthogServer()).resolves.toBeUndefined();
  });

  it('captureServerExceptionAndFlush awaits flush', async () => {
    vi.stubEnv('POSTHOG_SERVER_TOKEN', 'phx');
    const { getPosthogServer, captureServerExceptionAndFlush } = await import('../posthog-server');
    getPosthogServer();
    await captureServerExceptionAndFlush(new Error('x'));
    expect(flush).toHaveBeenCalled();
  });

  it('shutdownPosthogServer clears singleton', async () => {
    vi.stubEnv('POSTHOG_SERVER_TOKEN', 'phx');
    const mod = await import('../posthog-server');
    mod.getPosthogServer();
    await mod.shutdownPosthogServer();
    vi.resetModules();
    vi.unstubAllEnvs();
    const { getPosthogServer: g2 } = await import('../posthog-server');
    expect(g2()).toBeNull();
  });
});
