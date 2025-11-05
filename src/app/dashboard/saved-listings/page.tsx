'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Heart,
  Filter,
  X,
  RefreshCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/listing-card';
import { PageHeader } from '@/components/page-header';
import { useListings } from '@/hooks/useListings';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Listing } from '@/lib/types';

type SavedListingFilter = 'all' | 'recent';
type SavedListing = Listing & { savedAt?: string | null };

export default function SavedListingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SavedListingFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    listings,
    isLoading,
    error,
    refetch,
  } = useListings({ scope: 'saved' });

  const savedListings = listings as SavedListing[];

  const filteredListings = useMemo(() => {
    return savedListings.filter((listing) => {
      const matchesSearch =
        !searchTerm ||
        listing.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.teaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.vertical.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeTab === 'recent') {
        const savedAt = listing.savedAt ? new Date(listing.savedAt) : null;
        if (!savedAt) return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return savedAt >= thirtyDaysAgo && matchesSearch;
      }

      return matchesSearch;
    });
  }, [savedListings, activeTab, searchTerm]);

  const showEmptyState = !isLoading && !error && filteredListings.length === 0;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Saved Listings"
        description="Your saved business listings"
      />

      <Card>
        <CardHeader className="border-b space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search saved listings..."
                className="pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button variant="outline" size="sm" disabled>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as SavedListingFilter)}
            >
              <TabsList>
                <TabsTrigger value="all">All Saved</TabsTrigger>
                <TabsTrigger value="recent">Saved in last 30 days</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Badge variant="secondary">
                {filteredListings.length} saved
              </Badge>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="border-border/50">
                  <CardHeader className="space-y-3 pb-0">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load saved listings</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred.'}
              </AlertDescription>
            </Alert>
          ) : showEmptyState ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg">No saved listings</CardTitle>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Save listings you&apos;re interested in to view them here later.
              </p>
              <RoleAwareButton
                type="button"
                onClick={() => router.push('/dashboard/browse-listings')}
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Listings
              </RoleAwareButton>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <ListingCard listing={listing} />
                  {listing.savedAt && (
                    <Badge className="absolute right-4 top-4 shadow-sm">
                      Saved{' '}
                      {new Intl.DateTimeFormat(undefined, {
                        month: 'short',
                        day: 'numeric',
                      }).format(new Date(listing.savedAt))}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
