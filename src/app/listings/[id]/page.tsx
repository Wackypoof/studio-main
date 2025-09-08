
'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { listings } from '@/lib/data';
import type { Listing } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  Users, 
  FileText, 
  Building, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { NdaFormClient } from '@/components/nda/nda-form-client';
import { Header } from '@/components/Header';

// Types for the component props
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}

interface ListingDetailPageProps {
  params: { id: string };
}

// Memoized Metric Card Component
const MetricCard = ({ label, value, icon: Icon, className = '' }: MetricCardProps) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

// Format currency with proper typing
const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('en-SG', { 
    style: 'currency', 
    currency: 'SGD' 
  }).format(amount);
};

// Format multiple with proper typing
const formatMultiple = (multiple: number): string => {
  if (isNaN(multiple) || !isFinite(multiple)) {
    return 'N/A';
  }
  return `${multiple.toFixed(1)}x`;
};

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const listing = listings.find((l) => l.id === params.id);

  if (!listing) {
    notFound();
  }
  
  // Memoize expensive calculations
  const { revenueMultiple, profitMultiple } = useMemo(() => ({
    revenueMultiple: listing.asking_price / listing.revenue_t12m,
    profitMultiple: listing.asking_price / listing.profit_t12m
  }), [listing.asking_price, listing.revenue_t12m, listing.profit_t12m]);

  // Memoize data arrays to prevent recreation on every render
  const operational = useMemo(() => [
    { label: 'Staff Count', value: listing.staff_count, icon: Users },
    { label: 'Lease Summary', value: listing.lease_summary, icon: Building },
    { label: 'Licences', value: listing.licences_summary, icon: Scale },
    { label: 'Assets', value: listing.assets_summary, icon: FileText },
  ], [
    listing.staff_count, 
    listing.lease_summary, 
    listing.licences_summary, 
    listing.assets_summary
  ]);

  const recentPerformance = useMemo(() => [
    { 
      label: 'TTM Revenue', 
      value: formatCurrency(listing.revenue_t12m), 
      icon: TrendingUp 
    },
    { 
      label: 'TTM Profit', 
      value: formatCurrency(listing.profit_t12m), 
      icon: DollarSign 
    },
    { 
      label: 'Last Month Revenue', 
      value: formatCurrency(listing.revenue_last_month), 
      icon: Calendar 
    },
    { 
      label: 'Last Month Profit', 
      value: formatCurrency(listing.profit_last_month), 
      icon: Calendar 
    }
  ], [
    listing.revenue_t12m, 
    listing.profit_t12m, 
    listing.revenue_last_month, 
    listing.profit_last_month
  ]);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <SiteContainer>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Badge variant="secondary" className="mb-2">{listing.vertical}</Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground/90">
                  {listing.headline}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {listing.location_area}
                  </div>
                  {listing.verified && (
                    <div className="flex items-center text-green-600 font-medium">
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      Verified Listing
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">{listing.teaser}</p>
                  </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recentPerformance.map((item: { label: string; value: string; icon: React.ElementType }, index: number) => (
                            <div key={index} className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                                <div className="flex items-center gap-2">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Valuation</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">ASKING PRICE</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(listing.asking_price)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">REVENUE MULTIPLE</p>
                      <p className="text-2xl font-bold">{formatMultiple(revenueMultiple)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">PROFIT MULTIPLE</p>
                      <p className="text-2xl font-bold">{formatMultiple(profitMultiple)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Asking Price Reasoning</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/80 leading-relaxed">{listing.asking_price_reasoning}</p>
                    </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operational Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {operational.map((item: { label: string; value: string | number; icon: React.ElementType }, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                              <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-muted-foreground text-sm">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
              <NdaFormClient />
            </aside>
          </div>
        </SiteContainer>
      </main>
    </div>
  );
}
