'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Heart, Filter, FileText, Clock, X, MoreVertical, Share2, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/listing-card';
import { mockData } from '@/lib/data';
import { PageHeader } from '@/components/page-header';

export default function SavedListingsPage() {
  // In a real app, this would come from the API based on the authenticated user's saved listings
  const savedListings = mockData.listings.slice(0, 3); // Just for demo
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Saved Listings"
        description="Your saved business listings"
      />
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search saved listings..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-6">
          {savedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No saved listings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save listings you're interested in to view them here later.
              </p>
              <Button onClick={() => {}}>
                <Search className="mr-2 h-4 w-4" />
                Browse Listings
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
