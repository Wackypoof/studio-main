import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Listing } from '@/lib/types';
import { ListingTable } from '@/components/dashboard/ListingTable';

interface RecentListingsProps {
  listings: Listing[];
  onViewListing: (id: string) => void;
  isLoading?: boolean;
  showViewAll?: boolean;
  maxListings?: number;
}

export function RecentListings({
  listings = [],
  onViewListing,
  isLoading = false,
  showViewAll = true,
  maxListings = 3,
}: RecentListingsProps) {
  // Sort and limit the number of listings to show
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, maxListings);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Listings</h2>
        {showViewAll && listings.length > 0 && (
          <Button shape="pill" variant="ghost" size="sm" asChild>
            <Link href="/dashboard/browse-listings">
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
  );
}
