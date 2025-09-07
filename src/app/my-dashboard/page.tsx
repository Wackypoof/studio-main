
import { StatCard, VerificationAlert } from '@/components/dashboard';
import { mockData } from '@/lib/data';
import { Eye, FileSignature, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const buyer = mockData.testUsers.buyer;
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {buyer.fullName.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's an overview of your activity.</p>
      </div>

      <VerificationAlert />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Viewed Listings"
          value={5}
          description="Listings you have recently viewed"
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard 
          title="NDAs Signed"
          value={2}
          description="Non-disclosure agreements you've signed"
          icon={<FileSignature className="h-4 w-4" />}
        />
        <StatCard 
          title="Messages"
          value={0}
          description="Unread messages from sellers"
          icon={<MessageSquare className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
