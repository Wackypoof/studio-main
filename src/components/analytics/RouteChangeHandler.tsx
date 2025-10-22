'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { log } from 'next-axiom';

export function RouteChangeHandler() {
  if (process.env.NEXT_PUBLIC_ENABLE_MONITORING !== 'true') {
    return null;
  }
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = () => {
      // Track route changes
      log.info('route-change', {
        url: `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`,
        pathname,
        search: searchParams?.toString(),
        timestamp: new Date().toISOString(),
      });

      // Track page load performance
      if (typeof window !== 'undefined' && window.performance) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
          const { domComplete, loadEventEnd, domInteractive } = navEntry;
          
          log.info('page-load', {
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

    // Initial page load
    handleRouteChange();

    // Set up observer for route changes
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
  }, [pathname, searchParams]);

  return null;
}
