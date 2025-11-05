'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLandingLayout } from '@/components/auth/AuthLandingLayout';
import { AuthFormCard, AuthSubmitButton } from '@/components/auth/AuthFormCard';
import { useAuth } from '@/context/AuthProvider';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ROUTES, FORM_FIELDS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithProvider, clearError, isAuthenticating } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoadingState = isAuthenticating ?? false;

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
    <AuthLandingLayout
      badge="Welcome back"
      title="Sign back in to your Succession Asia deal desk."
      description="Continue diligence, review offers, and keep conversations moving with vetted buyers and our in-house deal team."
      stats={[
        { label: 'Active deals', value: '143', description: 'Updated in real time' },
        { label: 'Avg close time', value: '11 days', description: 'From diligence to escrow' },
      ]}
      highlights={[
        'Deal desk support ready when you are',
        'Save valuations, buyer notes, and files in one workspace',
        'Pick up diligence conversations across any device',
      ]}
      footer={
        <>
          New here?{' '}
          <Link
            href={ROUTES.SIGNUP}
            className="font-semibold text-white underline-offset-4 transition hover:text-sky-200 hover:underline"
          >
            Create an account in minutes.
          </Link>
        </>
      }
    >
      <AuthFormCard
        badge="Members"
        title="Sign in to continue"
        description="Access valuations, offers, and data rooms exactly where you left them."
        headerAction={
          <Link
            href="/"
            className="text-xs font-medium text-blue-100 underline-offset-4 transition hover:text-white hover:underline"
          >
            Return to landing
          </Link>
        }
        onGoogleSignIn={handleProviderSignIn}
        isLoading={isLoadingState}
        footerLinks={
          <>
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
          </>
        }
      >
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
                  errors.email &&
                    'border-red-400/80 bg-red-500/10 focus-visible:border-red-400 focus-visible:ring-red-400'
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
                  errors.password &&
                    'border-red-400/80 bg-red-500/10 focus-visible:border-red-400 focus-visible:ring-red-400'
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

          <AuthSubmitButton isLoading={isLoadingState} loadingText="Signing in...">
            Sign in
          </AuthSubmitButton>
        </form>
      </AuthFormCard>
    </AuthLandingLayout>
  );
}
