"use client";

import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  BarChart, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Globe, 
  Building2, 
  TrendingUp as Growth,
  PieChart,
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

interface PageProps {
  params: { id: string };
}

export default function ListingDetailsPage({ params }: PageProps) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Ensure params is resolved before using it
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

  // Calculate additional metrics
  const profitMargin = Math.round((listing.profit_t12m / listing.revenue_t12m) * 100);
  const multiple = (listing.asking_price / listing.profit_t12m).toFixed(1);
  
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

      {/* Main Business Card */}
      <Card className="border border-border/50 w-full">
        <CardHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{listing.vertical}</Badge>
                {listing.verified && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {listing.status === 'under_offer' && (
                  <Badge variant="destructive">UNDER OFFER</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {listing.headline}
              </h2>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1.5" />
                {listing.location_area} • Listed 2 days ago
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(listing.asking_price)}</p>
              <p className="text-xs text-muted-foreground">{multiple}x Profit Multiple</p>
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
                  {/* Business Summary */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Business Summary</h3>
                      <p className="text-muted-foreground">
                        {listing.teaser} This business has shown consistent growth over the past 3 years with a strong recurring revenue model and high customer retention rates.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Key Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Established</p>
                            <p className="font-medium">2019</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Team Size</p>
                            <p className="font-medium">5-10 employees</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Market</p>
                            <p className="font-medium">Global</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Business Model</p>
                            <p className="font-medium">Subscription</p>
                          </div>
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
                  
                  {/* Financial Highlights */}
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
                      <div className="space-y-4">
                        {[2021, 2022, 2023, 2024].map(year => (
                          <div key={year}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{year}</span>
                              <span className="font-medium">
                                {formatCurrency(listing.revenue_t12m * (0.6 + (year - 2021) * 0.2))}
                              </span>
                            </div>
                            <Progress 
                              value={20 + (year - 2021) * 20} 
                              className="h-2" 
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <h4 className="font-medium">Profit Margins</h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, i) => (
                          <div key={quarter}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{quarter} 2024</span>
                              <span className="font-medium">
                                {profitMargin + i * 2}%
                              </span>
                            </div>
                            <Progress 
                              value={profitMargin + i * 2} 
                              className="h-2" 
                            />
                          </div>
                        ))}
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
                      <h4 className="font-medium">Monthly Visitors</h4>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground text-sm">Traffic analytics chart</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <h4 className="font-medium">Traffic Sources</h4>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: 'Organic Search', value: 45, color: 'bg-blue-500' },
                          { name: 'Direct', value: 25, color: 'bg-green-500' },
                          { name: 'Social', value: 15, color: 'bg-purple-500' },
                          { name: 'Referral', value: 10, color: 'bg-yellow-500' },
                          { name: 'Email', value: 5, color: 'bg-red-500' },
                        ].map((source) => (
                          <div key={source.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{source.name}</span>
                              <span className="font-medium">{source.value}%</span>
                            </div>
                            <Card className="w-full max-w-full min-w-0">
                              <div 
                                className={`h-full rounded-full ${source.color}`} 
                                style={{ width: `${source.value}%` }}
                              ></div>
                            </Card>
                          </div>
                        ))}
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
                        <div className="p-2 rounded-lg bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="p-6 border-t flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask a Question
            </Button>
            <Button className="w-full sm:w-auto" size="lg" disabled={listing.status === 'under_offer'}>
              {listing.status === 'under_offer' ? 'Under Offer' : 'Make an Offer'}
            </Button>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
