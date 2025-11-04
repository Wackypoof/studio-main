'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Search, FileText, Clock, CheckCircle2, AlertTriangle, MoreVertical, Download, Eye, FileSignature, Filter, RefreshCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { NdaFormClient } from '@/components/nda/nda-form-client';
import { getExpiringSoonCount, getNdaStatusCounts, getUpcomingExpirations } from '@/lib/nda/helpers';
import { useNdaAgreements } from '@/hooks/useNdaAgreements';
import type { NdaAgreementSummary, NdaStatus } from '@/types/nda';

type TabValue = 'all' | NdaStatus;

const statusCopy: Record<NdaStatus, { label: string; badgeVariant: 'default' | 'outline' | 'secondary' | 'destructive'; icon: ReactNode }> = {
  signed: {
    label: 'Signed',
    badgeVariant: 'default',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  pending: {
    label: 'Pending',
    badgeVariant: 'outline',
    icon: <Clock className="h-3 w-3" />,
  },
  expired: {
    label: 'Expired',
    badgeVariant: 'secondary',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  declined: {
    label: 'Declined',
    badgeVariant: 'destructive',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatRelative = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NDAsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TabValue>('all');
  const [selectedAgreement, setSelectedAgreement] = useState<NdaAgreementSummary | null>(null);
  const [renewalTarget, setRenewalTarget] = useState<string | null>(null);

  const {
    agreements,
    isLoading,
    isError,
    error,
    requestRenewal,
    isRenewalLoading,
  } = useNdaAgreements();

  const statusCounts = useMemo(() => getNdaStatusCounts(agreements), [agreements]);
  const expiringSoon = useMemo(() => getExpiringSoonCount(agreements, 30), [agreements]);
  const renewalRequests = useMemo(
    () => agreements.filter((nda) => nda.renewalRequested).length,
    [agreements]
  );

  const filteredAgreements = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return agreements
      .filter((nda) => statusFilter === 'all' || nda.status === statusFilter)
      .filter((nda) => {
        if (!query) return true;
        return (
          nda.listingName.toLowerCase().includes(query) ||
          nda.sellerName.toLowerCase().includes(query) ||
          nda.buyerName.toLowerCase().includes(query) ||
          nda.listingId.toLowerCase().includes(query) ||
          nda.id.toLowerCase().includes(query)
        );
      });
  }, [agreements, searchTerm, statusFilter]);

  const upcomingExpirations = useMemo(
    () => getUpcomingExpirations(agreements, 4),
    [agreements]
  );

  const stats = [
    { label: 'Total NDAs', value: statusCounts.total, icon: FileText },
    { label: 'Signed', value: statusCounts.signed, icon: CheckCircle2 },
    { label: 'Pending', value: statusCounts.pending, icon: Clock },
    { label: 'Expiring this month', value: expiringSoon, icon: AlertTriangle },
  ] as const;

  const handleDownload = (nda: NdaAgreementSummary) => {
    toast({
      title: 'Download started',
      description: `Preparing ${nda.listingName} NDA for download.`,
    });
  };

  const handleRenewalRequest = async (nda: NdaAgreementSummary) => {
    try {
      setRenewalTarget(nda.id);
      await requestRenewal(nda.id);
      toast({
        title: 'Renewal request sent',
        description: `We let ${nda.sellerName} know you would like to renew access.`,
      });
    } catch (err) {
      toast({
        title: 'Unable to request renewal',
        description: err instanceof Error ? err.message : 'Please try again shortly.',
        variant: 'destructive',
      });
    } finally {
      setRenewalTarget(null);
    }
  };

  const renderStatusBadge = (status: NdaStatus) => {
    const meta = statusCopy[status];
    return (
      <Badge variant={meta.badgeVariant} className="gap-1 text-xs font-medium">
        {meta.icon}
        {meta.label}
      </Badge>
    );
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <PageHeader
        title="NDA Management"
        description="Track agreements, monitor expirations, and renew confidential access."
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
                    placeholder="Search by listing, seller, or buyer..."
                    className="pl-10"
                  />
                </div>
                <Tabs
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as TabValue)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="flex w-full flex-wrap justify-start gap-2 sm:flex-nowrap">
                    <TabsTrigger value="all" className="px-4">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="signed" className="px-4">
                      Signed
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="px-4">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="expired" className="px-4">
                      Expired
                    </TabsTrigger>
                    <TabsTrigger value="declined" className="px-4">
                      Declined
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Saved filters
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <RoleAwareButton size="sm">
                      <FileSignature className="mr-2 h-4 w-4" />
                      New NDA
                    </RoleAwareButton>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Sign a new NDA</DialogTitle>
                      <DialogDescription>
                        Complete the NDA workflow to unlock full listing details from sellers.
                      </DialogDescription>
                    </DialogHeader>
                    <NdaFormClient />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[860px] text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="min-w-[220px]">Listing</TableHead>
                    <TableHead className="min-w-[140px]">Seller</TableHead>
                    <TableHead className="min-w-[140px]">Buyer</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Signed</TableHead>
                    <TableHead className="min-w-[120px]">Expires</TableHead>
                    <TableHead className="min-w-[120px] text-right">Security</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading agreements…</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
                          <AlertTriangle className="h-10 w-10" />
                          <div>
                            <p className="font-medium text-foreground">Failed to load NDAs</p>
                            <p className="text-sm">{error?.message ?? 'Please try again shortly.'}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAgreements.length > 0 ? (
                    filteredAgreements.map((nda) => (
                      <TableRow key={nda.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{nda.listingName}</span>
                            <span className="text-xs text-muted-foreground">#{nda.id}</span>
                          </div>
                        </TableCell>
                        <TableCell>{nda.sellerName}</TableCell>
                        <TableCell>{nda.buyerName}</TableCell>
                        <TableCell>{renderStatusBadge(nda.status)}</TableCell>
                        <TableCell>{formatDate(nda.signedDate)}</TableCell>
                        <TableCell>{formatDate(nda.expiresDate)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <ShieldCheck className="h-3 w-3" />
                            {nda.securityLevel === 'strict' ? 'Strict' : 'Standard'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => setSelectedAgreement(nda)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleDownload(nda)}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download PDF</span>
                              </DropdownMenuItem>
                              {nda.status === 'pending' && (
                                <DropdownMenuItem onSelect={() => toast({ title: 'Signature requested', description: `The seller has been notified to countersign ${nda.listingName}.` })}>
                                  <FileSignature className="mr-2 h-4 w-4" />
                                  <span>Request signature</span>
                                </DropdownMenuItem>
                              )}
                              {nda.status === 'signed' && (
                                <DropdownMenuItem
                                  disabled={isRenewalLoading && renewalTarget === nda.id}
                                  onSelect={() => {
                                    if (isRenewalLoading && renewalTarget && renewalTarget !== nda.id) return;
                                    void handleRenewalRequest(nda);
                                  }}
                                >
                                  <RefreshCcw className="mr-2 h-4 w-4" />
                                  <span>Request renewal</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8}>
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
              <CardDescription>Monitor the balance of your NDA portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(statusCopy) as NdaStatus[]).map((status) => {
                const count = statusCounts[status];
                const percentage = statusCounts.total ? Math.round((count / statusCounts.total) * 100) : 0;
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        {statusCopy[status].icon}
                        {statusCopy[status].label}
                      </span>
                      <span>{count}</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                {renewalRequests > 0 ? (
                  <span>{renewalRequests} agreement{renewalRequests > 1 ? 's' : ''} awaiting renewal confirmation.</span>
                ) : (
                  <span>All signed agreements are current. No renewal actions queued.</span>
                )}
              </div>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        disabled={isRenewalLoading && renewalTarget === nda.id}
                        onClick={() => void handleRenewalRequest(nda)}
                      >
                        {isRenewalLoading && renewalTarget === nda.id ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : null}
                        Request renewal
                      </Button>
                    </div>
                    {nda.renewalRequested && (
                      <p className="mt-2 text-xs text-amber-600">
                        Renewal already requested — awaiting seller response.
                      </p>
                    )}
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

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Last activity</CardTitle>
              <CardDescription>Keep tabs on the agreements that recently moved.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agreements.length > 0 ? (
                agreements
                  .slice()
                  .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                  .slice(0, 4)
                  .map((nda) => (
                    <div key={nda.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{nda.listingName}</span>
                        <span className="text-xs text-muted-foreground">
                          {statusCopy[nda.status].label} • {formatRelative(nda.lastUpdated)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setSelectedAgreement(nda)}
                      >
                        Review
                      </Button>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent NDA activity yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedAgreement} onOpenChange={(open) => !open && setSelectedAgreement(null)}>
        <DialogContent className="max-w-lg">
          {selectedAgreement && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAgreement.listingName}</DialogTitle>
                <DialogDescription>
                  Signed between {selectedAgreement.buyerName} and {selectedAgreement.sellerName}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Status</p>
                    <div className="mt-1">{renderStatusBadge(selectedAgreement.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Security tier</p>
                    <p className="mt-1 font-medium text-foreground">
                      {selectedAgreement.securityLevel === 'strict' ? 'Strict controls' : 'Standard'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Signed</p>
                    <p className="mt-1 font-medium text-foreground">{formatDate(selectedAgreement.signedDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Expires</p>
                    <p className="mt-1 font-medium text-foreground">{formatDate(selectedAgreement.expiresDate)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Participants</p>
                  <div className="rounded-md border border-border/60 p-3">
                    <p className="font-medium text-foreground">{selectedAgreement.buyerName}</p>
                    <p className="text-xs text-muted-foreground">{selectedAgreement.buyerCompany ?? 'Independent buyer'}</p>
                  </div>
                  <div className="rounded-md border border-border/60 p-3">
                    <p className="font-medium text-foreground">{selectedAgreement.sellerName}</p>
                    <p className="text-xs text-muted-foreground">Listing ID {selectedAgreement.listingId}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => handleDownload(selectedAgreement)} size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download copy
                  </Button>
                  {selectedAgreement.status === 'signed' && (
                    <RoleAwareButton onClick={() => handleRenewalRequest(selectedAgreement)} size="sm">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Request renewal
                    </RoleAwareButton>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  An audit trail of every action is retained for compliance. Contact support if you need a copy.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
