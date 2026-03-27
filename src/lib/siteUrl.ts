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
  return 'https://www.numpydojo.com';
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}
