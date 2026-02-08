import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // Disable experimental features that may cause issues
  experimental: {
    // Add experimental features here if needed
  },
};

export default nextConfig;
