import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders: Array<{ key: string; value: string }> = [
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
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co *.sentry.io",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' fonts.gstatic.com",
      "connect-src 'self' *.supabase.co wss://*.supabase.co *.sentry.io",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // Allow strict CI builds by setting STRICT_BUILD=true
    ignoreBuildErrors: process.env.STRICT_BUILD !== 'true',
  },
  eslint: {
    // Allow strict CI builds by setting STRICT_BUILD=true
    ignoreDuringBuilds: process.env.STRICT_BUILD !== 'true',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'localhost',
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'your-production-domain.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Enable modern image formats for better performance
    dangerouslyAllowSVG: true,
    // Ensure images are served inline (not as downloads)
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enhanced experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-avatar',
      '@radix-ui/react-select',
      'lucide-react',
      'framer-motion'
    ],
  },
  // Enhanced webpack configuration for better performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce or eliminate pack cache big-string serialization overhead
    if (dev) {
      // In dev, keep everything in memory to avoid serializing large strings
      config.cache = { type: 'memory' } as any;
      // Hide verbose infra warnings in dev
      config.infrastructureLogging = { level: 'error' };
    } else {
      // In prod, keep filesystem cache but tune for less overhead
      config.cache = {
        type: 'filesystem',
        compression: 'gzip',
        maxMemoryGenerations: 2,
      } as any;
      // Keep useful warnings but avoid noise
      config.infrastructureLogging = { level: 'warn' };
    }

    // Avoid generating huge inline string sources for common text assets
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.(md|sql|txt)$/i,
      // Emit files instead of bundling as big strings
      type: 'asset/resource',
    });

    // Help incremental builds and reduce cache churn
    config.experiments = {
      ...(config.experiments || {}),
      cacheUnaffected: true,
    };

    // Optionally filter only this specific noisy warning
    config.stats = {
      ...(config.stats || {}),
      warningsFilter: [/(Serializing big strings)/],
    } as any;
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for common dependencies
            vendor: {
              name: 'vendors',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    // Optimize moment.js if present
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    // Inject Workbox service worker in client production builds if available
    if (!dev && !isServer) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { InjectManifest } = require('workbox-webpack-plugin');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const path = require('path');
        config.plugins.push(
          new InjectManifest({
            swSrc: path.join(__dirname, 'src/lib/service-worker.js'),
            swDest: 'service-worker.js',
            exclude: [
              /_next\/static\/.*\.js$/,
              /_next\/static\/chunks\/webpack.*\.js$/,
              /_next\/static\/development\/_buildManifest\.js$/,
            ],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          })
        );
      } catch (err) {
        // If workbox isn't installed, skip SW injection without failing the build
        console.warn('Workbox not available, skipping service worker injection');
      }
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

const sentryOptions = {
  org: 'fang-ventures-private-limited',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withBundleAnalyzer(withSentryConfig(nextConfig, sentryOptions));
