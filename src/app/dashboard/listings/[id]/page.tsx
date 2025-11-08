'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { KeyHighlights, AcquisitionDetails } from '@/components/listing/KeyHighlights';
import { ArrowLeft, MapPin, MessageSquare, Share2, TrendingUp, TrendingDown, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useListing, useListingMetrics } from '@/hooks/useListing';
// Lazy-load heavy chart components client-side only
const RevenueChart = dynamic(
  () => import('@/components/charts/RevenueChart').then((m) => m.RevenueChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-muted/50 rounded" /> }
);
const ProfitRevenueChart = dynamic(
  () => import('@/components/charts/ProfitRevenueChart').then((m) => m.ProfitRevenueChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-muted/50 rounded" /> }
);
const TrafficChart = dynamic(
  () => import('@/components/charts/TrafficChart').then((m) => m.TrafficChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-muted/50 rounded" /> }
);
const TrafficSourcesChart = dynamic(
  () => import('@/components/charts/TrafficSourcesChart').then((m) => m.TrafficSourcesChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-muted/50 rounded" /> }
);
import { PriceDisplay } from "./price-display";

// We need to use a client component wrapper to handle the params properly
const STATUS_STYLES: Record<
  string,
  { label: string; className?: string }
> = {
  draft: { label: 'Draft' },
  pending: { label: 'Pending Review', className: 'border-yellow-500 text-yellow-700' },
  live: { label: 'Live', className: 'border-green-500 text-green-700' },
  paused: { label: 'Paused' },
  under_offer: { label: 'Under Offer', className: 'border-blue-500 text-blue-700' },
  closed: { label: 'Closed' },
};

function ListingDetailsContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const [activeTab, setActiveTab] = useState('overview');
  const { listing, isLoading, error, refetch } = useListing(id);
  const metrics = useListingMetrics(listing);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"
          aria-label="Loading listing"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div>
          <h2 className="text-lg font-semibold">Unable to load listing</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || 'Please try again.'}
          </p>
        </div>
        <Button shape="pill" onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!listing) {
    notFound();
    return null;
  }

  const formatSessionDuration = (minutes?: number | null) => {
    if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) {
      return '—';
    }
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const toNumeric = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const statusInfo = STATUS_STYLES[listing.status] ?? {
    label: listing.status,
  };
  const location = listing.location_area || 'Location not specified';
  const latestFinancial = metrics.latestFinancial;
  const latestRevenue =
    (typeof latestFinancial?.revenue === 'number'
      ? latestFinancial.revenue
      : null) ?? listing.revenue_t12m ?? 0;
  const latestProfit =
    (typeof latestFinancial?.profit === 'number'
      ? latestFinancial.profit
      : null) ?? listing.profit_t12m ?? 0;
  const revenueMultiple =
    latestRevenue > 0 && listing.asking_price > 0
      ? (listing.asking_price / latestRevenue).toFixed(1)
      : 'N/A';
  const paybackPeriod =
    latestProfit > 0 && listing.asking_price > 0
      ? (listing.asking_price / latestProfit).toFixed(1)
      : 'N/A';
  const monthlyProfit = latestProfit > 0 ? latestProfit / 12 : 0;
  const profitMarginLabel =
    latestRevenue > 0 ? `${metrics.profitMargin}% Margin` : 'Margin unavailable';
  const yearOverYearGrowth = metrics.yearOverYearGrowth;
  const yoyGrowthLabel =
    yearOverYearGrowth != null
      ? `${yearOverYearGrowth >= 0 ? '+' : ''}${yearOverYearGrowth}% YoY`
      : null;
  const yoyGrowthClass =
    yearOverYearGrowth != null
      ? yearOverYearGrowth >= 0
        ? 'text-green-600'
        : 'text-red-600'
      : 'text-muted-foreground';
  const businessSummary =
    (typeof listing.meta?.business_summary === 'string' &&
    listing.meta.business_summary.trim()
      ? listing.meta.business_summary
      : typeof listing.meta?.businessSummary === 'string' &&
        listing.meta.businessSummary.trim()
      ? listing.meta.businessSummary
      : listing.teaser) || 'Seller has not provided a summary yet.';

  const trafficHistory = listing.traffic?.history ?? [];
  const trafficChartData = trafficHistory
    .map((point, index) => ({
      month: point.period || `Period ${index + 1}`,
      visitors:
        typeof point.visitors === 'number'
          ? point.visitors
          : Number(point.visitors) || 0,
    }))
    .filter((point) => Number.isFinite(point.visitors));
  const hasTrafficHistory = trafficChartData.length > 0;

  const trafficSourcesData = (listing.traffic?.sources ?? [])
    .map((source) => {
      const sourceRecord = source as Record<string, unknown>;
      const resolvedName =
        source.source ||
        (typeof sourceRecord.name === 'string' ? sourceRecord.name : undefined) ||
        'Other';
      const resolvedValue =
        typeof source.value === 'number'
          ? source.value
          : toNumeric(sourceRecord.value) ?? 0;
      return {
        name: resolvedName,
        value: resolvedValue,
      };
    })
    .filter((source) => Number.isFinite(source.value) && source.value >= 0);
  const hasTrafficSources = trafficSourcesData.length > 0;

  const trafficSummary = listing.traffic?.summary ?? {};
  const totalVisitorsValue = toNumeric(
    (trafficSummary as { totalVisitors?: unknown }).totalVisitors
  );
  const pagesPerVisitValue = toNumeric(
    (trafficSummary as { pagesPerVisit?: unknown }).pagesPerVisit
  );
  const avgSessionDurationValue = toNumeric(
    (trafficSummary as { avgSessionDurationMinutes?: unknown })
      .avgSessionDurationMinutes
  );
  const totalVisitorsLabel =
    totalVisitorsValue != null
      ? numberFormatter.format(totalVisitorsValue)
      : '—';
  const pagesPerVisitLabel =
    pagesPerVisitValue != null ? pagesPerVisitValue.toFixed(1) : '—';
  const avgSessionDurationLabel = formatSessionDuration(avgSessionDurationValue);

  const documents = listing.documents ?? [];
  const hasDocuments = documents.length > 0;
  const formatDocumentType = (docType?: string | null) => {
    if (!docType) return 'Document';
    const map: Record<string, string> = {
      financial_statement: 'Financial Statement',
      legal_doc: 'Legal Document',
      tax_return: 'Tax Return',
      photo: 'Photo',
      other: 'Other',
    };
    const normalized = docType.toLowerCase();
    if (map[normalized]) return map[normalized];
    return normalized
      .split(/[_\s]/g)
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
      .join(' ');
  };
  const formatDocumentStatus = (status?: string | null) => {
    if (!status) return 'Unknown';
    return status
      .split(/[_\s]/g)
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
      .join(' ');
  };
  const formatFileSize = (size?: number | null) => {
    if (size == null || !Number.isFinite(size) || size <= 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = size;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    const decimals = value >= 10 || unit === 0 ? 0 : 1;
    return `${value.toFixed(decimals)} ${units[unit]}`;
  };
  
  return (
    <div className="w-full py-6 md:py-8">
      <div className="w-full space-y-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-4">
            <Button shape="pill" variant="outline" size="icon" asChild>
              <Link href={from === 'dashboard' ? '/dashboard' : from === 'my-listings' ? '/dashboard/listings' : '/dashboard/browse-listings'} prefetch={false}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Business Details</h1>
          </div>
          <div className="flex gap-2">
            <Button shape="pill" variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button shape="pill" variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{listing.headline}</h2>
                  <Badge
                    variant="outline"
                    className={`gap-1 text-xs ${statusInfo.className ?? ''}`}
                  >
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>
              <PriceDisplay price={listing.asking_price} />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="w-full min-h-[600px] flex flex-col"
              defaultValue="overview"
            >
              <TabsList className="!grid !gap-0 w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="w-full !mx-0 !my-0">Overview</TabsTrigger>
                <TabsTrigger value="financials" className="w-full !mx-0 !my-0">Financials</TabsTrigger>
                <TabsTrigger value="traffic" className="w-full !mx-0 !my-0">Traffic</TabsTrigger>
                <TabsTrigger value="documents" className="w-full !mx-0 !my-0">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="flex-1 w-full">
                <div className="space-y-6 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6 min-w-0">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Business Summary</h3>
                        <p className="text-muted-foreground">
                          {businessSummary}
                        </p>
                      </div>
                      
                      <KeyHighlights listing={listing} />
                      
                      <AcquisitionDetails listing={listing} />
                    </div>
                    
                    <div className="space-y-6 lg:col-span-4 min-w-0">
                      <Card>
                        <CardHeader className="pb-3">
                          <h3 className="font-semibold">Financial Highlights</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Revenue</p>
                            <p className="text-lg font-semibold">{formatCurrency(latestRevenue)}</p>
                            {yoyGrowthLabel ? (
                              <p className={`text-xs flex items-center ${yoyGrowthClass}`}>
                                {yearOverYearGrowth != null && yearOverYearGrowth < 0 ? (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                )}
                                {yoyGrowthLabel}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">YoY data unavailable</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Profit</p>
                            <p className="text-lg font-semibold">{formatCurrency(latestProfit)}</p>
                            <p className="text-xs text-green-600">{profitMarginLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Profit</p>
                            <p className="text-lg font-semibold">{formatCurrency(monthlyProfit)}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-3">
                          <h3 className="font-semibold">Valuation Metrics</h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Revenue Multiple</span>
                            <span className="font-medium">
                              {revenueMultiple === 'N/A' ? 'N/A' : `${revenueMultiple}x`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Profit Multiple</span>
                            <span className="font-medium">
                              {metrics.multiple === 'N/A' ? 'N/A' : `${metrics.multiple}x`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payback Period</span>
                            <span className="font-medium">
                              {paybackPeriod === 'N/A' ? 'N/A' : `${paybackPeriod} years`}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="financials" className="flex-1 w-full">
                <div className="space-y-6 w-full">
                  <h3 className="font-semibold">Financial Performance</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Annual Revenue</h4>
                      </CardHeader>
                      <CardContent>
                        <RevenueChart data={metrics.revenueData} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Profit & Revenue</h4>
                      </CardHeader>
                      <CardContent>
                        <ProfitRevenueChart data={metrics.profitRevenueData} />
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Financial Projections</h4>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Year</th>
                                <th className="text-right py-2">Revenue</th>
                                <th className="text-right py-2">Profit</th>
                                <th className="text-right py-2">Margin</th>
                                <th className="text-right py-2">Growth</th>
                              </tr>
                            </thead>
                            <tbody>
                              {metrics.profitRevenueData.map((row, index) => {
                                const previousRow =
                                  index > 0 ? metrics.profitRevenueData[index - 1] : null;
                                const growthValue =
                                  previousRow && previousRow.revenue > 0
                                    ? Math.round(
                                        ((row.revenue - previousRow.revenue) /
                                          previousRow.revenue) *
                                          100
                                      )
                                    : null;
                                const marginPct =
                                  row.revenue > 0
                                    ? Math.round((row.profit / row.revenue) * 100)
                                    : null;
                                return (
                                <tr key={row.year} className="border-b hover:bg-muted/50">
                                  <td className="py-2">{row.year}</td>
                                  <td className="text-right">{formatCurrency(row.revenue)}</td>
                                  <td className="text-right">{formatCurrency(row.profit)}</td>
                                  <td className="text-right">
                                    {marginPct != null ? `${marginPct}%` : 'N/A'}
                                  </td>
                                  <td className="text-right">
                                    {growthValue != null ? `${growthValue}%` : 'N/A'}
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="traffic" className="flex-1 w-full">
                <div className="space-y-6 w-full">
                  <h3 className="font-semibold">Traffic & Engagement</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Monthly Visitors (Last 6 Months)</h4>
                      </CardHeader>
                      <CardContent>
                        {hasTrafficHistory ? (
                          <TrafficChart data={trafficChartData} />
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            Traffic history has not been provided yet.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Traffic Sources</h4>
                      </CardHeader>
                      <CardContent>
                        {hasTrafficSources ? (
                          <TrafficSourcesChart data={trafficSourcesData} />
                        ) : (
                          <div className="py-8 text-center text-sm text-muted-foreground">
                            Traffic source breakdown unavailable.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Engagement Metrics</h4>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{totalVisitorsLabel}</p>
                            <p className="text-sm text-muted-foreground">Total Visitors</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{pagesPerVisitLabel}</p>
                            <p className="text-sm text-muted-foreground">Avg. Pages/Visit</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{avgSessionDurationLabel}</p>
                            <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="flex-1 w-full">
                <div className="space-y-6 w-full">
                  <h3 className="font-semibold">Business Documents</h3>
                  {hasDocuments ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {documents.map((doc) => {
                        const fileSizeLabel = formatFileSize(doc.fileSize);
                        const metaParts = [formatDocumentType(doc.docType)];
                        if (fileSizeLabel) {
                          metaParts.push(fileSizeLabel);
                        }
                        return (
                          <div
                            key={doc.id}
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-muted p-2 rounded">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <p className="font-medium truncate">
                                  {doc.fileName || formatDocumentType(doc.docType)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {metaParts.join(' • ')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Updated {formatDate(doc.updatedAt)}
                                </p>
                              </div>
                              <Badge
                                variant={doc.status === 'verified' ? 'default' : 'outline'}
                                className="uppercase"
                              >
                                {formatDocumentStatus(doc.status)}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
                      No documents have been shared for this listing yet.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col md:flex-row justify-between gap-4 border-t p-4 bg-muted/30">
            <div className="text-sm text-muted-foreground">
              <p>Last updated: {formatDate(listing.updatedAt)}</p>
              <p>Listing ID: {listing.id}</p>
            </div>
            <div className="flex gap-2">
              <Button shape="pill" variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
              <RoleAwareButton size="sm">
                Make an Offer
              </RoleAwareButton>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Define the type for the params
interface PageParams {
  id: string;
}

export default function ListingDetailsPage({ params }: { params: Promise<PageParams> }) {
  // Use React.use() to unwrap the params Promise
  const resolvedParams = React.use(params);
  return <ListingDetailsContent id={resolvedParams.id} />;
}
