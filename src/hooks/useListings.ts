import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Listing } from '@/lib/types';

interface UseListingsOptions {
  scope?: 'mine' | 'public';
  enabled?: boolean;
}

interface UseListingsResult {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  count: number;
  hasMore: boolean;
}

export function useListings(options: UseListingsOptions = {}): UseListingsResult {
  const { scope = 'mine', enabled = true } = options;
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchListings = useCallback(async () => {
    if (!enabled) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ scope });
      const response = await fetch(`/api/listings?${params.toString()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch listings');
      }

      const data = await response.json();
      if (!controller.signal.aborted) {
        setListings(Array.isArray(data.listings) ? data.listings : []);
        setCount(typeof data.count === 'number' ? data.count : 0);
        setHasMore(Boolean(data.hasMore));
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to fetch listings'));
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [scope, enabled]);

  useEffect(() => {
    if (!enabled) return;
    void fetchListings();
    return () => {
      abortRef.current?.abort();
    };
  }, [enabled, fetchListings]);

  const refetch = useCallback(async () => {
    await fetchListings();
  }, [fetchListings]);

  return useMemo(
    () => ({
      listings,
      isLoading,
      error,
      refetch,
      count,
      hasMore,
    }),
    [listings, isLoading, error, refetch, count, hasMore]
  );
}
