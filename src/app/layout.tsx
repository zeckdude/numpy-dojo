import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import './hamburgers-elastic.css';
import { PostHogInit } from '@/components/PostHogInit';
import { AnalyticsPageView } from '@/components/AnalyticsPageView';

export const metadata: Metadata = {
  title: 'NumPy Dojo',
  description: 'Interactive NumPy learning tool with hands-on lessons, real-world scenarios, and quizzes',
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
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <PostHogInit />
        <Suspense fallback={null}>
          <AnalyticsPageView />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
