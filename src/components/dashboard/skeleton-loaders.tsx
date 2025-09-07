import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" data-testid="dashboard-skeleton" role="status" aria-label="Loading dashboard">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" data-testid="title-skeleton" />
        <Skeleton className="h-5 w-80" />
      </div>
      
      <div className="rounded-lg border p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="ml-auto h-9 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-6" data-testid="stat-card-skeleton">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <Skeleton className="mt-2 h-4 w-64" />
            <Skeleton className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-4 w-64" />
      <Skeleton className="mt-4 h-8 w-16" />
    </div>
  );
}
