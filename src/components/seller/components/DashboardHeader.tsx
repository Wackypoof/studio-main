import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ListingActions } from '@/components/dashboard/ListingActions';

interface DashboardHeaderProps {
  title: string;
  description: string;
  onCreateNewListing: () => void;
  onRefresh?: (() => void) | null | undefined;
  isRefreshing?: boolean;
  children?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  onCreateNewListing,
  onRefresh,
  isRefreshing = false,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <ListingActions
          onCreateNewListing={onCreateNewListing}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
}
