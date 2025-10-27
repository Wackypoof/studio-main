'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteContainer } from '@/components/site-container';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

const sellingPoints = [
  'Guided onboarding from valuation to launch',
  'Deal desk support across 65 buyer markets',
  'Analytics to benchmark your listing in real time',
];

const protections = [
  { label: 'Verified buyers only', icon: Shield },
  { label: 'Secure escrow workflows', icon: Sparkles },
];

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, error: authError, isLoading, clearError } = useAuth();
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.18),transparent_60%)]" />
      </div>

      <SiteContainer className="relative z-10 flex min-h-screen items-center py-16">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,440px)] xl:gap-24">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/80 backdrop-blur">
              Join Succession Asia
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Launch your listing with a dedicated deal desk beside you.
              </h1>
              <p className="max-w-xl text-lg text-slate-200 md:text-xl">
                Share your mandate, access pricing intelligence, and get matched with qualified buyers faster than the traditional brokerage playbook.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                  Listings launched
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">580+</p>
                <p className="text-xs text-blue-100/70">Past 12 months</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                  Median time to first offer
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">9 days</p>
                <p className="text-xs text-blue-100/70">Across SaaS & eCommerce</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-blue-100">
              {sellingPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-blue-100/80">
              {protections.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              ))}
            </div>

            <div className="text-sm text-blue-200">
              Already onboarded?{' '}
              <Link
                href="/login"
                className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
              >
                Sign in to manage your listing.
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-12 right-6 h-28 w-28 rounded-full bg-sky-400/30 blur-3xl" />
            <div className="absolute bottom-6 -left-10 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur md:p-10">
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-100">
                    Step one
                  </span>
                  <h2 className="mt-6 text-2xl font-semibold text-white md:text-3xl">
                    Create your seller profile
                  </h2>
                  <p className="mt-2 text-sm text-blue-100">
                    We&apos;ll guide you through valuations, buyer outreach, and diligence setup right after this step.
                  </p>
                </div>

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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      'w-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-300 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition hover:from-blue-400 hover:to-emerald-200',
                      isLoading && 'opacity-60'
                    )}
                  >
                    {isLoading ? 'Creating account...' : (
                      <>
                        Create account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-blue-100/70">
                    By continuing you agree to our{' '}
                    <Link href="/legal/terms" className="font-medium text-white underline-offset-4 hover:underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="font-medium text-white underline-offset-4 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>

                <div className="text-sm text-blue-100">
                  Prefer to talk first?{' '}
                  <Link
                    href="/contact"
                    className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
                  >
                    Book a strategy call.
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </div>
  );
}
