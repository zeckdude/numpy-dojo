const path = require('path');

// Next default list (see `next/dist/shared/lib/router/utils/html-bots.js`) plus `Facebot`, which
// Meta also uses — without it, OG meta can stream into the body and the Sharing Debugger misses `og:image`.
const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|Facebot|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  htmlLimitedBots,
  // Pin workspace root when a parent directory has another lockfile (avoids wrong Turbopack root).
  turbopack: {
    root: path.join(__dirname),
  },
  // Expose Vercel deploy type to the browser for PostHog `environment` (production | preview | development).
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? '',
  },
  async redirects() {
    return [
      { source: '/learn', destination: '/lessons', permanent: true },
      { source: '/learn/:slug', destination: '/lessons/:slug', permanent: true },
      { source: '/quiz', destination: '/quizzes', permanent: true },
    ];
  },
};

module.exports = nextConfig;
