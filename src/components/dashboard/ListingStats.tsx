import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Briefcase, Eye, Users, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  isLoading = false,
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
          {change !== undefined && <Skeleton className="mt-2 h-4 w-16" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p
            className={cn(
              "text-xs mt-1",
              change >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {change >= 0 ? "+" : ""}
            {change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

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
  lastUpdated = new Date(),
  onRefresh,
  isRefreshing = false,
}: ListingStatsProps) {
  // Calculate metrics
  const totalListings = listings.length;
  const activeListings = listings.filter(
    (listing) => listing.status === "live"
  ).length;
  const totalValue = listings.reduce(
    (sum, listing) => sum + listing.asking_price,
    0
  );
  const averageProfitMargin =
    listings.length > 0
      ? (listings.reduce(
          (sum, listing) => sum + listing.profit_t12m / listing.revenue_t12m,
          0
        ) /
          listings.length) *
        100
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Listings"
        value={activeListings}
        icon={<Briefcase className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Views"
        value={listings.reduce((sum, l) => sum + (l.views || 0), 0)}
        icon={<Eye className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Buyer Leads"
        value={listings.reduce((sum, l) => sum + (l.leads || 0), 0)}
        icon={<Users className="h-4 w-4" />}
        isLoading={isLoading}
      />
      <StatCard
        title="Avg. Response Time"
        value="2.5h"
        icon={<Clock className="h-4 w-4" />}
        isLoading={isLoading}
      />
    </div>
  );
}
