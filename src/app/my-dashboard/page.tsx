
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockData } from '@/lib/data';

export default function DashboardPage() {
  const buyer = mockData.testUsers.buyer;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {buyer.fullName.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's an overview of your activity.</p>
      </div>

      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Action Required: Verify Your Account</AlertTitle>
        <AlertDescription>
          You need to verify your identity to access full listing details and contact sellers.
          <Button asChild variant="destructive" size="sm" className="ml-4">
            <Link href="/my-dashboard/verification">Start Verification <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Viewed Listings</CardTitle>
            <CardDescription>Listings you have recently viewed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>NDAs Signed</CardTitle>
            <CardDescription>Non-disclosure agreements you have signed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Unread messages from sellers.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
