'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart2, LineChart, PieChart, Eye, Download, Calendar, Filter, 
  ArrowUp, ArrowDown, Users, DollarSign, BarChart3, TrendingUp, Activity
} from 'lucide-react';
import { mockData } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';

// Mock data for charts
const generateViewsData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2025, 8, i + 1).toISOString().split('T')[0],
    views: Math.floor(Math.random() * 100) + 20,
    clicks: Math.floor(Math.random() * 50) + 5,
  }));
};

const generateLeadsData = () => {
  return [
    { name: 'Contact Form', value: 45 },
    { name: 'WhatsApp', value: 25 },
    { name: 'Phone Calls', value: 20 },
    { name: 'Email', value: 10 },
  ];
};

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');
  
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedListing, setSelectedListing] = useState<string | null>(listingId);
  
  // In a real app, this would come from the API based on the authenticated user
  const currentUser = useMemo(() => {
    return mockData.testUsers.seller1; // Default to seller1 for demo
  }, []);
  
  // Get user's listings
  const userListings = useMemo(() => {
    return mockData.listings.filter(listing => listing.userId === currentUser.id);
  }, [currentUser.id]);
  
  // If a specific listing is selected, filter for that listing
  const filteredListings = useMemo(() => {
    if (selectedListing) {
      return userListings.filter(listing => listing.id === selectedListing);
    }
    return userListings;
  }, [userListings, selectedListing]);
  
  // Generate mock analytics data
  const viewsData = useMemo(() => generateViewsData(), [timeRange]);
  const leadsData = useMemo(() => generateLeadsData(), [timeRange]);
  
  // Calculate totals
  const totalViews = useMemo(() => viewsData.reduce((sum, day) => sum + day.views, 0), [viewsData]);
  const totalClicks = useMemo(() => viewsData.reduce((sum, day) => sum + day.clicks, 0), [viewsData]);
  const totalLeads = useMemo(() => leadsData.reduce((sum, source) => sum + source.value, 0), [leadsData]);
  const conversionRate = useMemo(() => {
    return totalViews > 0 ? Math.round((totalLeads / totalViews) * 100) : 0;
  }, [totalViews, totalLeads]);
  
  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (filteredListings.length === 0) return [];
    
    return filteredListings.map(listing => ({
      id: listing.id,
      title: listing.headline,
      views: totalViews,
      clicks: totalClicks,
      leads: totalLeads,
      conversionRate: conversionRate,
      revenue: listing.revenue_t12m,
      profit: listing.profit_t12m,
      status: listing.status,
    }));
  }, [filteredListings, totalViews, totalClicks, totalLeads, conversionRate]);
  
  return (
    <div className="space-y-6">
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
              <span className="text-green-500">+12.5%</span> from last period
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
              <span className="text-green-500">+8.2%</span> from last period
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
              <span className="text-green-500">+2.1%</span> from last period
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
              <span className="text-red-500">-0.5%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Views Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Views & Clicks</CardTitle>
            <CardDescription>Daily views and clicks over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center text-muted-foreground">
              <LineChart className="mx-auto h-12 w-12 mb-2" />
              <p>Views and clicks chart would be displayed here</p>
              <p className="text-sm text-muted-foreground">
                Showing data for the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : '12 months'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Leads by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <div className="text-center text-muted-foreground">
              <PieChart className="mx-auto h-12 w-12 mb-2" />
              <p>Leads by source chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance by Listing */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Performance</CardTitle>
          <CardDescription>Performance metrics for your listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Listing</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Leads</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversion</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {performanceMetrics.map((metric) => (
                  <tr key={metric.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">
                      <div className="line-clamp-1">{metric.title}</div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        metric.status === 'live' ? 'bg-green-100 text-green-800' :
                        metric.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        metric.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        metric.status === 'under_offer' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {metric.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm">{metric.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm">{metric.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm">{metric.leads.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm">{metric.conversionRate}%</td>
                    <td className="py-3 px-4 text-right text-sm font-medium">{formatCurrency(metric.revenue)}</td>
                    <td className="py-3 px-4 text-right text-sm">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Analytics Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Performing Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Listings</CardTitle>
            <CardDescription>Listings with the highest conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceMetrics
              .sort((a, b) => b.conversionRate - a.conversionRate)
              .slice(0, 3)
              .map((metric) => (
                <div key={metric.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{metric.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{metric.views.toLocaleString()} views</span>
                      <span className="mx-2">•</span>
                      <span>{metric.leads} leads</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{metric.conversionRate}%</p>
                    <p className="text-xs text-green-500 flex items-center justify-end">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {Math.floor(Math.random() * 10) + 5}%
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your listings</CardDescription>
          </CardHeader>
          <CardContent>
            {[
              { id: 1, action: 'View', listing: 'Dental Clinic - Central', user: 'John D.', time: '2 hours ago' },
              { id: 2, action: 'Inquiry', listing: 'Boutique Fashion Store', user: 'Sarah M.', time: '5 hours ago' },
              { id: 3, action: 'NDA Signed', listing: 'Tuition Center - East', user: 'Michael T.', time: '1 day ago' },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start py-3 border-b last:border-0">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium">{activity.user.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.user} {activity.action}ed your listing</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.listing}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
