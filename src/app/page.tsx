
'use client';

import { useState } from 'react';
import { listings } from '@/lib/data';
import { ListingCard } from '@/components/listing-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Collections } from '@/components/collections';
import { Header } from '@/components/Header';
import { SiteContainer } from '@/components/site-container';
import { ListingFilters } from '@/components/listing-filters';
import type { Listing } from '@/lib/types';

export default function MarketplacePage() {
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-28 lg:py-32 bg-card flex items-center justify-center">
          <SiteContainer>
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground/90">
                Find Your Next Business Opportunity
              </h1>
              <p className="text-muted-foreground md:text-xl">
                The confidential marketplace for buying and selling successful businesses in Southeast Asia.
              </p>
              <div className="mx-auto max-w-lg">
                <div className="flex space-x-2">
                  <Input
                    type="search"
                    placeholder="Search by industry, keyword..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="default">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </SiteContainer>
        </section>

        <Collections
          selectedIndustries={[selectedVertical]}
          onIndustryToggle={handleIndustryToggle}
        />
        
        <SiteContainer>
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
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
        </SiteContainer>
      </main>
    </div>
  );
}
