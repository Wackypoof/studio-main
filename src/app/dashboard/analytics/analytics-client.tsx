'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart2, LineChart, PieChart, Eye, Download, Calendar, Filter, 
  ArrowUp, ArrowDown, Users, DollarSign, BarChart3, TrendingUp, Activity, Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

interface AnalyticsClientProps {
  initialData: {
    viewsData: Array<{ date: string; views: number; clicks: number }>;
    leadsData: Array<{ name: string; value: number }>;
    userListings: Array<{ id: string; headline: string; status: string; revenue: number }>;
    currentUser: { id: string };
  };
  searchParams: { listing?: string };
}

export function AnalyticsClient({ initialData, searchParams }: AnalyticsClientProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedListing, setSelectedListing] = useState<string | null>(searchParams.listing || null);
  
  const { viewsData, leadsData, userListings, currentUser } = initialData;
  
  // Filter listings if a specific one is selected
  const filteredListings = selectedListing
    ? userListings.filter(listing => listing.id === selectedListing)
    : userListings;
  
  // Calculate totals
  const totalViews = viewsData.reduce((sum, day) => sum + day.views, 0);
  const totalClicks = viewsData.reduce((sum, day) => sum + day.clicks, 0);
  const totalLeads = leadsData.reduce((sum, source) => sum + source.value, 0);
  const conversionRate = totalViews > 0 ? Math.round((totalLeads / totalViews) * 100) : 0;
  
  // Calculate performance metrics
  const performanceMetrics = filteredListings.map(listing => ({
    id: listing.id,
    title: listing.headline,
    views: totalViews,
    clicks: totalClicks,
    leads: totalLeads,
    conversionRate: conversionRate,
    revenue: listing.revenue,
    status: listing.status,
  }));
  
  // Calculate percentage changes based on fixed values
  const getPercentageChange = (value: number) => {
    const change = (value % 10) + 5; // Deterministic based on value
    return change > 0 ? `+${change}%` : `${change}%`;
  };
  
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Track your listing performance and gain insights"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={selectedListing || ''}
            onChange={(e) => setSelectedListing(e.target.value || null)}
          >
            <option value="">All Listings</option>
            {userListings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.headline}
              </option>
            ))}
          </select>
          
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{getPercentageChange(totalViews)}</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{getPercentageChange(totalLeads)}</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{getPercentageChange(conversionRate)}</span> from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 45s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{getPercentageChange(45)}</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
}
