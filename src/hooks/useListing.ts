import { useState, useEffect, useMemo, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { exampleListings } from '@/lib/example-listings';
import type { Listing } from '@/lib/types';

interface UseListingOptions {
  /** Whether to enable automatic data fetching */
  enabled?: boolean;
  /** Callback for successful fetch */
  onSuccess?: (listing: Listing) => void;
  /** Callback for error handling */
  onError?: (error: Error) => void;
}

interface UseListingReturn {
  /** The fetched listing data */
  listing: Listing | null;
  /** Whether the data is currently being fetched */
  isLoading: boolean;
  /** Any error that occurred during fetching */
  error: Error | null;
  /** Function to manually refetch the listing */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage listing data with TypeScript support and performance optimizations
 * @param id - The ID of the listing to fetch (string or object with id property for Next.js 13+)
 * @param options - Configuration options for the hook
 * @returns Object containing listing data, loading state, error, and refetch function
 */
export function useListing(
  id: string | { id: string } | null | undefined,
  options: UseListingOptions = {}
): UseListingReturn {
  const { enabled = true, onSuccess, onError } = options;
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const normalizedId = useMemo(() => {
    if (!id) return null;
    const idValue = typeof id === 'string' ? id : id.id;
    return idValue.startsWith('listing-') ? idValue : `listing-${idValue}`;
  }, [id]);

  const fetchListing = useCallback(async () => {
    if (!normalizedId) {
      setListing(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with a small delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const listingData = exampleListings.find(l => l.id === normalizedId);
      
      if (!listingData) {
        notFound();
      }
      
      setListing(listingData);
      onSuccess?.(listingData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch listing');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [normalizedId, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      fetchListing();
    }
  }, [enabled, fetchListing]);

  return { 
    listing, 
    isLoading, 
    error,
    refetch: fetchListing
  };
}

interface ListingMetrics {
  /** Profit margin as a percentage (0-100) */
  profitMargin: number;
  /** Multiple of profit to asking price (as string for display) */
  multiple: string;
  /** Historical and projected revenue data */
  revenueData: Array<{ year: string; revenue: number }>;
  /** Combined profit and revenue data */
  profitRevenueData: Array<{ year: string; revenue: number; profit: number }>;
}

const EMPTY_METRICS: ListingMetrics = {
  profitMargin: 0,
  multiple: 'N/A',
  revenueData: [],
  profitRevenueData: []
};

/**
 * Hook to calculate and memoize listing metrics
 * @param listing - The listing to calculate metrics for
 * @returns Memoized object containing calculated metrics
 */
export function useListingMetrics(listing: Listing | null): ListingMetrics {
  return useMemo(() => {
    if (!listing) return EMPTY_METRICS;

    const profitMargin = listing.revenue_t12m > 0 
      ? Math.round((listing.profit_t12m / listing.revenue_t12m) * 100)
      : 0;

    const multiple = listing.profit_t12m > 0 
      ? (listing.asking_price / listing.profit_t12m).toFixed(1)
      : 'N/A';

    const baseYear = new Date().getFullYear();
    
    const revenueData = [
      { year: String(baseYear - 3), revenue: listing.revenue_t12m * 0.6 },
      { year: String(baseYear - 2), revenue: listing.revenue_t12m * 0.8 },
      { year: String(baseYear - 1), revenue: listing.revenue_t12m },
      { year: String(baseYear), revenue: listing.revenue_t12m * 1.2 }
    ];

    const profitRevenueData = [
      { 
        year: String(baseYear - 3),
        revenue: listing.revenue_t12m * 0.6,
        profit: (listing.revenue_t12m * 0.6 * profitMargin/100) * 0.9
      },
      { 
        year: String(baseYear - 2),
        revenue: listing.revenue_t12m * 0.8,
        profit: (listing.revenue_t12m * 0.8 * profitMargin/100) * 0.95
      },
      { 
        year: String(baseYear - 1),
        revenue: listing.revenue_t12m,
        profit: listing.profit_t12m
      },
      { 
        year: String(baseYear),
        revenue: listing.revenue_t12m * 1.2,
        profit: (listing.revenue_t12m * 1.2 * profitMargin/100) * 1.05
      }
    ];

    return {
      profitMargin,
      multiple,
      revenueData,
      profitRevenueData
    };
  }, [listing]); // Close useMemo with dependency array
}
