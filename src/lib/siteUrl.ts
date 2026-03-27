const PUBLIC_PRODUCTION_ORIGIN = 'https://www.numpydojo.com';

function parseHttpOrigin(input: string): string | null {
  const t = input.trim().replace(/\/+$/, '');
  if (!t) return null;
  const withProto = t.includes('://') ? t : `https://${t}`;
  try {
    return new URL(withProto).origin;
  } catch {
    return null;
  }
}

function isLocalhostHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '0.0.0.0';
}

/**
 * Origin for `og:image` / `twitter:image` only.
 * If `NEXT_PUBLIC_SITE_URL` is localhost (typical in `.env.local`), crawlers still get the production host so previews work.
 * Real previews (Firebase, Vercel, production domain) keep using that public URL.
 */
export function getOgImageOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const origin = parseHttpOrigin(raw);
    if (origin && !isLocalhostHostname(new URL(origin).hostname)) {
      return origin;
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return PUBLIC_PRODUCTION_ORIGIN;
}

/** Canonical site origin for Open Graph URLs (no trailing slash). */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/+$/, '');
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return PUBLIC_PRODUCTION_ORIGIN;
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
