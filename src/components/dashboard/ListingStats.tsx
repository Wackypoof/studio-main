import { Skeleton } from '@/components/ui/skeleton';
import { DashboardMetricCard } from '@/components/dashboard/metric-card';
import { Briefcase, Eye, Users, Clock } from 'lucide-react';

interface ListingStatsProps {
  listings: any[];
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ListingStats({
  listings = [],
  isLoading = false,
}: ListingStatsProps) {
  const metrics = [
    {
      label: 'Active Listings',
      value: listings.filter((listing) => listing.status === 'live').length,
      icon: Briefcase,
      description: 'Currently visible to verified buyers',
    },
    {
      label: 'Total Views',
      value: listings.reduce((sum, listing) => sum + (listing.views || 0), 0),
      icon: Eye,
      description: 'Combined traffic across all mandates',
    },
    {
      label: 'Buyer Leads',
      value: listings.reduce((sum, listing) => sum + (listing.leads || 0), 0),
      icon: Users,
      description: 'Qualified operator interest this month',
    },
    {
      label: 'Avg. Response Time',
      value: '2.5h',
      icon: Clock,
      description: 'Median time to first follow-up',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm"
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
