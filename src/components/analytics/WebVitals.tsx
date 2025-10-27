'use client';

import { useReportWebVitals as useReportNextWebVitals } from 'next/web-vitals';
import { track } from '@vercel/analytics';
import type { NextWebVitalsMetric } from 'next/dist/shared/lib/utils';

export function WebVitals() {
  const monitoringEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONITORING?.toString() === 'true';

  useReportNextWebVitals((metric) => {
    if (!monitoringEnabled) return;

    track('web-vitals', {
      ...metric,
      href: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  });

  return null;
}

export function useReportWebVitals() {
  const monitoringEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONITORING?.toString() === 'true';

  return (metric: NextWebVitalsMetric) => {
    if (!monitoringEnabled) return;

    track('web-vitals', {
      ...metric,
      href: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  };
}
