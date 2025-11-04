import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  listingUpdateSchema,
  mapListingToResponse,
  parseStatusInput,
  toFinancialSnapshot,
} from '@/lib/listings/helpers';
import type {
  ListingDetails,
  ListingDocumentSummary,
  ListingMeta,
  ListingTrafficMetrics,
  ListingTrafficPoint,
  ListingTrafficSource,
  ListingTrafficSummary,
} from '@/lib/types';
import type { Database } from '@/types/db';

const shouldApplyFinancials = (
  financials: Record<string, unknown> | null | undefined
) => {
  if (!financials) return false;
  return Object.values(financials).some(
    (value) => value !== null && value !== undefined
  );
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type ListingRow = Database['public']['Tables']['listings']['Row'];
type DocumentRow = Database['public']['Tables']['listing_documents']['Row'];

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeTrafficHistory = (meta: ListingMeta): ListingTrafficPoint[] => {
  const historyRaw =
    (Array.isArray(meta.traffic_history)
      ? meta.traffic_history
      : Array.isArray(meta.trafficHistory)
      ? meta.trafficHistory
      : []) ?? [];

  return historyRaw
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null;
      const payload = entry as Record<string, unknown>;
      const periodCandidate =
        typeof payload.period === 'string' && payload.period.trim()
          ? payload.period
          : typeof payload.month === 'string' && payload.month.trim()
          ? payload.month
          : typeof payload.label === 'string' && payload.label.trim()
          ? payload.label
          : `Period ${index + 1}`;
      const visitorsRaw =
        payload.visitors ??
        payload.value ??
        payload.count ??
        payload.visits ??
        0;
      const visitorsNumber =
        typeof visitorsRaw === 'number'
          ? visitorsRaw
          : typeof visitorsRaw === 'string'
          ? Number(visitorsRaw)
          : 0;

      return {
        period: periodCandidate,
        visitors: Number.isFinite(visitorsNumber) ? visitorsNumber : 0,
      };
    })
    .filter((point): point is ListingTrafficPoint => Boolean(point));
};

const normalizeTrafficSources = (
  meta: ListingMeta
): ListingTrafficSource[] => {
  const sourcesRaw =
    (Array.isArray(meta.traffic_sources)
      ? meta.traffic_sources
      : Array.isArray(meta.trafficSources)
      ? meta.trafficSources
      : []) ?? [];

  return sourcesRaw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const payload = entry as Record<string, unknown>;
      const nameCandidate =
        typeof payload.source === 'string' && payload.source.trim()
          ? payload.source
          : typeof payload.name === 'string' && payload.name.trim()
          ? payload.name
          : 'Other';

      const valueRaw =
        payload.value ??
        payload.percentage ??
        payload.percent ??
        payload.share ??
        0;
      const valueNumber =
        typeof valueRaw === 'number'
          ? valueRaw
          : typeof valueRaw === 'string'
          ? Number(valueRaw)
          : 0;

      return {
        source: nameCandidate,
        value: Number.isFinite(valueNumber) ? valueNumber : 0,
      };
    })
    .filter((source): source is ListingTrafficSource => Boolean(source));
};

const normalizeTrafficSummary = (
  meta: ListingMeta,
  history: ListingTrafficPoint[]
): ListingTrafficSummary => {
  const summaryRaw =
    (meta.traffic_summary && typeof meta.traffic_summary === 'object'
      ? meta.traffic_summary
      : meta.trafficSummary && typeof meta.trafficSummary === 'object'
      ? meta.trafficSummary
      : {}) as Record<string, unknown>;

  const totalProvided =
    summaryRaw.totalVisitors ?? summaryRaw.total_visitors ?? null;
  const pagesPerVisitProvided =
    summaryRaw.pagesPerVisit ?? summaryRaw.pages_per_visit ?? null;
  const sessionDurationProvided =
    summaryRaw.avgSessionDurationMinutes ??
    summaryRaw.avg_session_duration_minutes ??
    null;

  const totalVisitors =
    toNumberOrNull(totalProvided) ??
    (history.length > 0
      ? history.reduce((acc, item) => acc + item.visitors, 0)
      : null);

  return {
    totalVisitors,
    pagesPerVisit: toNumberOrNull(pagesPerVisitProvided),
    avgSessionDurationMinutes: toNumberOrNull(sessionDurationProvided),
  };
};

const mapDocumentRow = (row: DocumentRow): ListingDocumentSummary => ({
  id: row.id,
  docType: row.doc_type,
  status: row.status,
  fileName: row.file_name,
  fileSize: row.file_size,
  storagePath: row.storage_path,
  uploadedBy: row.uploaded_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  verifiedAt: row.verified_at,
  verifiedBy: row.verified_by,
});

const assembleListingDetails = async (
  supabase: SupabaseClient,
  listing: ListingRow
): Promise<ListingDetails> => {
  const [latestFinancialResult, historyResult, documentsResult] =
    await Promise.all([
      supabase
        .from('listing_latest_financials')
        .select('*')
        .eq('listing_id', listing.id)
        .maybeSingle(),
      supabase
        .from('listing_financials')
        .select('*')
        .eq('listing_id', listing.id)
        .order('fiscal_year', { ascending: true }),
      supabase
        .from('listing_documents')
        .select('*')
        .eq('listing_id', listing.id)
        .order('created_at', { ascending: false }),
    ]);

  if (latestFinancialResult.error) {
    console.error(
      'Failed to fetch listing financial snapshot:',
      latestFinancialResult.error
    );
  }

  if (historyResult.error) {
    console.error(
      'Failed to fetch listing financial history:',
      historyResult.error
    );
  }

  if (documentsResult.error) {
    console.error(
      'Failed to fetch listing documents:',
      documentsResult.error
    );
  }

  const base = mapListingToResponse(
    listing,
    latestFinancialResult.data ?? undefined
  );

  const financialHistoryRows = historyResult.error
    ? []
    : (historyResult.data ?? []);

  const financialHistory = financialHistoryRows
    .map((row) => toFinancialSnapshot(row))
    .filter(
      (snapshot): snapshot is NonNullable<ReturnType<typeof toFinancialSnapshot>> =>
        Boolean(snapshot)
    );

  const documentRows = documentsResult.error
    ? []
    : (documentsResult.data ?? []);
  const documents = documentRows.map(mapDocumentRow);

  const trafficHistory = normalizeTrafficHistory(base.meta);
  const trafficSources = normalizeTrafficSources(base.meta);
  const trafficSummary = normalizeTrafficSummary(base.meta, trafficHistory);

  const traffic: ListingTrafficMetrics = {
    history: trafficHistory,
    sources: trafficSources,
    summary: trafficSummary,
  };

  return {
    ...base,
    financialHistory,
    documents,
    traffic,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch listing:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listing' },
        { status: 500 }
      );
    }

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const listingDetails = await assembleListingDetails(supabase, listing);

    return NextResponse.json({ listing: listingDetails });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('Failed to load listing for update:', fetchError);
      return NextResponse.json(
        { error: 'Failed to load listing' },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = listingUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { financials, status, meta, ...rest } = parsed.data;

    const updatePayload: Database['public']['Tables']['listings']['Update'] =
      {};

    if (Object.keys(rest).length > 0) {
      Object.assign(updatePayload, rest);
    }

    if (typeof meta !== 'undefined') {
      updatePayload.meta = meta ?? null;
    }

    const statusDb = parseStatusInput(status ?? null);
    if (statusDb) {
      updatePayload.status = statusDb;
    }

    let updatedListing = existing;

    if (Object.keys(updatePayload).length > 0) {
      const { data: updateResult, error: updateError } = await supabase
        .from('listings')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single();

      if (updateError || !updateResult) {
        console.error('Failed to update listing:', updateError);
        return NextResponse.json(
          { error: 'Failed to update listing' },
          { status: 500 }
        );
      }

      updatedListing = updateResult;
    }

    if (shouldApplyFinancials(financials)) {
      const {
        fiscal_year,
        currency,
        revenue,
        profit,
        assets,
        asking_price,
        valuation_multiple,
        growth_rate,
      } = financials ?? {};

      const payload: Database['public']['Tables']['listing_financials']['Insert'] =
        {
          listing_id: updatedListing.id,
          fiscal_year:
            (typeof fiscal_year === 'number' && Number.isFinite(fiscal_year)
              ? fiscal_year
              : new Date().getFullYear()),
          currency: currency ?? undefined,
          revenue: revenue ?? undefined,
          profit: profit ?? undefined,
          assets: assets ?? undefined,
          asking_price: asking_price ?? undefined,
          valuation_multiple: valuation_multiple ?? undefined,
          growth_rate: growth_rate ?? undefined,
        };

      const { error: financialError } = await supabase
        .from('listing_financials')
        .upsert(payload, { onConflict: 'listing_id,fiscal_year' });

      if (financialError) {
        console.error('Failed to update financials:', financialError);
        return NextResponse.json(
          { error: 'Listing updated but financial data failed to save' },
          { status: 500 }
        );
      }
    }

    const response = await assembleListingDetails(supabase, updatedListing);

    return NextResponse.json({ listing: response });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: existing, error } = await supabase
      .from('listings')
      .select('id, owner_id')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Failed to load listing for delete:', error);
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      const isRlsViolation =
        deleteError.code === '42501' ||
        /violates row-level security/i.test(deleteError.message);
      if (isRlsViolation) {
        return NextResponse.json(
          { error: 'Cannot delete listing in its current state' },
          { status: 403 }
        );
      }

      console.error('Failed to delete listing:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
