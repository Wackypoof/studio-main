'use client';

import { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnChange?: any[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
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
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          const FallbackComponent = this.props.fallback as (props: { error: Error | null; reset: () => void }) => ReactNode;
          return FallbackComponent({ error: this.state.error, reset: this.resetErrorBoundary });
        }
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <Button
            onClick={this.resetErrorBoundary}
            variant="outline"
            className="gap-2"
          >
            Try again
          </Button>
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
