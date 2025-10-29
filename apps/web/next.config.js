/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tokicheck/engine', '@tokicheck/types'],

  // Internationalization
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
    localeDetection: true,
  },

  // Performance optimizations
  swcMinify: true,

  // Output configuration
  output: 'standalone',
};

module.exports = nextConfig;
