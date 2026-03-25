import 'server-only';

/** Register SIGTERM/SIGINT handlers so PostHog flushes on Node process exit (not Edge). */
export function registerPosthogShutdownHooks(): void {
  const onShutdown = () => {
    void import('./posthog-server').then(({ shutdownPosthogServer }) => shutdownPosthogServer());
  };

  process.once('SIGTERM', onShutdown);
  process.once('SIGINT', onShutdown);
}
