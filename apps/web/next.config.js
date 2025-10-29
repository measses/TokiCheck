/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tokicheck/engine', '@tokicheck/types'],

  // Performance optimizations
  swcMinify: true,

  // Vercel deployment
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../../'),
  },
};

module.exports = nextConfig;
