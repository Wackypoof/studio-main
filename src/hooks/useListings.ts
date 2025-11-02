import { useQuery } from '@tanstack/react-query';
import type { Listing } from '@/lib/types';

interface UseListingsOptions {
  scope?: 'mine' | 'public';
  status?: string;
  search?: string;
  enabled?: boolean;
}

interface ListingsResponse {
  listings: Listing[];
  count: number;
  hasMore: boolean;
}

interface UseListingsResult {
  listings: Listing[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  count: number;
  hasMore: boolean;
}

const fetchListings = async (
  scope: string,
  status?: string,
  search?: string
): Promise<ListingsResponse> => {
  const params = new URLSearchParams({ scope });
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await fetch(`/api/listings?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch listings');
  }

  const data = await response.json();
  return {
    listings: Array.isArray(data.listings) ? data.listings : [],
    count: typeof data.count === 'number' ? data.count : 0,
    hasMore: Boolean(data.hasMore),
  };
};

export function useListings(options: UseListingsOptions = {}): UseListingsResult {
  const { scope = 'mine', status, search, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['listings', scope, status, search],
    queryFn: () => fetchListings(scope, status, search),
    enabled,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  return {
    listings: data?.listings ?? [],
    isLoading,
    error: error as Error | null,
    refetch,
    count: data?.count ?? 0,
    hasMore: data?.hasMore ?? false,
  };
}
