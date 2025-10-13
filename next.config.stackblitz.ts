import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal config for StackBlitz compatibility
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable features that cause issues in StackBlitz
  experimental: {
    // Disable server actions for StackBlitz
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },

  // Ensure proper webpack config for StackBlitz
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;

