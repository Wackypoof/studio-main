import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthFormCardProps {
  badge: string;
  title: string;
  description: string;
  headerAction?: ReactNode;
  children: ReactNode;
  onGoogleSignIn?: () => void;
  isLoading?: boolean;
  footerLinks?: ReactNode;
}

export function AuthFormCard({
  badge,
  title,
  description,
  headerAction,
  children,
  onGoogleSignIn,
  isLoading,
  footerLinks,
}: AuthFormCardProps) {
  return (
    <div className="relative">
      {/* Decorative blurs */}
      <div className="absolute -top-12 right-6 h-28 w-28 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="absolute bottom-6 -left-10 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-100">
                {badge}
              </span>
              {headerAction}
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-white md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm text-blue-100">{description}</p>
          </div>

          {/* Form content */}
          {children}

          {/* Google sign-in */}
          {onGoogleSignIn && (
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
                onClick={onGoogleSignIn}
                disabled={isLoading}
                className="w-full rounded-full border-white/20 bg-white/10 py-3 text-base font-medium text-white transition hover:border-white/40 hover:bg-white/20"
                aria-label="Continue with Google"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.14-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.86 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.6 3.28-4.53 6.14-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Footer links */}
              {footerLinks && (
                <div className="flex flex-col gap-2 text-sm text-blue-100">
                  {footerLinks}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AuthSubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: ReactNode;
}

export function AuthSubmitButton({
  isLoading,
  loadingText,
  children,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(
        'w-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-colors duration-200 hover:from-blue-400 hover:to-sky-200',
        isLoading && 'opacity-60'
      )}
    >
      {isLoading ? (
        loadingText
      ) : (
        <>
          {children}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
