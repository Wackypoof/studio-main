'use client';

import { PerformanceDashboard } from '@/components/analytics/PerformanceDashboard';

export default function PerformancePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      <PerformanceDashboard />
    </div>
  );
}
