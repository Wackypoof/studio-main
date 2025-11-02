'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLandingLayout } from '@/components/auth/AuthLandingLayout';
import { AuthFormCard, AuthSubmitButton } from '@/components/auth/AuthFormCard';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithProvider, error: authError, isLoading, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authError) return;

    const id = requestAnimationFrame(() => {
      setError(authError.message);
      toast.error(authError.message);
    });

    return () => cancelAnimationFrame(id);
  }, [authError]);

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (error) setError(null);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    try {
      localStorage.setItem('emailForSignIn', email);
    } catch {
      console.warn('Unable to persist emailForSignIn to localStorage');
    }

    const { error: signUpError } = await signUp(email, password, {
      data: { full_name: fullName.trim() },
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    });

    if (signUpError) {
      return;
    }

    clearError();
    router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
  };

  const handleProviderSignIn = async () => {
    try {
      await signInWithProvider('google', '/dashboard');
    } catch (providerError) {
      console.error('Google sign up error:', providerError);
    }
  };

  return (
    <AuthLandingLayout
      badge="Join Succession Asia"
      title="Launch your listing with a dedicated deal desk beside you."
      description="Share your mandate, access pricing intelligence, and get matched with qualified buyers faster than the traditional brokerage playbook."
      stats={[
        { label: 'Listings launched', value: '580+', description: 'Past 12 months' },
        {
          label: 'Median time to first offer',
          value: '9 days',
          description: 'Across SaaS & eCommerce',
        },
      ]}
      highlights={[
        'Guided onboarding from valuation to launch',
        'Deal desk support across 65 buyer markets',
        'Analytics to benchmark your listing in real time',
      ]}
      footer={
        <>
          Already onboarded?{' '}
          <Link
            href="/login"
            className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
          >
            Sign in to manage your listing.
          </Link>
        </>
      }
    >
      <AuthFormCard
        badge="Step one"
        title="Create your seller profile"
        description="We'll guide you through valuations, buyer outreach, and diligence setup right after this step."
        onGoogleSignIn={handleProviderSignIn}
        isLoading={isLoading}
      >

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-slate-200">
              Full name
            </Label>
            <Input
              id="full-name"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={handleFullNameChange}
              disabled={isLoading}
              className="border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-address" className="text-slate-200">
              Work email
            </Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              className="border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              className="border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-slate-200">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
              className={cn(
                'border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400 disabled:opacity-60',
                error === 'Passwords do not match' &&
                  'border-red-400/80 bg-red-500/10 focus-visible:border-red-400 focus-visible:ring-red-400'
              )}
            />
          </div>

          <AuthSubmitButton isLoading={isLoading ?? false} loadingText="Creating account...">
            Create account
          </AuthSubmitButton>

          <p className="text-xs text-blue-100/70">
            By continuing you agree to our{' '}
            <Link
              href="/legal/terms"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/privacy"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <div className="flex flex-wrap gap-3 text-xs text-blue-100/80">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
            <Shield className="h-4 w-4" />
            Verified buyers only
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Secure escrow workflows
          </span>
        </div>

        <div className="text-sm text-blue-100">
          Prefer to talk first?{' '}
          <Link
            href="/contact"
            className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
          >
            Book a strategy call.
          </Link>
        </div>
      </AuthFormCard>
    </AuthLandingLayout>
  );
}
