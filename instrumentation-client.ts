import * as Sentry from "@sentry/nextjs";
import { Replay } from "@sentry/replay";

// Only initialize Sentry in the browser
if (typeof window !== 'undefined') {
  const isProduction = process.env.NODE_ENV === 'production';
  // Ensure we're comparing strings since env vars are always strings
  const isMonitoringEnabled = String(process.env.NEXT_PUBLIC_ENABLE_MONITORING) === 'true';

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Only enable in production and if monitoring is explicitly enabled
    enabled: isProduction && isMonitoringEnabled,
    
    // Performance Monitoring
    tracesSampleRate: isProduction ? 1.0 : 0, // Capture 100% of transactions in production
    
    // Session Replay
    replaysSessionSampleRate: isProduction ? 0.1 : 0, // Sample 10% of sessions in production
    replaysOnErrorSampleRate: isProduction ? 1.0 : 0, // Always capture replays for error sessions in production
    
    integrations: [
      new Replay({
        // Additional Replay configuration
        maskAllText: false,
        blockAllMedia: true,
        networkDetailAllowUrls: [window.location.origin],
        networkCaptureBodies: true,
      }),
    ],
    
    // Disable in development
    debug: process.env.NODE_ENV === 'development',
    
    // Add user context when available
    beforeSend(event, hint) {
      // Add any custom filtering or modifications here
      return event;
    },
  });
}
