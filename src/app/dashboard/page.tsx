
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockData } from '@/lib/data';
import {
  AlertCircle,
  FileSignature,
  MessageSquare,
  Briefcase,
  BarChart,
  FileText,
  Handshake,
  Search,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useRole } from '@/contexts/role-context';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { handleError } from '@/lib/error-handler';
import { useAuth } from '@/context/AuthProvider';
import { DashboardMetricCard } from '@/components/dashboard/metric-card';
import { useBuyerDashboardSummary } from '@/hooks/useBuyerDashboardSummary';
import type {
  BuyerDashboardActivityItem,
  BuyerDashboardStats,
  DashboardVerificationStatus,
} from '@/types/dashboard';

const DashboardLoadingState = () => (
  <div className="flex flex-col gap-8">
    <div className="h-9 w-2/5 rounded bg-muted/50" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="border-border/60">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 xl:grid-cols-12">
      <Card className="xl:col-span-8 border-border/60">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
      <Card className="xl:col-span-4 border-border/60">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

interface DashboardErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const DashboardErrorFallback = ({ error, onRetry }: DashboardErrorFallbackProps) => (
  <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
    <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
    <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
    <p className="mb-4 text-muted-foreground">{error?.message || 'Failed to load dashboard data'}</p>
    <RoleAwareButton onClick={onRetry}>Try Again</RoleAwareButton>
  </div>
);

const DEV_SIMULATED_DELAY_MS = 300;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getSimulatedDelay = () =>
  process.env.NODE_ENV === 'development' ? DEV_SIMULATED_DELAY_MS : 0;

export default function DashboardPage() {
  const [isIntroLoading, setIsIntroLoading] = useState(true);
  const router = useRouter();
  const { isBuyer } = useRole();
  const { user: authUser } = useAuth();
  
  // Fallback to mock data when authenticated user context is unavailable
  const mockUser = useMemo(() => {
    if (isBuyer) return mockData.testUsers.buyer;
    // Default to seller1 for demo purposes
    return mockData.testUsers.seller1;
  }, [isBuyer]);

  const buyerGreetingName = useMemo(() => {
    if (!isBuyer) return '';

    const rawFullName =
      typeof authUser?.user_metadata?.full_name === 'string'
        ? authUser.user_metadata.full_name.trim()
        : '';

    if (rawFullName) {
      const firstSegment = rawFullName.split(/\s+/)[0];
      if (firstSegment) return firstSegment;
    }

    const emailHandle = authUser?.email?.split('@')[0];
    if (emailHandle) return emailHandle;

    return 'Buyer';
  }, [authUser, isBuyer]);
  
  
  const handleViewListing = (id: string) => {
    router.push(`/dashboard/listings/${id}?from=dashboard`);
  };
  
  const handleCreateNewListing = () => {
    router.push('/dashboard/listings/new');
  };

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const delay = getSimulatedDelay();
        if (delay > 0) {
          await wait(delay);
        }
        if (isMounted) {
          setIsIntroLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsIntroLoading(false);
        }
        const errorInstance = err instanceof Error ? err : new Error('Failed to prepare dashboard');
        handleError(errorInstance, { componentStack: 'DashboardPage' });
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isIntroLoading) {
    return <DashboardLoadingState />;
  }

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const errorFallbackElement = (
    <DashboardErrorFallback error={null} onRetry={handleRetry} />
  );

  // If user is a seller, render the SellerDashboard
  if (!isBuyer) {
    const sellerListings = mockData.listings.filter(listing => 
      listing.userId === (authUser?.id ?? mockUser.id)
    );
    
    return (
      <ErrorBoundary fallback={errorFallbackElement}>
        <SellerDashboard 
          listings={sellerListings}
          onViewListing={handleViewListing}
          onCreateNewListing={handleCreateNewListing}
        />
      </ErrorBoundary>
    );
  }

  // Default to buyer dashboard
  return (
    <ErrorBoundary fallback={errorFallbackElement}>
      <BuyerDashboardContent greetingName={buyerGreetingName} />
    </ErrorBoundary>
  );
}

type BuyerDashboardContentProps = {
  greetingName: string;
};

const statisticCards = [
  {
    label: 'Saved Listings',
    key: 'savedListings',
    icon: FileText,
    description: "Properties you're interested in",
    href: '/dashboard/saved-listings',
  },
  {
    label: 'Active NDAs',
    key: 'activeNdas',
    icon: FileSignature,
    description: 'Signed confidentiality agreements',
    href: '/dashboard/ndas',
  },
  {
    label: 'Offers Made',
    key: 'activeOffers',
    icon: Handshake,
    description: 'Your active offers',
    href: '/dashboard/offers',
  },
  {
    label: 'Unread Messages',
    key: 'unreadMessages',
    icon: MessageSquare,
    description: 'New messages waiting',
    href: '/dashboard/messages',
  },
] satisfies Array<{
  label: string;
  key: keyof BuyerDashboardStats;
  icon: typeof FileText;
  description: string;
  href: string;
}>;

const verificationCopy: Record<
  DashboardVerificationStatus,
  { title: string; description: string; cta: string }
> = {
  unverified: {
    title: 'Complete your profile verification',
    description:
      'Upload proof-of-funds and identity documents to unlock deeper deal access and signal trust to sellers.',
    cta: 'Start Verification',
  },
  pending: {
    title: 'Verification under review',
    description: 'Thanks for submitting your documents. We will notify you as soon as the review is complete.',
    cta: 'Check Status',
  },
  rejected: {
    title: 'Verification needs attention',
    description: 'We need additional information to verify your buyer profile. Review the requirements and reupload.',
    cta: 'Update Documents',
  },
  verified: {
    title: 'Buyer verified',
    description: 'Your buyer profile is verified. You can now access deeper deal data instantly.',
    cta: 'View Verification',
  },
};

const activityIconMap: Record<BuyerDashboardActivityItem['type'], typeof FileText> = {
  saved_listing: FileText,
  nda: FileSignature,
  offer: Handshake,
  message: MessageSquare,
};

function BuyerDashboardContent({ greetingName }: BuyerDashboardContentProps) {
  const router = useRouter();
  const {
    data,
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useBuyerDashboardSummary();

  useEffect(() => {
    if (error) {
      handleError(error, { componentStack: 'BuyerDashboardContent' });
    }
  }, [error]);

  const showSkeleton = isLoading && !data;

  if (showSkeleton) {
    return <DashboardLoadingState />;
  }

  if (error && !data) {
    return <DashboardErrorFallback error={error} onRetry={() => void refetch()} />;
  }

  const stats = statisticCards.map((stat) => ({
    ...stat,
    value: data?.stats[stat.key] ?? 0,
  }));

  const verificationStatus = data?.verificationStatus ?? 'unverified';
  const shouldShowVerificationBanner = verificationStatus !== 'verified';
  const bannerCopy = verificationCopy[verificationStatus] ?? verificationCopy.unverified;

  const quickActionClasses =
    'justify-start rounded-full border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white';

  const goTo = (path: string) => router.push(path);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Buyer Dashboard"
        description={`Welcome back, ${greetingName}! Here are your saved listings and recent activity.`}
      />

      {shouldShowVerificationBanner && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-950 via-[#082b56] to-[#0f172a] p-6 text-white shadow-lg shadow-blue-900/30">
          <div className="pointer-events-none absolute -left-28 top-0 h-48 w-48 rounded-full bg-blue-500/35 blur-3xl" />
          <div className="pointer-events-none absolute right-[-56px] top-12 h-52 w-52 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-80" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/10 text-blue-200 shadow-sm shadow-blue-900/30">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  Verification desk
                </span>
                <h3 className="text-xl font-semibold text-white">{bannerCopy.title}</h3>
                <p className="text-sm text-blue-100/80">{bannerCopy.description}</p>
              </div>
            </div>
            <Button
              size="lg"
              className="h-auto rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-blue-300 px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-900/40 transition duration-300 hover:from-blue-400 hover:via-sky-300 hover:to-blue-200"
              onClick={() => goTo('/dashboard/verification')}
            >
              {bannerCopy.cta}
            </Button>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardMetricCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            tone="buyer"
            className="h-full"
            href={stat.href}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            {isRefetching && <span className="text-xs text-muted-foreground">Refreshing…</span>}
          </CardHeader>
          <CardContent>
            {!data?.recentActivity?.length ? (
              <p className="text-sm text-muted-foreground">No recent activity yet. New actions will appear here.</p>
            ) : (
              <div className="space-y-3">
                {data.recentActivity.map((activity) => {
                  const Icon = activityIconMap[activity.type] ?? MessageSquare;
                  return (
                    <button
                      type="button"
                      key={activity.id}
                      onClick={() => goTo(activity.href)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-transparent px-2 py-2 text-left transition hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                    >
                      <div className="rounded-full bg-muted p-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatActivityTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 rounded-3xl border border-slate-200/70 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button
              type="button"
              variant="outline"
              className={quickActionClasses}
              onClick={() => goTo('/dashboard/messages')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View Messages
            </Button>
            <Button
              type="button"
              variant="outline"
              className={quickActionClasses}
              onClick={() => goTo('/dashboard/saved-listings')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Saved Listings
            </Button>
            <Button
              type="button"
              variant="outline"
              className={quickActionClasses}
              onClick={() => goTo('/dashboard/analytics')}
            >
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button
              type="button"
              variant="outline"
              className={quickActionClasses}
              onClick={() => goTo('/dashboard/browse-listings')}
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const formatActivityTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${timeFormatter.format(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${timeFormatter.format(date)}`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
};
// Code-split SellerDashboard so buyer bundles don't include it
const SellerDashboard = dynamic(
  () => import('@/components/seller/SellerDashboard').then((m) => m.SellerDashboard),
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-muted/50 rounded" /> }
);
