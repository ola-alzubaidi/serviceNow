import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static optimization for StackBlitz compatibility
  experimental: {
    // @ts-ignore - StackBlitz compatibility
    workerThreads: false,
    cpus: 1,
  },
  // Disable SWC minification in favor of Terser for StackBlitz
  swcMinify: false,
};

export default nextConfig;
