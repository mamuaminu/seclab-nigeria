import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // API routes need server-side rendering — Vercel handles this automatically
  // GitHub Actions workflow still uses `npm run build && gh-pages -d out`
  // which produces a static fallback for the main pages
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/seclab-nigeria' : '',
};

export default nextConfig;