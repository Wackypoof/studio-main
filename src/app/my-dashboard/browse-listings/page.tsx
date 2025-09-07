
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listings } from '@/lib/data';
import { ListingCard } from '@/components/listing-card';
import { DashboardCollections } from '@/components/dashboard-collections';
import { ListingFilters } from '@/components/listing-filters';
import { PageHeader } from '@/components/page-header';
import type { Listing } from '@/lib/types';

export default function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleIndustrySelect = (industryLabel: string) => {
    setSelectedVertical(industryLabel);
  };
  
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchTerm.trim() === '' ? true : 
      listing.headline.toLowerCase().includes(searchTerm.toLowerCase()) || 
      listing.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.vertical.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = listing.asking_price >= priceRange[0] && listing.asking_price <= priceRange[1];
    const matchesVertical = selectedVertical === 'all' ? true : listing.vertical === selectedVertical;
    const matchesLocation = selectedLocation === 'all' ? true : listing.location_area === selectedLocation;

    return matchesSearch && matchesPrice && matchesVertical && matchesLocation;
  });


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Browse Listings"
        description="Discover and evaluate potential business opportunities."
      />
      
      <div className="space-y-6 pb-6 border-b border-border/50">
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>
          
          <DashboardCollections
            selectedIndustry={selectedVertical}
            onSelect={handleIndustrySelect}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <h3 className="font-medium">Filters</h3>
                <ListingFilters 
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedVertical={selectedVertical}
                  onVerticalChange={setSelectedVertical}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                />
              </div>
            </aside>
            
            <div className="lg:col-span-3">
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No listings found for your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
