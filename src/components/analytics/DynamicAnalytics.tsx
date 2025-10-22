'use client';

import dynamic from 'next/dynamic';

// Lazy-load analytics/monitoring only when enabled
const DynamicWebVitals = dynamic(
  () => import('@/components/analytics/WebVitals').then((m) => m.WebVitals),
  { ssr: false }
);

const DynamicRouteChangeHandler = dynamic(
  () => import('@/components/analytics/RouteChangeHandler').then((m) => m.RouteChangeHandler),
  { ssr: false }
);

const DynamicPerformanceMonitor = dynamic(
  () => import('@/components/performance-monitor').then((m) => m.PerformanceMonitor),
  { ssr: false }
);

interface DynamicAnalyticsProps {
  enableMonitoring: boolean;
}

export function DynamicAnalytics({ enableMonitoring }: DynamicAnalyticsProps) {
  return (
    <>
      {enableMonitoring && (
        <>
          <DynamicWebVitals />
          <DynamicRouteChangeHandler />
          <DynamicPerformanceMonitor />
        </>
      )}
    </>
  );
}
