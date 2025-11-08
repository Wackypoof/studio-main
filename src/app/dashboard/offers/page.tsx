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
  FileText,
  Clock,
  Check,
  X,
  MoreVertical,
  DollarSign,
  AlertCircle,
  Filter,
  Eye,
  RefreshCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/page-header';
import { useOffers, type OfferSummary, type OfferStatus } from '@/hooks/useOffers';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type OfferFilterTab = 'all' | OfferStatus;

const statusConfig: Record<OfferStatus, { label: string; icon: JSX.Element; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
  pending: { label: 'Pending', icon: <Clock className="h-3 w-3" />, variant: 'outline' },
  accepted: { label: 'Accepted', icon: <Check className="h-3 w-3" />, variant: 'default' },
  rejected: { label: 'Rejected', icon: <X className="h-3 w-3" />, variant: 'destructive' },
  expired: { label: 'Expired', icon: <AlertCircle className="h-3 w-3" />, variant: 'secondary' },
  withdrawn: { label: 'Withdrawn', icon: <X className="h-3 w-3" />, variant: 'secondary' },
};

const formatCurrency = (amount: number | null | undefined) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const getListingName = (offer: OfferSummary) =>
  offer.listing?.headline || offer.listing?.teaser || 'Listing';

export default function OffersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OfferFilterTab>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useOffers({ scope: 'buyer' });
  const offers = useMemo(() => data?.offers ?? [], [data?.offers]);

  const filteredOffers = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesStatus =
        activeTab === 'all' ? true : offer.status === activeTab;

      if (!matchesStatus) return false;

      if (!searchLower) return true;

      const haystack = [
        getListingName(offer),
        offer.seller?.full_name ?? '',
        offer.buyer?.full_name ?? '',
        offer.listing?.vertical ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchLower);
    });
  }, [offers, activeTab, searchTerm]);

  const hasOffers = filteredOffers.length > 0;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="My Offers"
        description="Track and manage your business purchase offers"
      />

      <Card>
        <CardHeader className="border-b space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                className="pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <Button shape="pill"
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
            <div className="flex items-center gap-2">
              <Button shape="pill" variant="outline" size="sm" disabled>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button shape="pill"
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as OfferFilterTab)}
          >
            <TabsList>
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
              <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((__, idx) => (
                      <Skeleton key={idx} className="h-4 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load offers</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred.'}
              </AlertDescription>
            </Alert>
          ) : !hasOffers ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-1">No offers found</CardTitle>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'all'
                  ? "You haven't made any offers yet."
                  : `You don't have any ${activeTab} offers.`}
              </p>
              <RoleAwareButton
                type="button"
                onClick={() => router.push('/dashboard/browse-listings')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Make an Offer
              </RoleAwareButton>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Your Offer</TableHead>
                  <TableHead>List Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{getListingName(offer)}</div>
                      {offer.message && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {offer.message}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{offer.seller?.full_name ?? '—'}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(offer.offerAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(offer.listingPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusConfig[offer.status].variant}
                        className="gap-1 text-xs"
                      >
                        {statusConfig[offer.status].icon}
                        {statusConfig[offer.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button shape="pill" variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() =>
                              router.push(`/dashboard/listings/${offer.listingId}?from=offers`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {offer.status === 'pending' && (
                            <>
                              <DropdownMenuItem disabled>
                                <DollarSign className="mr-2 h-4 w-4" />
                                <span>Modify Offer</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" disabled>
                                <X className="mr-2 h-4 w-4" />
                                <span>Withdraw Offer</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
