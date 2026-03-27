import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import './hamburgers-elastic.css';
import { PostHogInit } from '@/components/PostHogInit';
import { AnalyticsPageView } from '@/components/AnalyticsPageView';
import { MobileViewportShell } from '@/components/MobileViewportShell';
import {
  DEFAULT_OG_IMAGE_ALT,
  defaultOgImages,
  defaultTwitterImages,
  getDefaultOgImageAbsoluteUrl,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from '@/lib/ogDefaultImage';
import { DEFAULT_SHARE_DESCRIPTION, DEFAULT_SHARE_TITLE, SITE_NAME } from '@/lib/shareCopy';
import { getMetadataBase } from '@/lib/siteUrl';

const defaultOgImageUrl = getDefaultOgImageAbsoluteUrl();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: DEFAULT_SHARE_TITLE,
  description: DEFAULT_SHARE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: DEFAULT_SHARE_TITLE,
    description: DEFAULT_SHARE_DESCRIPTION,
    images: defaultOgImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SHARE_TITLE,
    description: DEFAULT_SHARE_DESCRIPTION,
    images: defaultTwitterImages(),
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥋</text></svg>",
  },
};

const themeInitScript = `
try {
  var t = localStorage.getItem('np_dojo_theme');
  var theme;
  if (t === 'light' || t === 'dark') {
    theme = t;
  } else {
    if (t === 'system') localStorage.removeItem('np_dojo_theme');
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme);
} catch (e) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="color-scheme" content="dark light" />
        {/* Explicit og:image — structured tags follow og:image per ogp.me; helps Facebook resolve size before async fetch. */}
        <meta property="og:image" content={defaultOgImageUrl} />
        <meta property="og:image:secure_url" content={defaultOgImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
        <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
        <meta property="og:image:alt" content={DEFAULT_OG_IMAGE_ALT} />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <MobileViewportShell />
        <PostHogInit />
        <Suspense fallback={null}>
          <AnalyticsPageView />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
