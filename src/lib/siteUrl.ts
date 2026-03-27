/** Live site (canonical, share images). `og:image` always uses this origin so crawlers get real `image/png`, not preview HTML. */
export const PRODUCTION_SITE_ORIGIN = 'https://www.numpydojo.com';

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

/** Canonical site origin for `metadataBase` and `og:url` (no trailing slash). Preview/staging should set `NEXT_PUBLIC_SITE_URL`. */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/+$/, '');
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return PRODUCTION_SITE_ORIGIN;
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
