import posthog from 'posthog-js';

const SESSION_KEY = 'np_dojo_ph_session';
const ATTRIB_KEY = 'np_dojo_ph_attribution_set';

let inited = false;

export type PosthogAppEnvironment = 'development' | 'staging' | 'preview' | 'production';

/**
 * Sets the `environment` super property on every event so you can match PostHog’s environment filters
 * (one project, multiple environments). Override with NEXT_PUBLIC_POSTHOG_ENV; otherwise uses
 * Vercel’s VERCEL_ENV when set, else NODE_ENV.
 */
export function getPosthogAppEnvironment(): PosthogAppEnvironment {
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

function getPosthogToken(): string {
  return (process.env.NEXT_PUBLIC_POSTHOG_TOKEN ?? '').trim();
}

export function getPosthogHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
}

export function initPosthog(): void {
  if (typeof window === 'undefined' || inited) return;
  const token = getPosthogToken();
  if (!token) return;

  const appEnvironment = getPosthogAppEnvironment();

  posthog.init(token, {
    api_host: getPosthogHost(),
    // Recommended for Next.js (script injection / SPA defaults); see PostHog Next.js docs.
    defaults: '2026-01-30',
    capture_pageview: false,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    person_profiles: 'identified_only',
    loaded: (ph) => {
      if (process.env.NEXT_PUBLIC_POSTHOG_DEBUG === '1') {
        ph.debug(true);
      }
      ph.startExceptionAutocapture();
    },
  });

  posthog.register({ environment: appEnvironment });

  inited = true;
}

export function isAnalyticsReady(): boolean {
  return inited;
}

/** Custom product events (same names as former Amplitude instrumentation). */
export function track(eventName: string, properties?: Record<string, unknown>): void {
  if (!getPosthogToken()) return;
  initPosthog();
  if (!inited) return;
  posthog.capture(eventName, properties);
}

/** Report a handled error to PostHog Error tracking. */
export function captureClientError(error: unknown, additionalProperties?: Record<string, unknown>): void {
  if (!getPosthogToken()) return;
  initPosthog();
  if (!inited) return;
  posthog.captureException(error, additionalProperties);
}

export function routeKindFromPath(pathname: string): 'dashboard' | 'lesson' | 'scenario' | 'quiz' | 'other' {
  if (pathname === '/' || pathname === '') return 'dashboard';
  if (pathname.startsWith('/lessons/')) return 'lesson';
  if (pathname.startsWith('/scenarios/')) return 'scenario';
  if (pathname === '/scenarios') return 'other';
  if (pathname.startsWith('/quizzes')) return 'quiz';
  return 'other';
}

export function captureAttributionOnce(pathname: string, search: string): void {
  if (!inited || typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(ATTRIB_KEY)) return;
    localStorage.setItem(ATTRIB_KEY, '1');
    const q = search.startsWith('?') ? search.slice(1) : search;
    const params = new URLSearchParams(q);
    const once: Record<string, string> = {
      first_landing_path: pathname + (search || ''),
      first_referrer: document.referrer || '(direct)',
    };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
      const v = params.get(k);
      if (v) once[k] = v;
    }
    posthog.register_once(once);
  } catch {
    /* ignore */
  }
}

export function captureSessionStarted(pathname: string, search: string, routeKind: string): void {
  if (!inited || typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    const q = search.startsWith('?') ? search.slice(1) : search;
    const params = new URLSearchParams(q);
    track('session_started', {
      path: pathname + (search || ''),
      referrer: document.referrer || '(direct)',
      route_kind: routeKind,
      is_dashboard: routeKind === 'dashboard',
      utm_source: params.get('utm_source') ?? undefined,
      utm_medium: params.get('utm_medium') ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
    });
  } catch {
    /* ignore */
  }
}

export function recordPageView(pathname: string, search: string): void {
  initPosthog();
  if (!inited) return;
  const routeKind = routeKindFromPath(pathname);
  const url = typeof window !== 'undefined' ? window.location.href : pathname + (search || '');
  captureAttributionOnce(pathname, search);
  captureSessionStarted(pathname, search, routeKind);

  posthog.capture('$pageview', {
    $current_url: url,
    route_kind: routeKind,
  });
  track('page_view', {
    path: pathname + (search || ''),
    route_kind: routeKind,
  });
}
