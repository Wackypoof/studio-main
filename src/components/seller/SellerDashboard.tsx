'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/stat-card';
import { VerificationAlert } from '@/components/dashboard/verification-alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  Plus,
  Search,
  BarChart2,
  FileText,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

interface SellerDashboardProps {
  listings: Listing[];
  onViewListing: (id: string) => void;
  onCreateNewListing: () => void;
  onRefresh?: () => Promise<void>;
  isLoading?: boolean;
  lastUpdated?: Date;
}

export function SellerDashboard({ 
  listings, 
  onViewListing, 
  onCreateNewListing, 
  onRefresh,
  isLoading = false,
  lastUpdated = new Date() 
}: SellerDashboardProps) {
  const [isVerified, setIsVerified] = useState(false); // Will be set based on user's verification status 

  // In a real app, this would come from your auth context or API
  useEffect(() => {
    // Simulate checking verification status
    // Replace with actual API call
    const checkVerification = async () => {
      try {
        // const response = await fetch('/api/verification/status');
        // const data = await response.json();
        // setIsVerified(data.isVerified);
        
        // For demo purposes, we'll set a mock value
        setIsVerified(false);
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    checkVerification();
  }, []);

  // Calculate dashboard metrics
  const totalListings = listings.length;
  const activeListings = listings.filter(listing => listing.status === 'live').length;
  const totalAskingPrice = listings.reduce((sum, listing) => sum + listing.asking_price, 0);
  const totalRevenue = listings.reduce((sum, listing) => sum + listing.revenue_t12m, 0);
  const totalProfit = listings.reduce((sum, listing) => sum + listing.profit_t12m, 0);
  
  // Calculate changes from previous period (mock data)
  const prevPeriodListings = Math.max(0, totalListings - 2);
  const listingsChange = totalListings - prevPeriodListings;
  const revenueChange = 0.15; // 15% increase
  const profitChange = 0.08; // 8% increase
  
  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };
  
  // Get recent activity (last 3 listings)
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.established).getTime() - new Date(a.established).getTime())
    .slice(0, 3);

  // Calculate performance metrics
  const averageProfitMargin = listings.length > 0 
    ? (listings.reduce((sum, listing) => sum + (listing.profit_t12m / listing.revenue_t12m), 0) / listings.length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Seller Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      <VerificationAlert 
        className="mb-6" 
        status={isVerified ? 'verified' : 'unverified'}
        onAction={() => {
          if (!isVerified) {
            // Navigate to verification page
            window.location.href = '/my-dashboard/verification';
          } else {
            // If already verified, allow creating a new listing
            onCreateNewListing();
          }
        }}
      />
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Total Listings"
                  value={totalListings.toString()}
                  description={`${activeListings} active, ${totalListings - activeListings} draft`}
                  icon={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Briefcase className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of listings you've created</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  trend={{
                    value: `${Math.abs(listingsChange)} ${listingsChange >= 0 ? 'more' : 'less'} than last month`,
                    type: listingsChange >= 0 ? 'up' : 'down'
                  }}
                  onClick={() => onViewListing('list')}
                  clickable
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view all listings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="Total Asking Price"
                  value={formatCurrency(totalAskingPrice)}
                  description={`Average: ${formatCurrency(totalListings > 0 ? totalAskingPrice / totalListings : 0)}`}
                  icon={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DollarSign className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sum of asking prices for all your listings</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  onClick={() => onViewListing('pricing')}
                  clickable
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view pricing analytics</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="12m Revenue"
                  value={formatCurrency(totalRevenue)}
                  description={`${averageProfitMargin.toFixed(1)}% average profit margin`}
                  icon={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TrendingUp className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total revenue from all your businesses in the last 12 months</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  trend={{
                    value: `${(revenueChange * 100).toFixed(0)}% from last period`,
                    type: revenueChange >= 0 ? 'up' : 'down'
                  }}
                  onClick={() => onViewListing('revenue')}
                  clickable
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view detailed revenue reports</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatCard
                  title="12m Profit"
                  value={formatCurrency(totalProfit)}
                  description={`${activeListings} active listings`}
                  icon={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DollarSign className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Net profit after expenses for all your businesses</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  trend={{
                    value: `${(profitChange * 100).toFixed(0)}% from last period`,
                    type: profitChange >= 0 ? 'up' : 'down'
                  }}
                  onClick={() => onViewListing('profit')}
                  clickable
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view profit analysis</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="w-full sm:w-auto" onClick={onCreateNewListing}>
          <Plus className="mr-2 h-4 w-4" /> Create New Listing
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" /> Browse Market Insights
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <BarChart2 className="mr-2 h-4 w-4" /> View Performance
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Listings</CardTitle>
              <Link href="/my-dashboard/listings" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentListings.length > 0 ? (
              <div className="space-y-4">
                {recentListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => onViewListing(listing.id)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{listing.headline}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{listing.vertical}</span>
                        <span className="mx-2">•</span>
                        <span>{listing.location_area}</span>
                      </div>
                    </div>
                    <Badge variant={listing.status === 'live' ? 'default' : 'outline'}>
                      {listing.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No listings yet</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={onCreateNewListing}>
                  Create your first listing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Profit Margin</span>
                <span className="text-sm font-medium">{averageProfitMargin.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${Math.min(averageProfitMargin, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Listing Quality</span>
                <span className="text-sm font-medium">85% Complete</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>Complete your profile to increase trust with buyers</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
