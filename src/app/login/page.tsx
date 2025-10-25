'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteContainer } from '@/components/site-container';
import { useAuth } from '@/context/AuthProvider';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ROUTES, FORM_FIELDS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const highlightPoints = [
  'Deal desk support ready when you are',
  'Save valuations, buyer notes, and files in one workspace',
  'Pick up diligence conversations across any device',
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithProvider, clearError, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoadingState = isLoading ?? false;

  const { errors, validateForm, clearFieldError } = useFormValidation();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearFieldError(FORM_FIELDS.EMAIL);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    clearFieldError(FORM_FIELDS.PASSWORD);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm({ email, password })) {
      return;
    }

    try {
      await signIn({ email, password });
      clearError();

      const redirect = searchParams?.get('redirect');
      router.push(redirect || ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleProviderSignIn = async () => {
    try {
      const redirect = searchParams?.get('redirect') || '/dashboard';
      await signInWithProvider('google', redirect);
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.2),transparent_55%)]" />
      </div>

      <SiteContainer className="relative z-10 flex min-h-screen items-center py-16">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,420px)] xl:gap-24">
          <div className="space-y-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/80 backdrop-blur">
              Welcome back
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Sign back in to your Succession Asia deal desk.
              </h1>
              <p className="max-w-xl text-lg text-slate-200 md:text-xl">
                Continue diligence, review offers, and keep conversations moving with vetted buyers and our in-house deal team.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                  Active deals
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">143</p>
                <p className="text-xs text-blue-100/70">Updated in real time</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                  Avg close time
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">11 days</p>
                <p className="text-xs text-blue-100/70">From diligence to escrow</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-blue-100">
              {highlightPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-blue-200">
              New here?{' '}
              <Link
                href={ROUTES.SIGNUP}
                className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
              >
                Create an account in minutes.
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-12 right-6 h-28 w-28 rounded-full bg-sky-400/30 blur-3xl" />
            <div className="absolute bottom-6 -left-10 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur md:p-10">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-100">
                      Members
                    </span>
                    <Link
                      href="/"
                      className="text-xs font-medium text-blue-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      Return to landing
                    </Link>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold text-white md:text-3xl">
                    Sign in to continue
                  </h2>
                  <p className="mt-2 text-sm text-blue-100">
                    Access valuations, offers, and data rooms exactly where you left them.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-5" role="group" aria-labelledby="login-form-fields">
                    <span id="login-form-fields" className="sr-only">
                      Login credentials
                    </span>

                    <div className="space-y-2">
                      <Label htmlFor="email-address" className="text-slate-200">
                        Email address
                      </Label>
                      <Input
                        id="email-address"
                        name={FORM_FIELDS.EMAIL}
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        className={cn(
                          'border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400',
                          errors.email && 'border-red-400/80 bg-red-500/10 focus-visible:border-red-400 focus-visible:ring-red-400'
                        )}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-sm text-red-300">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-200">
                        Password
                      </Label>
                      <Input
                        id="password"
                        name={FORM_FIELDS.PASSWORD}
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={handlePasswordChange}
                        className={cn(
                          'border-white/20 bg-white/10 text-white placeholder:text-blue-100/70 focus-visible:border-sky-300 focus-visible:ring-sky-400',
                          errors.password && 'border-red-400/80 bg-red-500/10 focus-visible:border-red-400 focus-visible:ring-red-400'
                        )}
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                      />
                      {errors.password && (
                        <p id="password-error" className="text-sm text-red-300">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={isLoadingState}
                      className={cn(
                        'w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-colors duration-200 hover:from-blue-400 hover:to-sky-200',
                        isLoadingState && 'opacity-60'
                      )}
                      aria-describedby="submit-button-description"
                    >
                      {isLoadingState ? 'Signing in...' : (
                        <>
                          Sign in
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p id="submit-button-description" className="sr-only">
                      Submit your email and password to sign in to your account
                    </p>
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="relative flex items-center">
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="px-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
                      Or continue with
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleProviderSignIn}
                    disabled={isLoadingState}
                    className="w-full rounded-full border-white/20 bg-white/10 py-3 text-base font-medium text-white transition hover:border-white/40 hover:bg-white/20"
                    aria-label="Continue with Google"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.86 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.28-4.53 6.14-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="flex flex-col gap-2 text-sm text-blue-100">
                    <Link
                      href={ROUTES.FORGOT_PASSWORD}
                      className="font-medium text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                    <div>
                      <span className="text-blue-100/80">Don&apos;t have an account? </span>
                      <Link
                        href={ROUTES.SIGNUP}
                        className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteContainer>
    </div>
  );
}
