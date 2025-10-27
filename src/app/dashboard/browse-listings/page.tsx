
"use client";

import { useEffect, useMemo, useState, Suspense, useDeferredValue, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/listing-card';
import { LazyAdvancedFilters, LazyDashboardCollections } from '@/lib/lazy-components';
import { PageHeader } from '@/components/page-header';
import type { Listing } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useListings } from '@/hooks/useListings';

export default function BrowseListingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [revenueRange, setRevenueRange] = useState<[number, number]>([0, 1000000]);
  const [profitMarginRange, setProfitMarginRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'revenue_desc' | 'margin_desc'>('newest');

  // Saved searches in localStorage
  type SavedSearch = {
    id: string;
    name: string;
    createdAt: string;
    filters: {
      searchTerm: string;
      priceRange: [number, number];
      revenueRange: [number, number];
      profitMarginRange: [number, number];
      selectedVertical: string;
      selectedLocation: string;
      selectedStatus: string;
      sortBy: typeof sortBy;
    };
    emailAlerts: boolean;
    pushAlerts: boolean;
  };
  const STORAGE_KEY = 'savedSearches_v1';
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedSearch[]) : [];
    } catch {
      return [];
    }
  });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [newEmailAlerts, setNewEmailAlerts] = useState(true);
  const [newPushAlerts, setNewPushAlerts] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const persistSavedSearches = (next: SavedSearch[]) => {
    setSavedSearches(next);
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    }
  };

  const handleSaveCurrentSearch = () => {
    const id = `ss_${Date.now()}`;
    const payload: SavedSearch = {
      id,
      name: newSearchName.trim() || `Search ${savedSearches.length + 1}`,
      createdAt: new Date().toISOString(),
      emailAlerts: newEmailAlerts,
      pushAlerts: newPushAlerts,
      filters: {
        searchTerm,
        priceRange,
        revenueRange,
        profitMarginRange,
        selectedVertical,
        selectedLocation,
        selectedStatus,
        sortBy,
      },
    };
    persistSavedSearches([payload, ...savedSearches]);
    setSaveDialogOpen(false);
    setNewSearchName('');
  };

  const applySavedSearch = (ss: SavedSearch) => {
    setSearchTerm(ss.filters.searchTerm);
    setPriceRange(ss.filters.priceRange);
    setRevenueRange(ss.filters.revenueRange);
    setProfitMarginRange(ss.filters.profitMarginRange);
    setSelectedVertical(ss.filters.selectedVertical);
    setSelectedLocation(ss.filters.selectedLocation);
    setSelectedStatus(ss.filters.selectedStatus);
    setSortBy(ss.filters.sortBy);
  };

  const handleIndustrySelect = (industryLabel: string) => {
    setSelectedVertical(industryLabel);
  };
  
  // Industry mapping is no longer needed as we're using direct matches
  // with the verticals in the listings data

  const filteredListings = useMemo(() => exampleListings.filter((listing: Listing) => {
    // Search term filter
    const q = deferredSearch.trim().toLowerCase();
    const matchesSearch = q === '' ? true : 
      listing.headline.toLowerCase().includes(q) || 
      listing.teaser.toLowerCase().includes(q) ||
      listing.vertical.toLowerCase().includes(q);
    
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
  }), [deferredSearch, priceRange, revenueRange, profitMarginRange, selectedVertical, selectedLocation, selectedStatus]);

  // Reset visible count when filters change
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisibleCount(18));
    return () => cancelAnimationFrame(id);
  }, [deferredSearch, priceRange, revenueRange, profitMarginRange, selectedVertical, selectedLocation, selectedStatus, sortBy]);

  const sortedListings = useMemo(() => {
    const arr = [...filteredListings];
    switch (sortBy) {
      case 'price_asc':
        return arr.sort((a, b) => a.asking_price - b.asking_price);
      case 'price_desc':
        return arr.sort((a, b) => b.asking_price - a.asking_price);
      case 'revenue_desc':
        return arr.sort((a, b) => b.revenue_t12m - a.revenue_t12m);
      case 'margin_desc':
        return arr.sort((a, b) => (b.profit_t12m / b.revenue_t12m) - (a.profit_t12m / a.revenue_t12m));
      case 'newest':
      default:
        return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [filteredListings, sortBy]);

  // Infinite scroll: grow the visible window as the sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const CHUNK = 18;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + CHUNK, sortedListings.length));
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [sortedListings.length]);

  
  return (
    <div className="w-full space-y-6">
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
          <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {sortedListings.length} {sortedListings.length === 1 ? 'result' : 'results'}
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
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </Suspense>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Save search</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save this search</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search-name">Name</Label>
                    <Input id="search-name" value={newSearchName} onChange={(e) => setNewSearchName(e.target.value)} placeholder="e.g. SaaS > $500k revenue" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Email alerts</Label>
                      <p className="text-xs text-muted-foreground">Get a daily summary if new matches arrive</p>
                    </div>
                    <Switch checked={newEmailAlerts} onCheckedChange={setNewEmailAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Push notifications</Label>
                      <p className="text-xs text-muted-foreground">Requires browser permission</p>
                    </div>
                    <Switch checked={newPushAlerts} onCheckedChange={setNewPushAlerts} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCurrentSearch}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {savedSearches.length > 0 && (
              <div className="relative">
                <select
                  className="h-9 rounded-md border bg-background px-3 text-sm"
                  onChange={(e) => {
                    const ss = savedSearches.find(s => s.id === e.target.value);
                    if (ss) applySavedSearch(ss);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Saved searches ({savedSearches.length})
                  </option>
                  {savedSearches.map(ss => (
                    <option key={ss.id} value={ss.id}>{ss.name}</option>
                  ))}
                </select>
              </div>
            )}
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
          {sortedListings.length > 0 ? (
            <>
              {sortedListings.slice(0, visibleCount).map((listing: Listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {visibleCount < sortedListings.length && (
                <div ref={sentinelRef} className="col-span-3 flex justify-center py-6">
                  <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" aria-label="Loading more" />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-3 text-center py-16">
              <div className="text-muted-foreground">
                <p className="font-medium">No listings found for your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 2000000]);
                  setRevenueRange([0, 1000000]);
                  setProfitMarginRange([0, 100]);
                  setSelectedVertical('all');
                  setSelectedLocation('all');
                  setSelectedStatus('all');
                  setSortBy('newest');
                }}>Reset filters</Button>
                <Button variant="secondary" onClick={() => setSaveDialogOpen(true)}>Save this search</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
