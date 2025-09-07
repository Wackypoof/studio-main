/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Handle params warning in Next.js 13+
  experimental: {
    // This will handle the params warning
    // by making params a plain object instead of a Promise
    // in development mode
    // In production, it will still be a Promise
    // but the warning will be suppressed
    disableOptimizedLoading: true,
  },
  // Remove swcMinify as it's not needed with Turbopack
  // Remove webpack configuration as we're using Turbopack
};

module.exports = nextConfig;
