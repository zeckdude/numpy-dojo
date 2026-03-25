const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
