'use client';

import { useState } from 'react';
import { Listing } from '@/lib/types';
import { ListingStats } from '@/components/dashboard/ListingStats';
import { ListingTable } from '@/components/dashboard/ListingTable';
import { ListingActions } from '@/components/dashboard/ListingActions';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

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

  // Get the 3 most recently updated listings
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your listings and performance
          </p>
        </div>
        <ListingActions 
          onCreateNewListing={onCreateNewListing}
          onRefresh={onRefresh ? handleRefresh : undefined}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Stats Grid */}
      <ListingStats 
        listings={listings} 
        isLoading={isLoading} 
        lastUpdated={lastUpdated}
        onRefresh={onRefresh ? handleRefresh : undefined}
        isRefreshing={isRefreshing}
      />

      {/* Recent Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Listings</h2>
          {listings.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/listings">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <ListingTable 
          listings={recentListings}
          onViewListing={onViewListing}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
