'use client';

import { AuthProvider } from '@/context/AuthProvider';
import { RoleProvider } from '@/contexts/role-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useMemo } from 'react';

// Enhanced QueryClient configuration for better performance
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000,
        // Keep data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Reduce refetch frequency
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Retry failed requests with exponential backoff
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as any).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Enable background refetching for better UX
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Show error toasts for mutations
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  });
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Memoize the query client to prevent recreation on every render
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>{children}</RoleProvider>
      </AuthProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}

// Lightweight providers for dashboard scope only (no AuthProvider)
export function DashboardProviders({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>{children}</RoleProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
