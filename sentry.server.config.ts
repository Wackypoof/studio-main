// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const enabled = `${process.env.NEXT_PUBLIC_ENABLE_MONITORING}` === 'true';
const isProd = process.env.NODE_ENV === 'production';
const tracesSampleRate = process.env.SENTRY_TRACES_SAMPLE_RATE
  ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
  : isProd ? 0.1 : 1.0;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
  enabled,
  tracesSampleRate,
  enableLogs: !isProd,
  debug: !isProd && enabled,
});
