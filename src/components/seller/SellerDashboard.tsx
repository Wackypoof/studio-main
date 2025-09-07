'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface SellerDashboardProps {
  listings: Listing[];
  onViewListing: (id: string) => void;
  onCreateNewListing: () => void;
}

export function SellerDashboard({ listings, onViewListing, onCreateNewListing }: SellerDashboardProps) {
  // Calculate dashboard metrics
  const totalListings = listings.length;
  const activeListings = listings.filter(listing => listing.status === 'live').length;
  const totalAskingPrice = listings.reduce((sum, listing) => sum + listing.asking_price, 0);
  const totalRevenue = listings.reduce((sum, listing) => sum + listing.revenue_t12m, 0);
  const totalProfit = listings.reduce((sum, listing) => sum + listing.profit_t12m, 0);
  
  // Get recent activity (last 3 listings)
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.established).getTime() - new Date(a.established).getTime())
    .slice(0, 3);

  // Calculate performance metrics
  const averageProfitMargin = listings.length > 0 
    ? (listings.reduce((sum, listing) => sum + (listing.profit_t12m / listing.revenue_t12m), 0) / listings.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings} / {totalListings}</div>
            <p className="text-xs text-muted-foreground">
              {totalListings === 0 ? 'No listings yet' : `${Math.round((activeListings / totalListings) * 100)}% active`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asking Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAskingPrice)}</div>
            <p className="text-xs text-muted-foreground">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Annual Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {averageProfitMargin.toFixed(1)}% avg. profit margin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyer Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              8 unread messages
            </p>
          </CardContent>
        </Card>
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
