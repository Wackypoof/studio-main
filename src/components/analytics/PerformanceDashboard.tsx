'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { log } from 'next-axiom';

interface PerformanceData {
  timestamp: string;
  domComplete: number;
  loadEventEnd: number;
  domInteractive: number;
  pathname: string;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for the dashboard
  const mockMetrics = useMemo<PerformanceData[]>(
    () => [
      {
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        domComplete: 1200,
        loadEventEnd: 1500,
        domInteractive: 800,
        pathname: '/listings/1',
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        domComplete: 1100,
        loadEventEnd: 1400,
        domInteractive: 750,
        pathname: '/listings/2',
      },
      {
        timestamp: new Date().toISOString(),
        domComplete: 1000,
        loadEventEnd: 1300,
        domInteractive: 700,
        pathname: '/listings/3',
      },
    ],
    []
  );

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In a real app, you would fetch this from your analytics backend
        // For now, we'll use mock data
        setMetrics(mockMetrics);
        
        // Log that we're viewing the dashboard
        log.info('viewed-performance-dashboard', {
          timestamp: new Date().toISOString(),
          pathname: typeof window !== 'undefined' ? window.location.pathname : '',
        });
      } catch (error) {
        console.error('Error loading performance metrics:', error);
        log.error('Error loading performance metrics', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [mockMetrics]);

  if (isLoading) {
    return <div>Loading performance data...</div>;
  }

  // Process data for charts
  const chartData = metrics.map(metric => ({
    ...metric,
    date: new Date(metric.timestamp).toLocaleTimeString(),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Average Load Time" 
          value={`${Math.round(metrics.reduce((acc, curr) => acc + curr.loadEventEnd, 0) / (metrics.length || 1))}ms`} 
          description="Time until page is fully loaded"
        />
        <MetricCard 
          title="Avg. DOM Complete" 
          value={`${Math.round(metrics.reduce((acc, curr) => acc + curr.domComplete, 0) / (metrics.length || 1))}ms`} 
          description="Time until DOM is fully parsed"
        />
        <MetricCard 
          title="Avg. Interactive" 
          value={`${Math.round(metrics.reduce((acc, curr) => acc + curr.domInteractive, 0) / (metrics.length || 1))}ms`} 
          description="Time until page is interactive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Load Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="loadEventEnd" name="Load Time (ms)" stroke="#8884d8" />
              <Line type="monotone" dataKey="domComplete" name="DOM Complete (ms)" stroke="#82ca9d" />
              <Line type="monotone" dataKey="domInteractive" name="Interactive (ms)" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
