
"use client";

import { useEffect, useMemo, useState, Suspense, useDeferredValue, useRef, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ListingCard } from '@/components/listing-card';
import { LazyAdvancedFilters, LazyDashboardCollections } from '@/lib/lazy-components';
import { PageHeader } from '@/components/page-header';
import type { Listing } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
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

  const { listings: apiListings, isLoading, error, refetch } = useListings({ scope: 'public' });

  const handleIndustrySelect = (industryLabel: string) => {
    setSelectedVertical(industryLabel);
  };
  
  // Industry mapping is no longer needed as we're using direct matches
  // with the verticals in the listings data

  const filteredListings = useMemo(() => {
    const sourceListings = (apiListings || []) as Listing[];
    return sourceListings.filter((listing) => {
      const q = deferredSearch.trim().toLowerCase();
      const headline = (listing.headline || '').toLowerCase();
      const teaser = (listing.teaser || '').toLowerCase();
      const verticalValue = (listing.vertical || listing.market || '').toLowerCase();

      const matchesSearch =
        q === '' ||
        headline.includes(q) ||
        teaser.includes(q) ||
        verticalValue.includes(q);

      const askingPrice = listing.asking_price ?? 0;
      const matchesPrice = askingPrice >= priceRange[0] && askingPrice <= priceRange[1];

      const revenue = listing.revenue_t12m ?? 0;
      const matchesRevenue = revenue >= revenueRange[0] && revenue <= revenueRange[1];

      const profit = listing.profit_t12m ?? 0;
      const listingProfitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
      const matchesProfitMargin =
        listingProfitMargin >= profitMarginRange[0] &&
        listingProfitMargin <= profitMarginRange[1];

      const matchesVertical =
        selectedVertical === 'all' ||
        (listing.vertical || listing.market || '') === selectedVertical;

      const matchesLocation =
        selectedLocation === 'all' ||
        (listing.location_area || '') === selectedLocation;

      const matchesStatus =
        selectedStatus === 'all' || listing.status === selectedStatus;

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
  }, [
    apiListings,
    deferredSearch,
    priceRange,
    revenueRange,
    profitMarginRange,
    selectedVertical,
    selectedLocation,
    selectedStatus,
  ]);
  // Reset visible count when filters change
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisibleCount(18));
    return () => cancelAnimationFrame(id);
  }, [
    deferredSearch,
    priceRange,
    revenueRange,
    profitMarginRange,
    selectedVertical,
    selectedLocation,
    selectedStatus,
    sortBy,
    apiListings,
  ]);

  const sortedListings = useMemo(() => {
    const arr = [...filteredListings];
    switch (sortBy) {
      case 'price_asc':
        return arr.sort((a, b) => (a.asking_price ?? 0) - (b.asking_price ?? 0));
      case 'price_desc':
        return arr.sort((a, b) => (b.asking_price ?? 0) - (a.asking_price ?? 0));
      case 'revenue_desc':
        return arr.sort((a, b) => (b.revenue_t12m ?? 0) - (a.revenue_t12m ?? 0));
      case 'margin_desc':
        return arr.sort((a, b) => {
          const aRevenue = a.revenue_t12m ?? 0;
          const bRevenue = b.revenue_t12m ?? 0;
          const aMargin = aRevenue > 0 ? (a.profit_t12m ?? 0) / aRevenue : 0;
          const bMargin = bRevenue > 0 ? (b.profit_t12m ?? 0) / bRevenue : 0;
          return bMargin - aMargin;
        });
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {isLoading ? 'Loading…' : `${sortedListings.length} ${sortedListings.length === 1 ? 'result' : 'results'}`}
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
                <Button shape="pill" variant="outline" size="sm">Save search</Button>
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
                    <Button shape="pill" variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                    <RoleAwareButton onClick={handleSaveCurrentSearch}>Save</RoleAwareButton>
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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-60 rounded-xl border border-border/60 bg-muted/50 animate-pulse" />
            ))
          ) : error ? (
            <div className="col-span-3 flex flex-col items-center justify-center gap-4 py-16 text-center">
              <p className="text-muted-foreground">We couldn&apos;t load listings right now.</p>
              <RoleAwareButton onClick={() => refetch()}>Try again</RoleAwareButton>
            </div>
          ) : sortedListings.length > 0 ? (
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
                <Button shape="pill" variant="outline" onClick={() => {
                  setSearchTerm('');
                  setPriceRange([0, 2000000]);
                  setRevenueRange([0, 1000000]);
                  setProfitMarginRange([0, 100]);
                  setSelectedVertical('all');
                  setSelectedLocation('all');
                  setSelectedStatus('all');
                  setSortBy('newest');
                }}>Reset filters</Button>
                <Button shape="pill" variant="secondary" onClick={() => setSaveDialogOpen(true)}>Save this search</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
