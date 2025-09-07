import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { exampleListings } from '@/lib/example-listings';
import type { Listing } from '@/lib/types';

/**
 * Custom hook to fetch and manage listing data
 * @param id - The ID of the listing to fetch
 * @returns Object containing listing data and loading state
 */
export function useListing(id: string | { id: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with a small delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Handle both string ID and params object from Next.js 13+
        const listingId = typeof id === 'string' 
          ? id.startsWith('listing-') ? id : `listing-${id}`
          : `listing-${id.id}`;
        
        const listingData = exampleListings.find(l => l.id === listingId);
        
        if (!listingData) {
          notFound();
        }
        
        setListing(listingData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch listing'));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  return { listing, isLoading, error };
}

/**
 * Hook to get listing metrics (profit margin, multiple, etc.)
 * @param listing - The listing to calculate metrics for
 * @returns Object containing calculated metrics
 */
export function useListingMetrics(listing: Listing | null) {
  if (!listing) {
    return {
      profitMargin: 0,
      multiple: 'N/A',
      revenueData: [],
      profitRevenueData: []
    };
  }

  const profitMargin = listing.revenue_t12m > 0 
    ? Math.round((listing.profit_t12m / listing.revenue_t12m) * 100)
    : 0;

  const multiple = listing.profit_t12m > 0 
    ? (listing.asking_price / listing.profit_t12m).toFixed(1)
    : 'N/A';

  const revenueData = [
    { year: '2021', revenue: listing.revenue_t12m * 0.6 },
    { year: '2022', revenue: listing.revenue_t12m * 0.8 },
    { year: '2023', revenue: listing.revenue_t12m },
    { year: '2024', revenue: listing.revenue_t12m * 1.2 }
  ];

  const profitRevenueData = [
    { 
      year: '2021', 
      revenue: listing.revenue_t12m * 0.6,
      profit: (listing.revenue_t12m * 0.6 * profitMargin/100) * 0.9
    },
    { 
      year: '2022', 
      revenue: listing.revenue_t12m * 0.8,
      profit: (listing.revenue_t12m * 0.8 * profitMargin/100) * 0.95
    },
    { 
      year: '2023', 
      revenue: listing.revenue_t12m,
      profit: listing.profit_t12m
    },
    { 
      year: '2024', 
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
}
