'use client';

import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home, Mail, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnChange?: any[];
}

interface ErrorWithCause extends Error {
  cause?: unknown;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorWithCause | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorService = {
    report: (error: Error, errorInfo: ErrorInfo) => {
      // In production, this would send the error to an error tracking service
      console.error('Error reported to error service:', { error, errorInfo });
      
      // Example: Send to an error tracking service
      // if (process.env.NODE_ENV === 'production') {
      //   // Replace with your error tracking service
      //   fetch('/api/report-error', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       error: error.toString(),
      //       stack: error.stack,
      //       componentStack: errorInfo.componentStack,
      //       url: window.location.href,
      //       timestamp: new Date().toISOString(),
      //     }),
      //   });
      // }
    },
  };
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error | unknown): ErrorBoundaryState {
    if (error instanceof Error) {
      return { hasError: true, error };
    }
    return { 
      hasError: true, 
      error: new Error(error ? String(error) : 'An unknown error occurred')
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report the error to our error service
    this.errorService.report(error, errorInfo);
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log additional context for debugging
    this.logErrorContext();
  }
  
  private logErrorContext() {
    // Log additional context that might help with debugging
    const context = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      state: this.state,
      props: this.props,
    };
    console.error('Error context:', context);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state when resetOnChange dependencies change
    if (
      this.state.hasError && 
      JSON.stringify(prevProps.resetOnChange) !== JSON.stringify(this.props.resetOnChange)
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    // Add a small delay to ensure state updates before re-rendering
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI with more helpful information
      return this.props.fallback || (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
          <div className="mb-6 rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          
          <h1 className="mb-3 text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          
          <p className="mb-6 max-w-md text-muted-foreground">
            We&apos;ve been notified about this issue and are working on a fix. 
            In the meantime, you can try refreshing the page or return home.
          </p>
          
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <Button 
              onClick={this.resetErrorBoundary}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
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
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="bg-destructive/10 px-4 py-2 text-left text-sm font-medium text-destructive">
                Development Error Details
              </div>
              <div className="overflow-auto p-4 text-left">
                <div className="mb-3 font-mono text-sm font-semibold text-foreground">
                  {this.state.error.toString()}
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {this.state.error.stack}
                </pre>
                {this.state.error?.cause !== undefined && (
                  <div className="mt-3">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Cause:</div>
                    <div className="rounded bg-muted/50 p-2 font-mono text-xs">
                      {String(this.state.error.cause)}
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

    return this.props.children;
  }
}

// Helper hook for functional components
export function useErrorHandler(error: Error | null) {
  useEffect(() => {
    if (error) {
      // Log to an error reporting service
      console.error('Error caught by useErrorHandler:', error);
    }
  }, [error]);
}
