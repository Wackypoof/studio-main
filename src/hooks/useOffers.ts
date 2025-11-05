import { useQuery } from '@tanstack/react-query';

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'withdrawn';

export interface OfferListing {
  id: string;
  headline: string;
  teaser: string;
  vertical: string;
  location_area: string;
  status: string;
  asking_price: number;
  financials?: {
    askingPrice?: number | null;
  } | null;
}

export interface OfferParticipant {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
}

export interface OfferSummary {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: OfferStatus;
  offerAmount: number;
  listingPrice: number | null;
  message: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  listing: OfferListing | null;
  buyer: OfferParticipant | null;
  seller: OfferParticipant | null;
}

interface OffersResponse {
  offers: OfferSummary[];
  count: number;
  hasMore: boolean;
}

interface UseOffersOptions {
  scope?: 'buyer' | 'seller';
  statuses?: OfferStatus[];
  enabled?: boolean;
}

const fetchOffers = async (
  scope: 'buyer' | 'seller',
  statuses?: OfferStatus[]
): Promise<OffersResponse> => {
  const params = new URLSearchParams({ scope });
  if (statuses && statuses.length > 0) {
    params.append('status', statuses.join(','));
  }

  const response = await fetch(`/api/offers?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch offers');
  }

  return response.json();
};

export function useOffers(options: UseOffersOptions = {}) {
  const { scope = 'buyer', statuses, enabled = true } = options;

  return useQuery({
    queryKey: ['offers', scope, statuses?.join(',')],
    queryFn: () => fetchOffers(scope, statuses),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
