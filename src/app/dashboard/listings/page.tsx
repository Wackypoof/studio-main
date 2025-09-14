'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Search, Filter, FileText, CheckCircle, Clock, AlertCircle, X, MoreVertical, 
  Pencil, Eye, BarChart2, Trash2, Share2, Copy, Tag, DollarSign, Calendar, MapPin, Users, BriefcaseBusiness
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { mockData } from '@/lib/data';
import { Listing, ListingStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { useRole } from '@/contexts/role-context';
import { ListingCard } from '@/components/listing-card';

export default function ListingsPage() {
  const router = useRouter();
  const { isBuyer } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // In a real app, this would come from the API based on the authenticated user
  const currentUser = useMemo(() => {
    return mockData.testUsers.seller1; // Default to seller1 for demo
  }, []);

  // Filter listings by current user and search term
  const filteredListings = useMemo(() => {
    return mockData.listings
      .filter(listing => listing.userId === currentUser.id)
      .filter(listing => 
        listing.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.vertical.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location_area.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(listing => {
        if (activeTab === 'all') return true;
        return listing.status === activeTab;
      });
  }, [currentUser.id, searchTerm, activeTab]);

  const getStatusBadge = (status: ListingStatus) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'outline' as const, icon: <FileText className="h-3 w-3" /> },
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> },
      live: { label: 'Live', variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" /> },
      paused: { label: 'Paused', variant: 'outline' as const, icon: <AlertCircle className="h-3 w-3" /> },
      under_offer: { label: 'Under Offer', variant: 'secondary' as const, icon: <Tag className="h-3 w-3" /> },
      closed: { label: 'Closed', variant: 'outline' as const, icon: <X className="h-3 w-3" /> },
    }[status];

    return (
      <Badge 
        variant={statusConfig.variant} 
        className="gap-1 text-xs"
      >
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  const handleEditListing = (id: string) => {
    router.push(`/my-dashboard/listings/${id}/edit`);
  };

  const handleViewAnalytics = (id: string) => {
    router.push(`/my-dashboard/analytics?listing=${id}`);
  };

  const handleViewLeads = (id: string) => {
    router.push(`/my-dashboard/leads?listing=${id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Listings"
        description="Manage your business listings and track their performance"
      >
        <Button onClick={() => router.push('/my-dashboard/listings/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Listing
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by: Newest
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Newest</DropdownMenuItem>
                  <DropdownMenuItem>Oldest</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs 
            defaultValue="all" 
            className="mt-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">All Listings</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="under_offer">Under Offer</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm 
                  ? 'No listings match your search criteria.' 
                  : 'You haven\'t created any listings yet.'}
              </p>
              <Button onClick={() => router.push('/my-dashboard/listings/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Listing
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <ListingCard listing={listing} />
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAnalytics(listing.id)}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          <span>View Analytics</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewLeads(listing.id)}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>View Leads</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        {filteredListings.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredListings.length}</span> of{' '}
              <span className="font-medium">{filteredListings.length}</span> listings
            </p>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
