import type { Metadata } from 'next';
import { PRODUCTION_SITE_ORIGIN } from './siteUrl';

/**
 * Static OG image (see `npm run generate-og`).
 * `public/og/default-light.png` is a light-theme variant for previews only; social tags use the dark default.
 */
export const OG_IMAGE_PATH = '/og/default.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const DEFAULT_OG_IMAGE_ALT = 'NumPy Dojo — Learn NumPy by doing';

/** Always production so social crawlers fetch a real PNG, not a preview deployment HTML shell. */
export function getDefaultOgImageAbsoluteUrl(): string {
  return `${PRODUCTION_SITE_ORIGIN}${OG_IMAGE_PATH}`;
}

export function defaultOgImages(): NonNullable<NonNullable<Metadata['openGraph']>['images']> {
  return [
    {
      url: getDefaultOgImageAbsoluteUrl(),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: DEFAULT_OG_IMAGE_ALT,
      type: 'image/png',
    },
  ];
}

export function defaultTwitterImages(): NonNullable<NonNullable<Metadata['twitter']>['images']> {
  return [
    {
      url: getDefaultOgImageAbsoluteUrl(),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: DEFAULT_OG_IMAGE_ALT,
    },
  ];
}
