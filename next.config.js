/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's not needed with Turbopack
  // Remove webpack configuration as we're using Turbopack
};

module.exports = nextConfig;
