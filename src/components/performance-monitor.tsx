'use client';

import { useEffect } from 'react';
import { useReportWebVitals as useNextReportWebVitals } from 'next/web-vitals';
import { track } from '@vercel/analytics';

interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function PerformanceMonitor() {
  const monitoringEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONITORING?.toString() === 'true';

  useNextReportWebVitals((metric) => {
    if (!monitoringEnabled) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric);
    }

    if (process.env.NODE_ENV === 'production') {
      track('web-vitals', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  });

  useEffect(() => {
    if (!monitoringEnabled) return;

    const trackPerformance = () => {
      if (typeof window === 'undefined' || !('performance' in window)) return;

      const navigation = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;

      if (!navigation) return;

      const metrics: PerformanceMetrics[] = [
        {
          name: 'dns-lookup',
          value: navigation.domainLookupEnd - navigation.domainLookupStart,
          rating:
            navigation.domainLookupEnd - navigation.domainLookupStart > 1000
              ? 'poor'
              : 'good',
        },
        {
          name: 'tcp-connection',
          value: navigation.connectEnd - navigation.connectStart,
          rating:
            navigation.connectEnd - navigation.connectStart > 1000
              ? 'poor'
              : 'good',
        },
        {
          name: 'server-response',
          value: navigation.responseEnd - navigation.responseStart,
          rating:
            navigation.responseEnd - navigation.responseStart > 500
              ? 'needs-improvement'
              : 'good',
        },
        {
          name: 'dom-processing',
          value: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          rating:
            navigation.domContentLoadedEventEnd - navigation.responseEnd > 100
              ? 'needs-improvement'
              : 'good',
        },
        {
          name: 'total-load-time',
          value: navigation.loadEventEnd - navigation.startTime,
          rating:
            navigation.loadEventEnd - navigation.startTime > 3000
              ? 'poor'
              : 'good',
        },
      ];

      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', metrics);
      }
    };

    if (document.readyState === 'complete') {
      trackPerformance();
      return;
    }

    window.addEventListener('load', trackPerformance);
    return () => window.removeEventListener('load', trackPerformance);
  }, [monitoringEnabled]);

  return null;
}
