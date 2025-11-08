'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We&apos;re having trouble loading your dashboard. Please try again or contact support if the problem persists.
      </p>
      <Button shape="pill"
        onClick={() => reset()}
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}
