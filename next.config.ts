import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Retain local design history without exposing obsolete entry pages in production.
  async redirects() {
    if (process.env.NODE_ENV !== 'production') return [];
    return ['/builder', '/compare', '/process-options', '/final-preview'].map(source => ({
      source,
      destination: '/',
      permanent: false,
    }));
  },
};

export default nextConfig;
