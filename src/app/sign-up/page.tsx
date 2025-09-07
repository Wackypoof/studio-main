
import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full">
       <div className="hidden lg:flex lg:w-1/2 bg-muted flex-col justify-between p-8 text-white bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2835&auto=format&fit=crop')" }}>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
              <Briefcase className="h-7 w-7" />
              <span>SuccessionAsia</span>
          </Link>
          <div className="max-w-md">
              <h2 className="text-3xl font-bold">Begin Your Acquisition Journey</h2>
              <p className="mt-2 text-lg text-white/80">
                Create a secure buyer account to get access to exclusive listings and connect with sellers.
              </p>
          </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-background p-4 sm:p-8">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="text-center lg:text-left">
            <CardTitle className="text-2xl font-bold tracking-tight">Create a Buyer Account</CardTitle>
            <CardDescription>
              Complete the form below to get started. Verification will be required to view deal rooms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link href="/log-in" className="font-medium text-primary hover:underline">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
