import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  transpilePackages: ['@e-infra/react-molstar-wrapper'],
  experimental: {
    optimizePackageImports: ['d3', 'framer-motion'],
  },
};
export default nextConfig;
