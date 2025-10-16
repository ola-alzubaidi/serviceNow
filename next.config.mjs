/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Polyfill for StackBlitz environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
      };
    }
    return config;
  },
};

export default nextConfig;

