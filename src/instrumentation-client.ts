// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

// Only initialize Sentry in the browser
if (typeof window !== 'undefined') {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isMonitoringEnabled = String(process.env.NEXT_PUBLIC_ENABLE_MONITORING) === 'true';

  // Only initialize Sentry in production when monitoring is explicitly enabled
  if (isDevelopment || (isProduction && isMonitoringEnabled)) {
    const sentryOptions: Sentry.BrowserOptions = {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Performance Monitoring
      tracesSampleRate: isProduction ? 0.1 : 0, // Sample 10% of transactions in production
      
      // Session Replay
      replaysSessionSampleRate: isProduction ? 0.1 : 0, // Sample 10% of sessions in production
      replaysOnErrorSampleRate: isProduction ? 1.0 : 0, // Always capture replays for error sessions in production
      
      // Disable debug in production builds
      debug: isDevelopment,
      
      // Only enable logs in development
      enableLogs: isDevelopment,
    };

    // Add Replay integration only in production
    if (isProduction) {
      sentryOptions.integrations = [
        new Replay({
          maskAllText: false,
          blockAllMedia: true,
          networkDetailAllowUrls: [window.location.origin],
          networkCaptureBodies: true,
        }),
      ];
    }

    Sentry.init(sentryOptions);

    // Add user context when available
    Sentry.setUser({
      ip_address: '{{auto}}', // Auto-capture IP address
    });
  }
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;