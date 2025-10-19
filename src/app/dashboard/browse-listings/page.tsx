
'use client';

import { useState, Suspense } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { exampleListings } from '@/lib/example-listings';
import { ListingCard } from '@/components/listing-card';
import { LazyAdvancedFilters, LazyDashboardCollections } from '@/lib/lazy-components';
import { PageHeader } from '@/components/page-header';
import type { Listing } from '@/lib/types';

export default function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [revenueRange, setRevenueRange] = useState<[number, number]>([0, 1000000]);
  const [profitMarginRange, setProfitMarginRange] = useState<[number, number]>([0, 100]);

  const handleIndustrySelect = (industryLabel: string) => {
    setSelectedVertical(industryLabel);
  };
  
  // Industry mapping is no longer needed as we're using direct matches
  // with the verticals in the listings data

  const filteredListings = exampleListings.filter((listing: Listing) => {
    // Search term filter
    const matchesSearch = searchTerm.trim() === '' ? true : 
      listing.headline.toLowerCase().includes(searchTerm.toLowerCase()) || 
      listing.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.vertical.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range filter
    const matchesPrice = listing.asking_price >= priceRange[0] && listing.asking_price <= priceRange[1];
    
    // Revenue range filter
    const matchesRevenue = listing.revenue_t12m >= revenueRange[0] && listing.revenue_t12m <= revenueRange[1];
    
    // Profit margin filter
    const listingProfitMargin = (listing.profit_t12m / listing.revenue_t12m) * 100;
    const matchesProfitMargin = listingProfitMargin >= profitMarginRange[0] && listingProfitMargin <= profitMarginRange[1];
    
    // Vertical filter - direct match with listing's vertical
    const matchesVertical = selectedVertical === 'all' || listing.vertical === selectedVertical;
    
    // Location filter
    const matchesLocation = selectedLocation === 'all' ? true : listing.location_area === selectedLocation;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' ? true : listing.status === selectedStatus;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesRevenue &&
      matchesProfitMargin &&
      matchesVertical &&
      matchesLocation &&
      matchesStatus
    );
  });


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Browse Listings"
        description="Discover and evaluate potential business opportunities."
      />
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search listings..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
            </span>
            <Suspense fallback={<div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />}>
              <LazyAdvancedFilters
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                revenueRange={revenueRange}
                onRevenueRangeChange={setRevenueRange}
                profitMarginRange={profitMarginRange}
                onProfitMarginChange={setProfitMarginRange}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
            </Suspense>
          </div>
        </div>
        
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>}>
          <LazyDashboardCollections
            selectedIndustry={selectedVertical}
            onSelect={handleIndustrySelect}
          />
        </Suspense>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing: Listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <p>No listings found for your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
