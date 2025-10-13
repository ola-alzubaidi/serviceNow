/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC for StackBlitz compatibility (SWC binary not available in WebContainers)
  swcMinify: false,
  
  webpack: (config, { isServer }) => {
    // Configure fallbacks for both client and server in StackBlitz
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        child_process: false,
      };
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
      };
    }
    return config;
  },
  
  // Disable experimental features that might cause issues
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;

