import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../posthog-server', () => ({
  shutdownPosthogServer: vi.fn().mockResolvedValue(undefined),
}));

describe('posthog-shutdown-hooks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('registers SIGTERM and SIGINT', async () => {
    const once = vi.spyOn(process, 'once').mockReturnValue(process as NodeJS.Process);
    const { registerPosthogShutdownHooks } = await import('../posthog-shutdown-hooks');
    registerPosthogShutdownHooks();
    expect(once).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(once).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  });

  it('SIGTERM handler loads posthog-server and shuts down', async () => {
    const handlers: Record<string, () => void> = {};
    vi.spyOn(process, 'once').mockImplementation((event: string | symbol, fn: () => void) => {
      handlers[String(event)] = fn;
      return process as NodeJS.Process;
    });
    vi.resetModules();
    const server = await import('../posthog-server');
    const { registerPosthogShutdownHooks } = await import('../posthog-shutdown-hooks');
    registerPosthogShutdownHooks();
    handlers.SIGTERM?.();
    await vi.waitFor(() => {
      expect(vi.mocked(server.shutdownPosthogServer)).toHaveBeenCalled();
    });
  });
});
