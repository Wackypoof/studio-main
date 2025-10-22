'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, Check, X, MoreVertical, DollarSign, AlertCircle, Filter, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/page-header';

type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

interface Offer {
  id: string;
  listingId: string;
  listingName: string;
  sellerName: string;
  status: OfferStatus;
  offerAmount: number;
  listingPrice: number;
  submittedDate: string;
  expiresDate?: string;
  notes?: string;
}

// Mock data - in a real app, this would come from an API
const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    listingId: 'listing-1',
    listingName: 'Premium Skincare Dropshipping Store',
    sellerName: 'Jane Smith',
    status: 'pending',
    offerAmount: 85000,
    listingPrice: 95000,
    submittedDate: '2023-10-20',
    expiresDate: '2023-11-20',
    notes: 'I would like to discuss the inventory valuation.'
  },
  {
    id: 'offer-2',
    listingId: 'listing-2',
    listingName: 'Boutique Coffee Roastery',
    sellerName: 'John Doe',
    status: 'accepted',
    offerAmount: 125000,
    listingPrice: 150000,
    submittedDate: '2023-10-15',
    notes: 'Looking forward to the transition!'
  },
  {
    id: 'offer-3',
    listingId: 'listing-3',
    listingName: 'AI-Powered Marketing SaaS',
    sellerName: 'Acme Inc.',
    status: 'rejected',
    offerAmount: 450000,
    listingPrice: 600000,
    submittedDate: '2023-09-30',
    notes: 'The offer was below our minimum threshold.'
  },
];

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const getStatusBadge = (status: OfferStatus) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'outline' as const, icon: <Clock className="h-3 w-3" /> },
      accepted: { label: 'Accepted', variant: 'default' as const, icon: <Check className="h-3 w-3" /> },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: <X className="h-3 w-3" /> },
      expired: { label: 'Expired', variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> },
      withdrawn: { label: 'Withdrawn', variant: 'secondary' as const, icon: <X className="h-3 w-3" /> },
    }[status];

    return (
      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredOffers = mockOffers.filter(offer => {
    if (activeTab === 'all') return true;
    return offer.status === activeTab;
  });

  return (
    <div className="w-full space-y-6">
      <PageHeader 
        title="My Offers"
        description="Track and manage your business purchase offers"
      />
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
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
          
          <Tabs 
            defaultValue="all" 
            className="mt-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-6">
          {filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No offers found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activeTab === 'all' 
                  ? "You haven't made any offers yet."
                  : `You don't have any ${activeTab} offers.`}
              </p>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Make an Offer
              </Button>
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{offer.listingName}</div>
                      <div className="text-sm text-muted-foreground">
                        {offer.notes && (
                          <span className="line-clamp-1">{offer.notes}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{offer.sellerName}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(offer.offerAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(offer.listingPrice)}
                    </TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(offer.submittedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          {offer.status === 'pending' && (
                            <>
                              <DropdownMenuItem>
                                <DollarSign className="mr-2 h-4 w-4" />
                                <span>Modify Offer</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
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
