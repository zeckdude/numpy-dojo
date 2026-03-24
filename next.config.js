/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/learn', destination: '/lessons', permanent: true },
      { source: '/learn/:slug', destination: '/lessons/:slug', permanent: true },
      { source: '/quiz', destination: '/quizzes', permanent: true },
    ];
  },
};

module.exports = nextConfig;
