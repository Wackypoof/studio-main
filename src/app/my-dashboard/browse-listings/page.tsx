
'use client';

import { useState } from 'react';
import { listings } from '@/lib/data';
import { ListingCard } from '@/components/listing-card';
import { Collections } from '@/components/collections';
import { ListingFilters } from '@/components/listing-filters';
import type { Listing } from '@/lib/types';

export default function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const handleIndustryToggle = (industryLabel: string) => {
    setSelectedVertical(prev => prev === industryLabel ? 'all' : industryLabel);
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
    <div className="w-full">
      <Collections
        selectedIndustries={[selectedVertical]}
        onIndustryToggle={handleIndustryToggle}
      />
      
      <div className="w-full py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start max-w-7xl mx-auto w-full">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
