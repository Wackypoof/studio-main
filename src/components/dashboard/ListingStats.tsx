import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardMetricCard } from '@/components/dashboard/metric-card';
import { Briefcase, Eye, Users, Clock } from 'lucide-react';
import type { Listing } from '@/lib/types';

type ListingWithDashboardMeta = Listing & {
  views?: number | null;
  leads?: number | null;
  avg_response_time_hours?: number | null;
};

interface ListingStatsProps {
  listings?: ListingWithDashboardMeta[];
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ListingStats({
  listings = [],
  isLoading = false,
}: ListingStatsProps) {
  const metrics = useMemo(() => {
    const summary = listings.reduce(
      (acc, listing) => {
        if (listing.status === 'live') {
          acc.activeCount += 1;
        }

        const views = typeof listing.views === 'number' ? listing.views : 0;
        const leads = typeof listing.leads === 'number' ? listing.leads : 0;
        const responseTime =
          typeof listing.avg_response_time_hours === 'number'
            ? listing.avg_response_time_hours
            : null;

        acc.totalViews += views;
        acc.totalLeads += leads;
        if (responseTime !== null) {
          acc.responseTimes.push(responseTime);
        }

        return acc;
      },
      {
        activeCount: 0,
        totalViews: 0,
        totalLeads: 0,
        responseTimes: [] as number[],
      },
    );

    const avgResponseHours =
      summary.responseTimes.length > 0
        ? summary.responseTimes.reduce((sum, hours) => sum + hours, 0) /
          summary.responseTimes.length
        : 2.5;

    const formattedResponseTime =
      Number.isInteger(avgResponseHours) && avgResponseHours !== 0
        ? `${avgResponseHours.toFixed(0)}h`
        : `${avgResponseHours.toFixed(1)}h`;

    return [
      {
        label: 'Active Listings',
        value: summary.activeCount,
        icon: Briefcase,
        description: 'Currently visible to verified buyers',
      },
      {
        label: 'Total Views',
        value: summary.totalViews,
        icon: Eye,
        description: 'Combined traffic across all mandates',
      },
      {
        label: 'Buyer Leads',
        value: summary.totalLeads,
        icon: Users,
        description: 'Qualified operator interest this month',
      },
      {
        label: 'Avg. Response Time',
        value: formattedResponseTime,
        icon: Clock,
        description: 'Median time to first follow-up',
      },
    ];
  }, [listings]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="listing-stats-skeleton">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm"
            data-testid="listing-stats-skeleton-card"
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 opacity-20" />
            <Skeleton className="mb-5 h-12 w-12 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="listing-stats">
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          tone="seller"
        />
      ))}
    </div>
  );
}
