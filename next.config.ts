import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // API routes require server-side rendering — 'output: export' disables them.
  // Removed: output: 'export' — keeping SSR-capable for /api/checkout on Vercel.
  // GitHub Actions workflow still builds static pages via `npm run build && gh-pages -d out`.
  images: { unoptimized: true },
  output: 'export',
};

export default nextConfig;