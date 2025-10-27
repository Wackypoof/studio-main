'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  MoreVertical,
  Pencil,
  BarChart2,
  Trash2,
  Tag,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ListingStatus } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { ListingCard } from '@/components/listing-card';
import { Progress } from '@/components/ui/progress';
import { useListings } from '@/hooks/useListings';

export default function ListingsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const {
    listings,
    isLoading,
    error,
    refetch,
    count: totalCount,
  } = useListings({ scope: 'mine' });

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return listings
      .filter((listing) => {
        if (!normalizedSearch) return true;
        return (
          listing.headline.toLowerCase().includes(normalizedSearch) ||
          listing.vertical.toLowerCase().includes(normalizedSearch) ||
          listing.location_area.toLowerCase().includes(normalizedSearch)
        );
      })
      .filter((listing) => {
        if (activeTab === 'all') return true;
        return listing.status === activeTab;
      });
  }, [listings, searchTerm, activeTab]);

  const hasListings = filteredListings.length > 0;

  const renderStatusBadge = (status: ListingStatus) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'outline' as const, icon: <FileText className="h-3 w-3" /> },
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> },
      live: { label: 'Live', variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" /> },
      paused: { label: 'Paused', variant: 'outline' as const, icon: <AlertCircle className="h-3 w-3" /> },
      under_offer: { label: 'Under Offer', variant: 'secondary' as const, icon: <Tag className="h-3 w-3" /> },
      closed: { label: 'Closed', variant: 'outline' as const, icon: <X className="h-3 w-3" /> },
    }[status] ?? {
      label: status,
      variant: 'outline' as const,
      icon: <FileText className="h-3 w-3" />,
    };

    return (
      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  const handleEditListing = (id: string) => {
    router.push(`/dashboard/listings/${id}/edit`);
  };

  const handleViewAnalytics = (id: string) => {
    router.push(`/dashboard/analytics?listing=${id}`);
  };

  const handleViewLeads = (id: string) => {
    router.push(`/dashboard/leads?listing=${id}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Onboarding checklist */}
      <OnboardingChecklist />
      <PageHeader
        title="My Listings"
        description="Manage your business listings and track their performance"
      >
        <Button onClick={() => router.push('/dashboard/listings/new')}>
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
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 w-full animate-pulse rounded-lg border border-dashed border-muted"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-sm text-muted-foreground">
                  {error.message || 'Unable to load listings right now.'}
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </div>
          ) : !hasListings ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No listings found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? 'No listings match your search criteria.'
                  : "You haven't created any listings yet."}
              </p>
              <Button onClick={() => router.push('/dashboard/listings/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Listing
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <div className="pointer-events-none absolute left-3 top-3 z-10">
                    {renderStatusBadge(listing.status)}
                  </div>
                  <ListingCard listing={listing} from="my-listings" />
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                        >
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
        
        {!isLoading && !error && hasListings && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredListings.length}</span> of{' '}
              <span className="font-medium">{totalCount || listings.length}</span> listings
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

function OnboardingChecklist() {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('onboarding_hidden') === '1';
    } catch {
      return false;
    }
  });
  const [hasDraft, setHasDraft] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return Boolean(localStorage.getItem('listingNewDraft'));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncState = () => {
      try {
        const shouldHide = localStorage.getItem('onboarding_hidden') === '1';
        const draftExists = Boolean(localStorage.getItem('listingNewDraft'));
        setHidden(shouldHide);
        setHasDraft(draftExists);
      } catch {}
    };

    const frameId = requestAnimationFrame(syncState);
    window.addEventListener('storage', syncState);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  const steps = [
    { key: 'profile', label: 'Complete profile', done: true, href: '/dashboard/settings' },
    { key: 'verify', label: 'Verify identity', done: false, href: '/dashboard/verification' },
    { key: 'payout', label: 'Set up payouts', done: false, href: '/dashboard/settings' },
    { key: 'listing', label: 'Create first listing', done: hasDraft, href: '/dashboard/listings/new' },
  ];

  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const progress = Math.round((completed / total) * 100);

  if (hidden) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Get set up to sell</CardTitle>
            <CardDescription>Complete these steps to build trust and start receiving leads</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { try { localStorage.setItem('onboarding_hidden', '1'); } catch {}; setHidden(true); }}>Dismiss</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="w-full" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">{progress}%</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {steps.map(step => (
            <div key={step.key} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-2">
                {step.done ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                <span className={step.done ? 'line-through text-muted-foreground' : ''}>{step.label}</span>
              </div>
              <Button asChild size="sm" variant={step.done ? 'outline' : 'default'}>
                <Link href={step.href}>{step.done ? 'View' : 'Start'}</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/listings/new">{hasDraft ? 'Resume draft' : 'Create listing'}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/verification">Verify identity</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
