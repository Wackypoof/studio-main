'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';
import { reportError } from '@/lib/error-handler';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    reportError(error, {
      digest: error.digest,
      page: window.location.pathname,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      
      <h1 className="mb-3 text-2xl font-bold text-foreground">
        Oops! Something went wrong
      </h1>
      
      <p className="mb-6 max-w-md text-muted-foreground">
        We&apos;ve encountered an unexpected error. Our team has been notified and is working on a fix.
        Please try again later or contact support if the problem persists.
      </p>
      
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <Button 
          onClick={reset}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        
        <Button 
          variant="outline" 
          asChild
          className="gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          asChild
          className="gap-2"
        >
          <a href="mailto:support@yourdomain.com">
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </Button>
      </div>
      
      {/* Error details for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5">
          <div className="bg-destructive/10 px-4 py-2 text-left text-sm font-medium text-destructive">
            Development Error Details
          </div>
          <div className="overflow-auto p-4 text-left">
            <div className="mb-3 font-mono text-sm font-semibold text-foreground">
              {error.toString()}
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
              {error.stack}
            </pre>
            {error.digest && (
              <div className="mt-3">
                <div className="mb-1 text-xs font-medium text-muted-foreground">Digest:</div>
                <div className="rounded bg-muted/50 p-2 font-mono text-xs">
                  {error.digest}
                </div>
              </div>
            )}
            <div className="mt-3 text-xs text-muted-foreground">
              URL: {typeof window !== 'undefined' ? window.location.href : 'server'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
