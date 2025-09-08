
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockData } from '@/lib/data';
import { 
  Eye, Clock, CheckCircle2, AlertCircle, FileSignature, 
  MessageSquare, Briefcase, BarChart, TrendingUp, Users, FileText, Handshake, Search, Plus 
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useRole } from '@/contexts/role-context';
import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { handleError } from '@/lib/error-handler';

interface DashboardData {
  stats: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
  }[];
  needsVerification: boolean;
  recentActivity?: {
    type: string;
    title: string;
    date: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const router = useRouter();
  const { isBuyer } = useRole();
  
  // In a real app, this would come from auth context
  const user = useMemo(() => {
    if (isBuyer) return mockData.testUsers.buyer;
    // Default to seller1 for demo purposes
    return mockData.testUsers.seller1;
  }, [isBuyer]);
  
  const handleViewListing = (id: string) => {
    router.push(`/listings/${id}`);
  };
  
  const handleCreateNewListing = () => {
    router.push('/my-dashboard/listings/new');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isBuyer) {
          setData({
            stats: [
              {
                label: 'Saved Listings',
                value: '12',
                icon: FileText,
                description: 'Properties you\'re interested in'
              },
              {
                label: 'Active NDAs',
                value: '3',
                icon: FileSignature,
                description: 'Signed confidentiality agreements'
              },
              {
                label: 'Offers Made',
                value: '2',
                icon: Handshake,
                description: 'Your active offers'
              },
              {
                label: 'Unread Messages',
                value: '5',
                icon: MessageSquare,
                description: 'New messages waiting'
              }
            ],
            needsVerification: true,
            recentActivity: [
              {
                type: 'Viewing Scheduled',
                title: 'Dental Clinic - Central',
                date: 'Today, 2:30 PM',
                icon: Eye
              },
              {
                type: 'Offer Submitted',
                title: 'Boutique Fashion Store',
                date: 'Yesterday',
                icon: Handshake
              },
              {
                type: 'NDA Signed',
                title: 'Tuition Center - East',
                date: '2 days ago',
                icon: FileSignature
              }
            ]
          });
        } else {
          // Seller dashboard data
          setData({
            stats: [
              {
                label: 'Active Listings',
                value: '8',
                icon: Briefcase,
                description: 'Properties listed for sale'
              },
              {
                label: 'Total Views',
                value: '124',
                icon: Eye,
                description: 'Profile and listing views'
              },
              {
                label: 'Buyer Leads',
                value: '23',
                icon: Users,
                description: 'Interested buyers'
              },
              {
                label: 'Avg. Response Time',
                value: '2.5h',
                icon: Clock,
                description: 'Time to first response'
              }
            ],
            needsVerification: false,
            recentActivity: [
              {
                type: 'New Lead',
                title: 'John D. viewed your listing',
                date: '2 hours ago',
                icon: Users
              },
              {
                type: 'Price Alert',
                title: 'Competitor price drop nearby',
                date: '5 hours ago',
                icon: TrendingUp
              },
              {
                type: 'Market Update',
                title: '3 new buyers in your area',
                date: '1 day ago',
                icon: BarChart
              }
            ]
          });
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load dashboard data');
        setError(error);
        handleError(error, { componentStack: 'DashboardPage' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isBuyer]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted/50 rounded w-1/3"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted rounded mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error boundary fallback component
  interface ErrorFallbackProps {
    error: Error | null;
    reset: () => void;
  }
  
  const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => (
    <div className="flex flex-col items-center justify-center h-64 rounded-lg border border-dashed">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        {error?.message || 'Failed to load dashboard data'}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
  
  // Error boundary fallback element
  const errorFallbackElement = (
    <ErrorFallback error={error} reset={() => window.location.reload()} />
  );

  if (error || !data) {
    return <ErrorFallback error={error} reset={() => window.location.reload()} />;
  }

  // If user is a seller, render the SellerDashboard
  if (!isBuyer) {
    const sellerListings = mockData.listings.filter(listing => 
      listing.userId === user.id
    );
    
    return (
      <ErrorBoundary fallback={errorFallbackElement}>
        <div className="space-y-6">
          <PageHeader
            title="Seller Dashboard"
            description={`Welcome back, ${user.fullName.split(' ')[0]}! Track your listings and buyer interest.`}
          />
          <SellerDashboard 
            listings={sellerListings}
            onViewListing={handleViewListing}
            onCreateNewListing={handleCreateNewListing}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // Default to buyer dashboard
  return (
    <ErrorBoundary fallback={errorFallbackElement}>
      <div className="space-y-6">
        <PageHeader
          title="Buyer Dashboard"
          description={`Welcome back, ${user.fullName.split(' ')[0]}! Here are your saved listings and recent activity.`}
        />

        {data.needsVerification && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="py-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Verification Required</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-yellow-700 mb-3">
                Complete your profile verification to access all features and increase trust with {isBuyer ? 'sellers' : 'buyers'}.
              </p>
              <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                Start Verification
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-muted p-2">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {isBuyer ? 'Saved Listings' : 'My Listings'}
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              {isBuyer ? (
                <Button variant="outline" className="justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Listings
                </Button>
              ) : (
                <Button variant="outline" className="justify-start">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create New Listing
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
