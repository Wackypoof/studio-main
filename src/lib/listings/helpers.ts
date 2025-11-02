import { z } from 'zod';
import type { Database } from '@/types/db';
import type { Listing, ListingStatus } from '@/lib/types';

type ListingRow = Database['public']['Tables']['listings']['Row'];
type ListingStatusDb = Database['public']['Enums']['listing_status'];
type ListingFinancialRow =
  Database['public']['Views']['listing_latest_financials']['Row'];

const dbToAppStatus: Record<ListingStatusDb, ListingStatus> = {
  draft: 'draft',
  active: 'live',
  sold: 'closed',
  withdrawn: 'paused', // legacy, kept for backward compatibility
  pending: 'pending',
  paused: 'paused',
  under_offer: 'under_offer',
};

const appToDbStatus: Record<ListingStatus, ListingStatusDb> = {
  draft: 'draft',
  pending: 'pending',
  live: 'active',
  paused: 'paused',
  under_offer: 'under_offer',
  closed: 'sold',
};

export type ListingMeta = {
  teaser?: string | null;
  vertical?: string | null;
  location_area?: string | null;
  asking_price_reasoning?: string | null;
  assets_summary?: string | null;
  licences_summary?: string | null;
  lease_summary?: string | null;
  hours_per_week?: number | null;
  market?: string | null;
  verified?: boolean | null;
  avg_response_time_hours?: number | null;
  sellingReason?: Listing['sellingReason'];
  established?: string | null;
  revenue_last_month?: number | string | null;
  profit_last_month?: number | string | null;
};

const isRecord = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const toNumber = (value: number | string | null | undefined): number => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toNullableNumber = (
  value: number | string | null | undefined
): number | null => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeStatus = (status: ListingStatusDb | null | undefined): ListingStatus => {
  if (!status) return 'draft';
  return dbToAppStatus[status] ?? 'draft';
};

const deriveLocation = (row: ListingRow, meta: ListingMeta): string => {
  return (
    meta.location_area ||
    row.city ||
    row.region ||
    row.country ||
    'Unknown'
  );
};

const deriveEstablished = (row: ListingRow, meta: ListingMeta): string => {
  if (meta.established) return meta.established;
  if (typeof row.years_established === 'number' && row.years_established > 0) {
    // Interpret stored value as calendar year if it looks like YYYY, otherwise approximate
    if (row.years_established >= 1900 && row.years_established <= 2500) {
      return new Date(row.years_established, 0, 1).toISOString();
    }
    const year = new Date().getFullYear() - row.years_established;
    return new Date(year, 0, 1).toISOString();
  }
  return row.created_at;
};

const parseMeta = (meta: ListingRow['meta']): ListingMeta => {
  if (!isRecord(meta)) return {};
  return meta as ListingMeta;
};

const numericPreprocess = (schema: z.ZodNumber) =>
  z
    .preprocess((value) => {
      if (value === '' || value === null || value === undefined) return null;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : value;
      }
      return value;
    }, schema.nullable())
    .optional();

export const listingFinancialSchema = z.object({
  fiscal_year: numericPreprocess(z.number().int().min(1900).max(4000)),
  currency: z
    .string()
    .trim()
    .min(3)
    .max(3)
    .transform((value) => value.toUpperCase())
    .optional(),
  revenue: numericPreprocess(z.number().finite()),
  profit: numericPreprocess(z.number().finite()),
  assets: numericPreprocess(z.number().finite()),
  asking_price: numericPreprocess(z.number().finite()),
  valuation_multiple: numericPreprocess(z.number().finite()),
  growth_rate: numericPreprocess(z.number().finite()),
});

export const listingBaseSchema = z.object({
  name: z.string().trim().min(1),
  industry: z.string().trim().min(1),
  subindustry: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  country: z.string().trim().nullable().optional(),
  region: z.string().trim().nullable().optional(),
  city: z.string().trim().nullable().optional(),
  years_established: numericPreprocess(z.number().int().min(0)),
  employees: numericPreprocess(z.number().int().min(0)),
  customers: numericPreprocess(z.number().int().min(0)),
  tags: z.array(z.string().trim()).optional(),
  status: z.string().trim().optional(),
  meta: z.record(z.any()).nullable().optional(),
});

export const listingInsertSchema = listingBaseSchema.extend({
  financials: listingFinancialSchema.nullable().optional(),
});

export const listingUpdateSchema = listingInsertSchema.partial();

export const mapStatusToDb = (status: ListingStatus): ListingStatusDb => {
  return appToDbStatus[status] ?? 'draft';
};

export const parseStatusInput = (
  status: string | null | undefined
): ListingStatusDb | undefined => {
  if (!status) return undefined;
  const normalized = status.trim().toLowerCase();
  const dbValues: ListingStatusDb[] = ['draft', 'active', 'sold', 'withdrawn'];
  if ((dbValues as string[]).includes(normalized)) {
    return normalized as ListingStatusDb;
  }
  const appValues: ListingStatus[] = [
    'draft',
    'pending',
    'live',
    'paused',
    'under_offer',
    'closed',
  ];
  if ((appValues as string[]).includes(normalized)) {
    return mapStatusToDb(normalized as ListingStatus);
  }
  return undefined;
};

export const mapListingRowToListing = (
  row: ListingRow,
  financial: ListingFinancialRow | null | undefined
): Listing => {
  const meta = parseMeta(row.meta);
  const revenue = toNumber(financial?.revenue);
  const profit = toNumber(financial?.profit);
  const askingPrice = toNumber(financial?.asking_price);

  const revenueLastMonth =
    meta.revenue_last_month != null
      ? toNumber(meta.revenue_last_month)
      : revenue;
  const profitLastMonth =
    meta.profit_last_month != null ? toNumber(meta.profit_last_month) : profit;

  return {
    id: row.id,
    userId: row.owner_id,
    status: normalizeStatus(row.status),
    vertical: meta.vertical || row.industry,
    location_area: deriveLocation(row, meta),
    headline: row.name,
    teaser: meta.teaser || row.description || '',
    revenue_t12m: revenue,
    profit_t12m: profit,
    revenue_last_month: revenueLastMonth,
    profit_last_month: profitLastMonth,
    asking_price: askingPrice,
    asking_price_reasoning: meta.asking_price_reasoning || '',
    assets_summary: meta.assets_summary || '',
    licences_summary: meta.licences_summary || '',
    teamSize: row.employees ?? 0,
    staff_count: row.employees ?? undefined,
    established: deriveEstablished(row, meta),
    hoursPerWeek: meta.hours_per_week ?? 0,
    market: meta.market || row.industry,
    lease_summary: meta.lease_summary || '',
    verified: Boolean(meta.verified),
    avg_response_time_hours: meta.avg_response_time_hours ?? undefined,
    sellingReason: meta.sellingReason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export type ListingFinancialSnapshot = {
  fiscal_year: number | null;
  currency: string | null;
  revenue: number | null;
  profit: number | null;
  assets: number | null;
  asking_price: number | null;
  valuation_multiple: number | null;
  growth_rate: number | null;
};

export type ListingWithDetails = Listing & {
  raw_status: ListingStatusDb;
  financials: ListingFinancialSnapshot | null;
  meta: ListingMeta;
};

export const mapListingToResponse = (
  row: ListingRow,
  financial: ListingFinancialRow | null | undefined
): ListingWithDetails => {
  const listing = mapListingRowToListing(row, financial);
  const serialized: ListingWithDetails = {
    ...listing,
    raw_status: row.status,
    financials: financial
      ? {
          fiscal_year: financial.fiscal_year,
          currency: financial.currency,
          revenue: toNullableNumber(financial.revenue),
          profit: toNullableNumber(financial.profit),
          assets: toNullableNumber(financial.assets),
          asking_price: toNullableNumber(financial.asking_price),
          valuation_multiple: toNullableNumber(financial.valuation_multiple),
          growth_rate: toNullableNumber(financial.growth_rate),
        }
      : null,
    meta: parseMeta(row.meta),
  };
  return serialized;
};
