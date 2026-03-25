import type { Instrumentation } from 'next';

/**
 * Runs once per Next.js server instance. Flushes PostHog when the Node process is winding down
 * so queued server-side exceptions are not dropped.
 *
 * `onRequestError` reports App Router / Route Handler / Server Action failures to PostHog via
 * `posthog-node` (Node runtime only).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }

  const { registerPosthogShutdownHooks } = await import('./lib/posthog-shutdown-hooks');
  registerPosthogShutdownHooks();
}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const error = err instanceof Error ? err : new Error(String(err));
  const digest =
    typeof err === 'object' && err !== null && 'digest' in err
      ? String((err as { digest?: string }).digest ?? '')
      : '';

  const { captureServerExceptionAndFlush } = await import('./lib/posthog-server');
  await captureServerExceptionAndFlush(error, {
    surface: 'onRequestError',
    request_path: request.path,
    request_method: request.method,
    router_kind: context.routerKind,
    route_path: context.routePath,
    route_type: context.routeType,
    digest,
    render_source: context.renderSource ?? '',
    revalidate_reason: context.revalidateReason != null ? String(context.revalidateReason) : '',
  });
};
