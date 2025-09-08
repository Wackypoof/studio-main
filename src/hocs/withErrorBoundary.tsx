import { ComponentType } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from '@/components/error/ErrorBoundary';

type WithErrorBoundaryProps = Omit<ErrorBoundaryProps, 'children'>;

export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  errorBoundaryProps?: WithErrorBoundaryProps
) {
  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  // Set a display name for the HOC for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}
