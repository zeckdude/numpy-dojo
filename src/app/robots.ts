import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/lib/siteUrl';

/**
 * Explicit allows for Meta crawlers (Sharing Debugger often cites robots when the fetch is 403).
 * If you still see 403, check the host (Cloudflare / Firebase / Vercel) for bot blocking — robots.txt alone cannot override that.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'Facebot', allow: '/' },
      { userAgent: 'facebookcatalog', allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    host: new URL(`${getSiteOrigin()}/`).host,
  };
}
