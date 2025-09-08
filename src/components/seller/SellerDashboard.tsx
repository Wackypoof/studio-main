'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Listing } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ListingStats } from '@/components/dashboard/ListingStats';
import { DashboardHeader } from './components/DashboardHeader';
import { RecentListings } from './components/RecentListings';

interface SellerDashboardProps {
  listings: Listing[];
  onViewListing: (id: string) => void;
  onCreateNewListing: () => void;
  /**
   * Optional callback function to refresh the dashboard data
   * If not provided, the refresh button will be hidden
   */
  onRefresh?: (() => Promise<void>) | null;
  isLoading?: boolean;
  lastUpdated?: Date;
}

export function SellerDashboard({ 
  listings = [], 
  onViewListing, 
  onCreateNewListing, 
  onRefresh,
  isLoading = false,
  lastUpdated = new Date() 
}: SellerDashboardProps) {
  // State for managing refresh loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    try {
      setIsRefreshing(true);
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      // Consider adding toast notification here
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your listings and performance"
        onRefresh={onRefresh ? handleRefresh : undefined}
        isRefreshing={isRefreshing}
        onCreateNewListing={onCreateNewListing}
      />

      <ListingStats 
        listings={listings} 
        isLoading={isLoading} 
        lastUpdated={lastUpdated}
        onRefresh={onRefresh ? handleRefresh : undefined}
        isRefreshing={isRefreshing}
      />

      <RecentListings
        listings={listings}
        onViewListing={onViewListing}
        isLoading={isLoading}
        showViewAll={true}
        maxListings={3}
      />
    </div>
  );
}
