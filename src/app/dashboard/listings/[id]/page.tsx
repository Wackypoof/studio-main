'use client';

import React, { useState, useCallback } from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { exampleListings } from '@/lib/example-listings';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { KeyHighlights, AcquisitionDetails } from '@/components/listing/KeyHighlights';
import { ArrowLeft, MapPin, MessageSquare, Share2, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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

// Calculate metrics
function calculateMetrics(listing: any) {
  const profitMargin = listing.revenue_t12m > 0 
    ? Math.round((listing.profit_t12m / listing.revenue_t12m) * 100)
    : 0;

  const multiple = listing.profit_t12m > 0 
    ? (listing.asking_price / listing.profit_t12m).toFixed(1)
    : 'N/A';

  const revenueData = [
    { year: '2021', revenue: listing.revenue_t12m * 0.6 },
    { year: '2022', revenue: listing.revenue_t12m * 0.8 },
    { year: '2023', revenue: listing.revenue_t12m },
    { year: '2024', revenue: listing.revenue_t12m * 1.2 }
  ];

  const profitRevenueData = [
    { 
      year: '2021', 
      revenue: listing.revenue_t12m * 0.6,
      profit: (listing.revenue_t12m * 0.6 * profitMargin/100) * 0.9
    },
    { 
      year: '2022', 
      revenue: listing.revenue_t12m * 0.8,
      profit: (listing.revenue_t12m * 0.8 * profitMargin/100) * 0.95
    },
    { 
      year: '2023', 
      revenue: listing.revenue_t12m,
      profit: listing.profit_t12m
    },
    { 
      year: '2024', 
      revenue: listing.revenue_t12m * 1.2,
      profit: (listing.revenue_t12m * 1.2 * profitMargin/100) * 1.05
    }
  ];

  return { profitMargin, multiple, revenueData, profitRevenueData };
}

// We need to use a client component wrapper to handle the params properly
function ListingDetailsContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const [activeTab, setActiveTab] = useState('overview');
  const listingId = id.startsWith('listing-') 
    ? id 
    : `listing-${id}`;
  
  const listing = exampleListings.find(l => l.id === listingId);
  
  if (!listing) {
    notFound();
  }
  
  const { profitMargin, multiple, revenueData, profitRevenueData } = calculateMetrics(listing);
  const isLoading = false; // No loading state needed in server components

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Listing not found</p>
      </div>
    );
  }

  const trafficData = [
    { month: 'Jan', visitors: 12500 },
    { month: 'Feb', visitors: 13800 },
    { month: 'Mar', visitors: 14500 },
    { month: 'Apr', visitors: 16200 },
    { month: 'May', visitors: 17800 },
    { month: 'Jun', visitors: 19500 }
  ];
  
  // Memoize the tab change handler
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const trafficSources = [
    { name: 'Organic', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Social', value: 15 },
    { name: 'Referral', value: 10 },
    { name: 'Email', value: 5 }
  ];
  
  return (
    <div className="w-full py-6 md:py-8">
      <div className="w-full space-y-6 min-w-0">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={from === 'dashboard' ? '/dashboard' : from === 'my-listings' ? '/dashboard/listings' : '/dashboard/browse-listings'} prefetch={false}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Business Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
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
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    {listing.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location_area}</span>
                </div>
              </div>
              <PriceDisplay price={listing.asking_price} />            </div>
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
                          {listing.teaser} This business has shown consistent growth over the past 3 years with a strong recurring revenue model and high customer retention rates.
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
                            <p className="text-lg font-semibold">{formatCurrency(listing.revenue_t12m)}</p>
                            <p className="text-xs text-green-600 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              18% YoY Growth
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Profit</p>
                            <p className="text-lg font-semibold">{formatCurrency(listing.profit_t12m)}</p>
                            <p className="text-xs text-green-600">{profitMargin}% Margin</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Profit</p>
                            <p className="text-lg font-semibold">{formatCurrency(listing.profit_t12m / 12)}</p>
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
                            <span className="font-medium">{(listing.asking_price / listing.revenue_t12m).toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Profit Multiple</span>
                            <span className="font-medium">{multiple}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Payback Period</span>
                            <span className="font-medium">{(listing.asking_price / listing.profit_t12m).toFixed(1)} years</span>
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
                        <RevenueChart data={revenueData} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Profit & Revenue</h4>
                      </CardHeader>
                      <CardContent>
                        <ProfitRevenueChart data={profitRevenueData} />
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
                              {profitRevenueData.map((row, index) => (
                                <tr key={row.year} className="border-b hover:bg-muted/50">
                                  <td className="py-2">{row.year}</td>
                                  <td className="text-right">{formatCurrency(row.revenue)}</td>
                                  <td className="text-right">{formatCurrency(row.profit)}</td>
                                  <td className="text-right">{Math.round((row.profit / row.revenue) * 100)}%</td>
                                  <td className="text-right">
                                    {index > 0 ? 
                                      `${Math.round(((row.revenue - profitRevenueData[index-1].revenue) / profitRevenueData[index-1].revenue) * 100)}%` : 
                                      'N/A'}
                                  </td>
                                </tr>
                              ))}
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
                        <TrafficChart data={trafficData} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Traffic Sources</h4>
                      </CardHeader>
                      <CardContent>
                        <TrafficSourcesChart data={trafficSources} />
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <h4 className="font-medium">Engagement Metrics</h4>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">2.4m</p>
                            <p className="text-sm text-muted-foreground">Total Visitors</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">3.2</p>
                            <p className="text-sm text-muted-foreground">Avg. Pages/Visit</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">2:45</p>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'Financial Statements 2023', type: 'PDF', size: '2.4 MB' },
                      { name: 'Tax Returns 2023', type: 'PDF', size: '1.8 MB' },
                      { name: 'Traffic Analytics Report', type: 'PDF', size: '3.1 MB' },
                      { name: 'Customer Demographics', type: 'XLSX', size: '1.2 MB' },
                    ].map((doc, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="bg-muted p-2 rounded">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col md:flex-row justify-between gap-4 border-t p-4 bg-muted/30">
            <div className="text-sm text-muted-foreground">
              <p>Last updated: {formatDate(new Date().toISOString())}</p>
              <p>Listing ID: {listing.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
              <Button size="sm">
                Make an Offer
              </Button>
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
  const { id } = (React as any).use(params);
  return <ListingDetailsContent id={id} />;
}
