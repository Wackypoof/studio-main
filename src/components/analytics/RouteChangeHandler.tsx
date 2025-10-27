'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@vercel/analytics';

export function RouteChangeHandler() {
  const monitoringEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONITORING?.toString() === 'true';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? '';

  useEffect(() => {
    if (!monitoringEnabled) return;

    const handleRouteChange = () => {
      const url = search ? `${pathname}?${search}` : pathname;

      track('route-change', {
        url,
        pathname,
        search,
        timestamp: new Date().toISOString(),
      });

      if (typeof window !== 'undefined' && window.performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
          const { domComplete, loadEventEnd, domInteractive } = navEntry;

          track('page-load', {
            pathname,
            domComplete,
            loadEventEnd,
            domInteractive,
            timeToInteractive: domInteractive,
            totalLoadTime: loadEventEnd,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    handleRouteChange();

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          handleRouteChange();
        }
      });
    });

    observer.observe({ type: 'navigation', buffered: true });

    return () => {
      observer.disconnect();
    };
  }, [monitoringEnabled, pathname, search]);

  return null;
}
