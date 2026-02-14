import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // Disable experimental features that may cause issues
  experimental: {
    // Add experimental features here if needed
  },

  // Custom headers for embed system (CDN + API)
  headers: async () => [
    {
      // Widget script — aggressive immutable caching + CORS
      source: '/embed/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
    {
      // Embed API — CORS for cross-origin widget requests
      source: '/api/v1/embed/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
  ],
};

export default nextConfig;
