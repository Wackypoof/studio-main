'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ROUTES, FORM_FIELDS } from '@/lib/constants';
import { buttonStyles, commonStyles } from '@/lib/styles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { signIn, signInWithProvider, clearError, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use the loading state from AuthContext if available, otherwise use local state
  const isLoadingState = isLoading !== undefined ? isLoading : localLoading;

  const { errors, validateForm, clearFieldError } = useFormValidation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearFieldError(FORM_FIELDS.EMAIL);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    clearFieldError(FORM_FIELDS.PASSWORD);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm({ email, password })) {
      return;
    }

    try {
      await signIn({ email, password });

      // Clear any previous errors
      clearError();

      // Redirect to intended page or dashboard on successful login
      const redirect = searchParams?.get('redirect');
      router.push(redirect || ROUTES.DASHBOARD);

    } catch (error) {
      // Error is already handled by AuthProvider via toast notification
      console.error('Login error:', error);
    }
  };

  const handleProviderSignIn = async () => {
    try {
      await signInWithProvider('google');
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.card}>
        <header>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h1>
        </header>
        <main>
          <form className={commonStyles.form} onSubmit={handleSubmit} noValidate>
            <fieldset className={commonStyles.fieldset}>
              <legend className="sr-only">Login credentials</legend>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name={FORM_FIELDS.EMAIL}
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name={FORM_FIELDS.PASSWORD}
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
            </fieldset>

            {/* Error Messages */}
            <div className="space-y-2" role="alert" aria-live="polite">
              {errors.email && (
                <p id="email-error" className={commonStyles.errorText}>
                  {errors.email}
                </p>
              )}
              {errors.password && (
                <p id="password-error" className={commonStyles.errorText}>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoadingState}
                className={`${buttonStyles.primary} ${isLoadingState ? buttonStyles.loading : ''}`}
                aria-describedby="submit-button-description"
              >
                {isLoadingState ? 'Signing in...' : 'Sign in'}
              </button>
              <p id="submit-button-description" className="sr-only">
                Submit your email and password to sign in to your account
              </p>
            </div>
          </form>

          <div className="mt-6">
            <div className={commonStyles.divider}>
              <div className={commonStyles.dividerLine}>
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className={commonStyles.divider}>
                <span className={commonStyles.dividerText}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleProviderSignIn}
                className={buttonStyles.secondary}
                disabled={isLoadingState}
                aria-label="Continue with Google"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.86 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.28-4.53 6.14-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <Link href={ROUTES.FORGOT_PASSWORD} className={commonStyles.link}>
              Forgot your password?
            </Link>
          </div>

          <div className="mt-2 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href={ROUTES.SIGNUP} className={commonStyles.link}>
              Sign up
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
