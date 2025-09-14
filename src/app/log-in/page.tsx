"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading: isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, error: authError, clearError } = useAuth();
  
  // Sync local error state with auth context
  useEffect(() => {
    if (authError) {
      setError(authError.message);
      toast.error(authError.message);
    }
  }, [authError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const { data, error: signInError } = await signIn({ email, password });
    
    if (signInError) {
      // Error is already set in the AuthContext
      return;
    }
    
    // Clear any previous errors
    clearError();
    
    // Redirect to dashboard on successful login
    router.push('/dashboard');
    router.refresh();
  };

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
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // Will implement forgot password in the next step
                      toast.info('Password reset functionality coming soon');
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
