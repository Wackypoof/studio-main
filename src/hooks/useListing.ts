import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { notFound } from 'next/navigation';
import type { ListingDetails, ListingFinancialSnapshot } from '@/lib/types';

interface UseListingOptions {
  /** Whether to enable automatic data fetching */
  enabled?: boolean;
  /** Callback for successful fetch */
  onSuccess?: (listing: ListingDetails) => void;
  /** Callback for error handling */
  onError?: (error: Error) => void;
}

interface UseListingReturn {
  /** The fetched listing data */
  listing: ListingDetails | null;
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
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const normalizedId = useMemo(() => {
    if (!id) return null;
    return typeof id === 'string' ? id : id.id;
  }, [id]);

  const fetchListing = useCallback(async () => {
    if (!normalizedId) {
      setListing(null);
      setIsLoading(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/listings/${normalizedId}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (response.status === 404) {
        notFound();
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch listing');
      }

      const data = await response.json();
      const listingData = data?.listing as ListingDetails | undefined;

      if (!controller.signal.aborted) {
        if (!listingData) {
          notFound();
        } else {
          setListing(listingData);
          onSuccess?.(listingData);
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const error = err instanceof Error ? err : new Error('Failed to fetch listing');
      setError(error);
      onError?.(error);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [normalizedId, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      fetchListing();
    }
    return () => {
      abortRef.current?.abort();
    };
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
  /** Historical revenue data */
  revenueData: Array<{ year: string; revenue: number }>;
  /** Combined profit and revenue data */
  profitRevenueData: Array<{ year: string; revenue: number; profit: number }>;
  /** Latest year-over-year revenue growth percentage (rounded) */
  yearOverYearGrowth: number | null;
  /** Latest financial snapshot used for calculations */
  latestFinancial: ListingFinancialSnapshot | null;
}

const EMPTY_METRICS: ListingMetrics = {
  profitMargin: 0,
  multiple: 'N/A',
  revenueData: [],
  profitRevenueData: [],
  yearOverYearGrowth: null,
  latestFinancial: null,
};

const formatYearLabel = (
  fiscalYear: number | null | undefined,
  index: number
): string => {
  if (typeof fiscalYear === 'number' && Number.isFinite(fiscalYear)) {
    return `FY ${fiscalYear}`;
  }
  return `Period ${index + 1}`;
};

/**
 * Hook to calculate and memoize listing metrics
 * @param listing - The listing to calculate metrics for
 * @returns Memoized object containing calculated metrics
 */
export function useListingMetrics(
  listing: ListingDetails | null
): ListingMetrics {
  return useMemo(() => {
    if (!listing) return EMPTY_METRICS;

    const history: ListingFinancialSnapshot[] = Array.isArray(
      listing.financialHistory
    )
      ? [...listing.financialHistory]
      : [];

    if (history.length === 0 && listing.financials) {
      history.push(listing.financials);
    }

    if (history.length === 0) {
      history.push({
        fiscalYear: new Date(listing.createdAt).getFullYear(),
        currency: listing.financials?.currency ?? null,
        revenue: listing.revenue_t12m,
        profit: listing.profit_t12m,
        assets: listing.financials?.assets ?? null,
        askingPrice: listing.asking_price,
        valuationMultiple: listing.financials?.valuationMultiple ?? null,
        growthRate: listing.financials?.growthRate ?? null,
      });
    }

    const sortedHistory = history.sort((a, b) => {
      const aYear = a.fiscalYear ?? Number.MIN_SAFE_INTEGER;
      const bYear = b.fiscalYear ?? Number.MIN_SAFE_INTEGER;
      return aYear - bYear;
    });

    const latest = sortedHistory[sortedHistory.length - 1] ?? null;
    const previous =
      sortedHistory.length > 1
        ? sortedHistory[sortedHistory.length - 2]
        : null;

    const revenueData = sortedHistory.map((row, index) => ({
      year: formatYearLabel(row.fiscalYear, index),
      revenue: row.revenue ?? 0,
    }));

    const profitRevenueData = sortedHistory.map((row, index) => ({
      year: formatYearLabel(row.fiscalYear, index),
      revenue: row.revenue ?? 0,
      profit: row.profit ?? 0,
    }));

    const latestRevenue =
      (typeof latest?.revenue === 'number' ? latest.revenue : null) ??
      listing.revenue_t12m ??
      0;
    const latestProfit =
      (typeof latest?.profit === 'number' ? latest.profit : null) ??
      listing.profit_t12m ??
      0;

    const profitMargin =
      latestRevenue > 0
        ? Math.round((latestProfit / latestRevenue) * 100)
        : 0;

    let multiple = 'N/A';
    const valuationMultiple =
      (typeof latest?.valuationMultiple === 'number'
        ? latest.valuationMultiple
        : null) ??
      (typeof listing.financials?.valuationMultiple === 'number'
        ? listing.financials.valuationMultiple
        : null);

    if (
      typeof valuationMultiple === 'number' &&
      Number.isFinite(valuationMultiple) &&
      valuationMultiple > 0
    ) {
      multiple = valuationMultiple.toFixed(1);
    } else if (latestProfit > 0 && listing.asking_price > 0) {
      multiple = (listing.asking_price / latestProfit).toFixed(1);
    }

    let yearOverYearGrowth: number | null = null;
    if (previous && typeof previous.revenue === 'number' && previous.revenue > 0) {
      yearOverYearGrowth = Math.round(
        ((latestRevenue - previous.revenue) / previous.revenue) * 100
      );
    } else if (
      typeof latest?.growthRate === 'number' &&
      Number.isFinite(latest.growthRate)
    ) {
      yearOverYearGrowth = Math.round(latest.growthRate);
    }

    return {
      profitMargin,
      multiple,
      revenueData,
      profitRevenueData,
      yearOverYearGrowth,
      latestFinancial: latest,
    };
  }, [listing]);
}
