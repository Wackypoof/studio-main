import { useQuery } from '@tanstack/react-query';
import type { BuyerDashboardSummaryResponse } from '@/types/dashboard';

const fetchBuyerDashboardSummary = async (): Promise<BuyerDashboardSummaryResponse> => {
  const response = await fetch('/api/dashboard/buyer', {
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? 'Failed to load dashboard data');
  }

  return payload as BuyerDashboardSummaryResponse;
};

export function useBuyerDashboardSummary() {
  return useQuery({
    queryKey: ['buyer-dashboard-summary'],
    queryFn: fetchBuyerDashboardSummary,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
