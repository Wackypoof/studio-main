import { useQuery } from '@tanstack/react-query';

export type BuyerLeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type BuyerLeadSource =
  | 'website'
  | 'referral'
  | 'social_media'
  | 'email'
  | 'phone'
  | 'event'
  | 'other';

export interface BuyerLead {
  id: string;
  listingId: string | null;
  listingName: string | null;
  sellerId: string;
  buyerId: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  status: BuyerLeadStatus;
  source: BuyerLeadSource;
  notes: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  buyerAvatar: string | null;
}

interface BuyerLeadsResponse {
  leads: BuyerLead[];
  count: number;
  hasMore: boolean;
  statusCounts: Record<string, number>;
}

interface UseBuyerLeadsOptions {
  listingId?: string;
  statuses?: BuyerLeadStatus[];
  sources?: BuyerLeadSource[];
  enabled?: boolean;
}

const fetchBuyerLeads = async (
  options: UseBuyerLeadsOptions
): Promise<BuyerLeadsResponse> => {
  const params = new URLSearchParams();

  if (options.listingId) {
    params.append('listing', options.listingId);
  }

  if (options.statuses && options.statuses.length > 0) {
    params.append('status', options.statuses.join(','));
  }

  if (options.sources && options.sources.length > 0) {
    params.append('source', options.sources.join(','));
  }

  const response = await fetch(
    `/api/leads${params.toString() ? `?${params.toString()}` : ''}`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch leads');
  }

  return response.json();
};

export function useBuyerLeads(options: UseBuyerLeadsOptions = {}) {
  const { enabled = true } = options;
  const queryKey = [
    'buyer-leads',
    options.listingId ?? 'all',
    options.statuses?.join(',') ?? '',
    options.sources?.join(',') ?? '',
  ];

  return useQuery({
    queryKey,
    queryFn: () => fetchBuyerLeads(options),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
