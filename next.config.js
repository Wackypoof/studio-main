const withWorkbox = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['workbox-core', 'workbox-precaching', 'workbox-routing', 'workbox-strategies', 'workbox-expiration']);
const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // Note: Content-Security-Policy should be customized based on your app's needs
  // This is a basic example, adjust as necessary
  // {
  //   key: 'Content-Security-Policy',
  //   value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  // },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // PWA Configuration
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    buildExcludes: [
      /middleware-manifest\.json$/, 
      /_middleware\.js$/, 
      /_middleware\.js\.map$/, 
      /middleware-runtime\.js$/, 
      /server/,
      /server\/.*\.js$/
    ],
    publicExcludes: ['!noprecache/**/*'],
    dynamicStartUrl: false,
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },
  
  // Static optimization
  swcMinify: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  
  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    // Enable the webpack build worker
    webpackBuildWorker: true,
  },

  // Image optimization
  images: {
    domains: [
      'localhost',
      // Add your production domains here
      'your-production-domain.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    if (!isServer) {
      // Don't include certain modules in client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

// Bundle analyzer for production build analysis
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  // Merge all configurations
// Merge all configurations
const config = withPWA({
  ...nextConfig,
  // Disable webpack 5's filesystem cache in development
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      require('./scripts/generate-sitemap');
    }
    
    // Add Workbox plugin for production
    if (!dev && !isServer) {
      const { InjectManifest } = require('workbox-webpack-plugin');
      
      config.plugins.push(
        new InjectManifest({
          swSrc: './src/lib/service-worker.js',
          swDest: '../public/service-worker.js',
          exclude: [
            /_next\/static\/.*\.js$/, // Exclude Next.js runtime chunks
            /_next\/static\/chunks\/webpack.*\.js$/, // Exclude webpack runtime
            /_next\/static\/development\/_buildManifest\.js$/, // Exclude development manifest
          ],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        })
      );
    }
    
    return config;
  },
});

module.exports = withTM(
  withWorkbox([], config)
);
}


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "fang-ventures-private-limited",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
