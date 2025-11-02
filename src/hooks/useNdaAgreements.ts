import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NdaAgreementSummary } from '@/types/nda';

interface UseNdaAgreementsOptions {
  role?: 'buyer' | 'seller';
}

interface AgreementsResponse {
  agreements: NdaAgreementSummary[];
}

interface RenewalResponse {
  agreement: NdaAgreementSummary;
}

const fetchAgreements = async (role: 'buyer' | 'seller') => {
  const params = new URLSearchParams();
  params.set('role', role);
  const response = await fetch(`/api/ndas?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? 'Failed to load NDAs');
  }

  const data = (await response.json()) as AgreementsResponse;
  return Array.isArray(data.agreements) ? data.agreements : [];
};

const requestRenewal = async (agreementId: string) => {
  const response = await fetch(`/api/ndas/${agreementId}/renewal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? 'Unable to request renewal');
  }

  const data = (await response.json()) as RenewalResponse;
  return data.agreement;
};

export function useNdaAgreements(options: UseNdaAgreementsOptions = {}) {
  const role = options.role ?? 'buyer';
  const queryClient = useQueryClient();

  const agreementsQuery = useQuery({
    queryKey: ['nda-agreements', role],
    queryFn: () => fetchAgreements(role),
  });

  const renewalMutation = useMutation({
    mutationFn: requestRenewal,
    onSuccess: (updatedAgreement) => {
      queryClient.setQueryData<NdaAgreementSummary[] | undefined>(
        ['nda-agreements', role],
        (current) =>
          current?.map((item) => (item.id === updatedAgreement.id ? updatedAgreement : item)) ??
          []
      );
    },
  });

  return {
    agreements: agreementsQuery.data ?? [],
    isLoading: agreementsQuery.isLoading,
    isError: agreementsQuery.isError,
    error: agreementsQuery.error,
    refetch: agreementsQuery.refetch,
    requestRenewal: renewalMutation.mutateAsync,
    isRenewalLoading: renewalMutation.isPending,
  };
}
