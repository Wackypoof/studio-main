const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: (config, { dev, isServer }) => {
    // Only run in production and on the client side
    if (!dev && !isServer) {
      // Add Workbox plugin for service worker generation
      config.plugins.push(
        new InjectManifest({
          swSrc: path.join(__dirname, 'src/lib/service-worker.js'),
          swDest: 'service-worker.js',
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
};

// Merge with the main Next.js config
const withWorkbox = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['workbox-core', 'workbox-precaching', 'workbox-routing', 'workbox-strategies', 'workbox-expiration']);

module.exports = withTM(withWorkbox([], {
  // Your existing Next.js config goes here
}));
