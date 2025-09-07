"use client";

import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  BarChart as BarChartIcon, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Globe, 
  Building2, 
  TrendingUp as Growth,
  PieChart as PieChartIcon,
  FileText,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { exampleListings } from '@/lib/example-listings';
import type { Listing } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { ProfitRevenueChart } from '@/components/charts/ProfitRevenueChart';
import { TrafficChart } from '@/components/charts/TrafficChart';
import { TrafficSourcesChart } from '@/components/charts/TrafficSourcesChart';

interface PageProps {
  params: { id: string };
}

export default function ListingDetailsPage({ params }: PageProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.resolve(params).then(resolvedParams => {
      const listingData = exampleListings.find(l => l.id === resolvedParams.id);
      if (!listingData) {
        notFound();
      }
      setListing(listingData);
    });
  }, [params]);

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}m`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate profit margin with zero check
  const profitMargin = listing.revenue_t12m > 0 
    ? Math.round((listing.profit_t12m / listing.revenue_t12m) * 100)
    : 0;
    
  // Calculate multiple with zero check
  const multiple = listing.profit_t12m > 0 
    ? (listing.asking_price / listing.profit_t12m).toFixed(1)
    : "N/A";  
  // Chart data
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
      profit: listing.revenue_t12m * (profitMargin/100)
    },
    { 
      year: '2024', 
      revenue: listing.revenue_t12m * 1.2,
      profit: (listing.revenue_t12m * 1.2 * profitMargin/100) * 1.05
    }
  ];

  const trafficData = [
    { month: 'Jan', visitors: 12500 },
    { month: 'Feb', visitors: 13800 },
    { month: 'Mar', visitors: 14500 },
    { month: 'Apr', visitors: 16200 },
    { month: 'May', visitors: 17800 },
    { month: 'Jun', visitors: 19500 }
  ];

  const trafficSources = [
    { name: 'Organic', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Social', value: 15 },
    { name: 'Referral', value: 10 },
    { name: 'Email', value: 5 }
  ];
  
  return (
    <div className="w-full min-w-0">
      <div className="w-full p-6 space-y-6 min-w-0 max-w-full">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/my-dashboard/browse-listings">
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
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatCurrency(listing.asking_price)}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <BarChartIcon className="h-3.5 w-3.5" />
                  {listing.revenue_t12m > 0 ? `${formatCurrency(listing.revenue_t12m)}/year` : 'Revenue not disclosed'}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {profitMargin}% Margin
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full min-h-[600px] flex flex-col"
              defaultValue="overview"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="flex-1 w-full">
                <div className="space-y-6 w-full">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Business Summary</h3>
                        <p className="text-muted-foreground">
                          {listing.teaser} This business has shown consistent growth over the past 3 years with a strong recurring revenue model and high customer retention rates.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Key Highlights</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">Team</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {listing.teamSize} full-time employees
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">Established</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(listing.established).getFullYear()}
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium">Hours/Week</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {listing.hoursPerWeek} hours to manage
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4 text-primary" />
                              <span className="font-medium">Market</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {listing.market}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Growth Metrics</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Monthly Recurring Revenue</span>
                              <span className="font-medium text-green-600">+12% MoM</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Customer Growth</span>
                              <span className="font-medium text-green-600">+8% MoM</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Profit Margin</span>
                              <span className="font-medium">{profitMargin}%</span>
                            </div>
                            <Progress value={profitMargin} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
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
