'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function PerformanceMonitor() {
  if (process.env.NEXT_PUBLIC_ENABLE_MONITORING !== 'true') {
    return null;
  }
  useReportWebVitals((metric) => {
    // Log metrics to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to your analytics service
      // analytics.track('web-vitals', {
      //   name: metric.name,
      //   value: metric.value,
      //   rating: metric.rating,
      // });
    }
  });

  useEffect(() => {
    // Track additional performance metrics
    const trackPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (navigation) {
          const metrics: PerformanceMetrics[] = [
            {
              name: 'dns-lookup',
              value: navigation.domainLookupEnd - navigation.domainLookupStart,
              rating: navigation.domainLookupEnd - navigation.domainLookupStart > 1000 ? 'poor' : 'good',
            },
            {
              name: 'tcp-connection',
              value: navigation.connectEnd - navigation.connectStart,
              rating: navigation.connectEnd - navigation.connectStart > 1000 ? 'poor' : 'good',
            },
            {
              name: 'server-response',
              value: navigation.responseEnd - navigation.responseStart,
              rating: navigation.responseEnd - navigation.responseStart > 500 ? 'needs-improvement' : 'good',
            },
            {
              name: 'dom-processing',
              value: navigation.domContentLoadedEventEnd - navigation.responseEnd,
              rating: navigation.domContentLoadedEventEnd - navigation.responseEnd > 100 ? 'needs-improvement' : 'good',
            },
            {
              name: 'total-load-time',
              value: navigation.loadEventEnd - navigation.startTime,
              rating: navigation.loadEventEnd - navigation.startTime > 3000 ? 'poor' : 'good',
            },
          ];

          // Log or send these metrics as needed
          if (process.env.NODE_ENV === 'development') {
            console.log('Performance Metrics:', metrics);
          }
        }
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}
