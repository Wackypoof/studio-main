
import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LogInPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-muted flex-col justify-between p-8 text-white bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop')" }}>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
              <Briefcase className="h-7 w-7" />
              <span>SuccessionAsia</span>
          </Link>
          <div className="max-w-md">
              <h2 className="text-3xl font-bold">Unlock Your Next Chapter</h2>
              <p className="mt-2 text-lg text-white/80">
                  Access a curated marketplace of verified businesses and professional practices. Your confidential journey to acquisition starts here.
              </p>
          </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-background p-4 sm:p-8">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="text-center lg:text-left">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required defaultValue="john.doe@example.com" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required defaultValue="password" />
              </div>
              <Button asChild className="w-full">
                <Link href="/my-dashboard">
                  Log In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
