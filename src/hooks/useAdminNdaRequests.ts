import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NdaApprovalRequestSummary, NdaRequestStatus } from '@/types/nda';

interface UseAdminNdaRequestsOptions {
  status?: NdaRequestStatus | 'all';
}

interface RequestsResponse {
  requests: NdaApprovalRequestSummary[];
}

interface DecisionPayload {
  id: string;
  status: Extract<NdaRequestStatus, 'approved' | 'declined'>;
  note?: string;
}

interface DecisionResponse {
  request: NdaApprovalRequestSummary;
}

const fetchRequests = async (status?: NdaRequestStatus | 'all') => {
  const params = new URLSearchParams();
  if (status && status !== 'all') {
    params.set('status', status);
  }

  const response = await fetch(
    `/api/admin/nda-requests${params.size > 0 ? `?${params.toString()}` : ''}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? 'Failed to load NDA requests');
  }

  const data = (await response.json()) as RequestsResponse;
  return Array.isArray(data.requests) ? data.requests : [];
};

const sendDecision = async ({ id, status, note }: DecisionPayload) => {
  const response = await fetch(`/api/admin/nda-requests/${id}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, note }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? 'Failed to update NDA request');
  }

  const data = (await response.json()) as DecisionResponse;
  return data.request;
};

export function useAdminNdaRequests(options: UseAdminNdaRequestsOptions = {}) {
  const status = options.status ?? 'pending';
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ['admin-nda-requests', status],
    queryFn: () => fetchRequests(status),
  });

  const decisionMutation = useMutation({
    mutationFn: sendDecision,
    onSuccess: (updatedRequest) => {
      queryClient.setQueryData<NdaApprovalRequestSummary[] | undefined>(
        ['admin-nda-requests', status],
        (current) =>
          current?.map((item) => (item.id === updatedRequest.id ? updatedRequest : item)) ?? []
      );
      // Ensure the item is updated in "all" cache as well
      queryClient.setQueryData<NdaApprovalRequestSummary[] | undefined>(
        ['admin-nda-requests', 'all'],
        (current) =>
          current?.map((item) => (item.id === updatedRequest.id ? updatedRequest : item)) ?? current
      );
    },
  });

  return {
    requests: requestsQuery.data ?? [],
    isLoading: requestsQuery.isLoading,
    isError: requestsQuery.isError,
    error: requestsQuery.error,
    refetch: requestsQuery.refetch,
    decide: decisionMutation.mutateAsync,
    isDeciding: decisionMutation.isPending,
  };
}
