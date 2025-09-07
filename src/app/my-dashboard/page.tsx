
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StatCard, VerificationAlert, DashboardSkeleton } from '@/components/dashboard';
import { mockData } from '@/lib/data';
import { Eye, Clock, CheckCircle2, AlertCircle, FileSignature, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

interface DashboardData {
  viewedListings: number;
  ndasSigned: number;
  messages: number;
  needsVerification: boolean;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const buyer = mockData.testUsers.buyer;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData({
          viewedListings: 5,
          ndasSigned: 2,
          messages: 0,
          needsVerification: true
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground mb-6">
          {error?.message || 'Unable to load dashboard data'}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome, ${buyer.fullName.split(' ')[0]}`}
        description="Here's an overview of your activity."
      />

      {data.needsVerification && <div className="px-2"><VerificationAlert /></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <StatCard 
          title="Viewed Listings"
          value={data.viewedListings}
          description="Listings you have recently viewed"
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard 
          title="NDAs Signed"
          value={data.ndasSigned}
          description="Non-disclosure agreements you've signed"
          icon={<FileSignature className="h-4 w-4" />}
        />
        <StatCard 
          title="Messages"
          value={data.messages}
          description="Unread messages from sellers"
          icon={<MessageSquare className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
