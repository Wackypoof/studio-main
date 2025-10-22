'use client';

import { useReportWebVitals as useReportNextWebVitals } from 'next/web-vitals';
import { log } from 'next-axiom';

export function WebVitals() {
  if (process.env.NEXT_PUBLIC_ENABLE_MONITORING !== 'true') {
    return null;
  }
  useReportNextWebVitals((metric) => {
    // Send Web Vitals to Axiom
    log.info('web-vitals', {
      ...metric,
      href: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  });

  return null;
}

// Custom hook to report Web Vitals
export function useReportWebVitals() {
  return (metric: any) => {
    if (process.env.NEXT_PUBLIC_ENABLE_MONITORING !== 'true') {
      return;
    }
    log.info('web-vitals', {
      ...metric,
      href: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  };
}
