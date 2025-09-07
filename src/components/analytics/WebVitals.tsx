'use client';

import { useReportWebVitals as useReportNextWebVitals } from 'next/web-vitals';
import { log } from 'next-axiom';

export function WebVitals() {
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
    log.info('web-vitals', {
      ...metric,
      href: typeof window !== 'undefined' ? window.location.href : '',
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  };
}
