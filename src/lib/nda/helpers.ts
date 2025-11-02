import type { NdaAgreementSummary, NdaRiskLevel, NdaStatus } from '@/types/nda';

export const getNdaStatusCounts = (
  agreements: NdaAgreementSummary[]
): Record<'total' | NdaStatus, number> =>
  agreements.reduce(
    (acc, nda) => {
      acc.total += 1;
      acc[nda.status] = (acc[nda.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, signed: 0, pending: 0, expired: 0, declined: 0 } as Record<'total' | NdaStatus, number>
  );

const toTime = (value?: string | null) => {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

export const getUpcomingExpirations = (
  agreements: NdaAgreementSummary[],
  limit = 3
) =>
  agreements
    .filter((nda) => nda.expiresDate)
    .filter((nda) => toTime(nda.expiresDate) >= Date.now())
    .sort((a, b) => toTime(a.expiresDate) - toTime(b.expiresDate))
    .slice(0, limit);

export const getExpiringSoonCount = (agreements: NdaAgreementSummary[], withinDays = 30) => {
  const now = Date.now();
  const threshold = now + withinDays * 24 * 60 * 60 * 1000;
  return agreements.filter((nda) => {
    const time = toTime(nda.expiresDate);
    return time >= now && time <= threshold;
  }).length;
};

export const ndaRiskCopy: Record<NdaRiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
