'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock, Check, AlertCircle, MoreVertical, Download, Eye, FileSignature, Filter, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/page-header';

type NDAStatus = 'signed' | 'pending' | 'expired' | 'declined';

interface NDA {
  id: string;
  listingId: string;
  listingName: string;
  sellerName: string;
  status: NDAStatus;
  signedDate?: string;
  expiresDate?: string;
}

// Mock data - in a real app, this would come from an API
const mockNDAs: NDA[] = [
  {
    id: 'nda-1',
    listingId: 'listing-1',
    listingName: 'Premium Skincare Dropshipping Store',
    sellerName: 'Jane Smith',
    status: 'signed',
    signedDate: '2023-10-15',
    expiresDate: '2024-10-15'
  },
  {
    id: 'nda-2',
    listingId: 'listing-2',
    listingName: 'Boutique Coffee Roastery',
    sellerName: 'John Doe',
    status: 'pending',
  },
  {
    id: 'nda-3',
    listingId: 'listing-3',
    listingName: 'AI-Powered Marketing SaaS',
    sellerName: 'Acme Inc.',
    status: 'expired',
    signedDate: '2022-05-10',
    expiresDate: '2023-05-10'
  },
];

const formatDate = (value?: string) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

type TabValue = 'all' | NDAStatus;

export default function NDAsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabValue>('all');

  const statusCounts = mockNDAs.reduce(
    (acc, nda) => {
      acc.total += 1;
      acc[nda.status] = (acc[nda.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, signed: 0, pending: 0, expired: 0, declined: 0 } as Record<'total' | NDAStatus, number>
  );

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    { label: 'Total NDAs', value: statusCounts.total, icon: FileText },
    { label: 'Signed', value: statusCounts.signed, icon: Check },
    { label: 'Pending', value: statusCounts.pending, icon: Clock },
    { label: 'Expired', value: statusCounts.expired, icon: AlertCircle },
  ];

  const filteredNDAs = mockNDAs
    .filter((nda) => statusFilter === 'all' || nda.status === statusFilter)
    .filter((nda) => {
      if (!searchTerm.trim()) return true;

      const query = searchTerm.toLowerCase();
      return (
        nda.listingName.toLowerCase().includes(query) ||
        nda.sellerName.toLowerCase().includes(query) ||
        nda.listingId.toLowerCase().includes(query)
      );
    });

  const upcomingExpirations = mockNDAs
    .filter((nda) => nda.expiresDate)
    .sort((a, b) => {
      const aTime = new Date(a.expiresDate ?? '').getTime();
      const bTime = new Date(b.expiresDate ?? '').getTime();
      return aTime - bTime;
    })
    .slice(0, 3);

  const getStatusBadge = (status: NDAStatus) => {
    const statusConfig = {
      signed: { label: 'Signed', variant: 'default' as const, icon: <Check className="h-3 w-3" /> },
      pending: { label: 'Pending', variant: 'outline' as const, icon: <Clock className="h-3 w-3" /> },
      expired: { label: 'Expired', variant: 'secondary' as const, icon: <AlertCircle className="h-3 w-3" /> },
      declined: { label: 'Declined', variant: 'destructive' as const, icon: <X className="h-3 w-3" /> },
    }[status];

    return (
      <Badge variant={statusConfig.variant} className="gap-1 text-xs">
        {statusConfig.icon}
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader 
        title="NDA Management"
        description="View and manage your non-disclosure agreements"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-border/60">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by listing, seller, or ID..."
                    className="pl-10"
                  />
                </div>
                <Tabs
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as TabValue)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="flex w-full flex-wrap justify-start gap-2 sm:flex-nowrap">
                    <TabsTrigger value="all" className="px-4">All</TabsTrigger>
                    <TabsTrigger value="signed" className="px-4">Signed</TabsTrigger>
                    <TabsTrigger value="pending" className="px-4">Pending</TabsTrigger>
                    <TabsTrigger value="expired" className="px-4">Expired</TabsTrigger>
                    <TabsTrigger value="declined" className="px-4">Declined</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button size="sm">
                  <FileSignature className="mr-2 h-4 w-4" />
                  New NDA
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[720px] text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="min-w-[220px]">Listing</TableHead>
                    <TableHead className="min-w-[160px]">Seller</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Signed</TableHead>
                    <TableHead className="min-w-[140px]">Expires</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNDAs.length > 0 ? (
                    filteredNDAs.map((nda) => (
                      <TableRow key={nda.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{nda.listingName}</TableCell>
                        <TableCell>{nda.sellerName}</TableCell>
                        <TableCell>{getStatusBadge(nda.status)}</TableCell>
                        <TableCell>{formatDate(nda.signedDate)}</TableCell>
                        <TableCell>{formatDate(nda.expiresDate)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              {nda.status === 'pending' && (
                                <DropdownMenuItem>
                                  <FileSignature className="mr-2 h-4 w-4" />
                                  <span>Sign NDA</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                          <FileText className="h-10 w-10" />
                          <div>
                            <p className="font-medium text-foreground">No NDAs found</p>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Agreement health</CardTitle>
              <CardDescription>Track where agreements need your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {stats.slice(1).map((stat) => (
                <div key={stat.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">Latest status count</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Upcoming expirations</CardTitle>
              <CardDescription>Renew or reissue before access lapses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingExpirations.length > 0 ? (
                upcomingExpirations.map((nda) => (
                  <div key={nda.id} className="rounded-lg border border-dashed border-border/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-foreground">{nda.listingName}</p>
                        <span className="text-xs text-muted-foreground">Seller: {nda.sellerName}</span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(nda.expiresDate)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Signed {formatDate(nda.signedDate)}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 px-3">
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center">
                  <p className="font-medium text-foreground">No expirations scheduled</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All of your active NDAs are in good standing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
