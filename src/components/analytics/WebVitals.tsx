'use client';

import { useReportWebVitals as useReportNextWebVitals } from 'next/web-vitals';
import { track } from '@vercel/analytics';
import type { NextWebVitalsMetric } from 'next/dist/shared/lib/utils';

type MetricWithAttribution = NextWebVitalsMetric & {
  attribution?: Record<string, unknown>;
};

const monitoringEnabled = `${process.env.NEXT_PUBLIC_ENABLE_MONITORING}` === 'true';

const buildPayload = (metric: NextWebVitalsMetric) => {
  const { attribution, ...rest } = metric as MetricWithAttribution;
  const payload: Record<string, string | number | boolean> = {
    ...(rest as Record<string, string | number | boolean>),
    href: typeof window !== 'undefined' ? window.location.href : '',
    path: typeof window !== 'undefined' ? window.location.pathname : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  if (attribution) {
    payload.attribution = JSON.stringify(attribution);
  }

  return payload;
};

export function WebVitals() {
  useReportNextWebVitals((metric) => {
    if (!monitoringEnabled) return;

    track('web-vitals', buildPayload(metric));
  });

  return null;
}

export function useReportWebVitals() {
  return (metric: NextWebVitalsMetric) => {
    if (!monitoringEnabled) return;

    track('web-vitals', buildPayload(metric));
  };
}
