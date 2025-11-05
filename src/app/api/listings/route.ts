import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  listingInsertSchema,
  mapListingToResponse,
  parseStatusInput,
} from '@/lib/listings/helpers';
import type { Database } from '@/types/db';

const MAX_LIMIT = 50;

const sanitizeSearch = (value: string) =>
  value.replace(/[%_]/g, '\\$&').trim();

const shouldApplyFinancials = (
  financials: Record<string, unknown> | null | undefined
) => {
  if (!financials) return false;
  return Object.values(financials).some(
    (value) => value !== null && value !== undefined
  );
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'public';
    const limitParam = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
    const offsetParam = Number.parseInt(url.searchParams.get('offset') ?? '0', 10);
    const limit = Number.isFinite(limitParam)
      ? Math.max(1, Math.min(MAX_LIMIT, limitParam))
      : 20;
    const offset = Number.isFinite(offsetParam) ? Math.max(0, offsetParam) : 0;
    const searchTerm = url.searchParams.get('search')?.trim() ?? '';
    const statusParams = url.searchParams.getAll('status');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const dbStatuses = statusParams
      .flatMap((value) => value.split(','))
      .map((value) => parseStatusInput(value))
      .filter(
        (value): value is Database['public']['Enums']['listing_status'] =>
          Boolean(value)
      );

    if (scope === 'saved') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { data: savedRows, error: savedError } = await supabase
        .from('buyer_saved_listings')
        .select('listing_id, created_at')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (savedError) {
        console.error('Failed to fetch saved listings:', savedError);
        return NextResponse.json(
          { error: 'Failed to fetch saved listings' },
          { status: 500 }
        );
      }

      const savedIds = (savedRows ?? [])
        .map((row) => row.listing_id)
        .filter((value): value is string => Boolean(value));

      if (savedIds.length === 0) {
        return NextResponse.json({
          listings: [],
          count: 0,
          hasMore: false,
        });
      }

      let listingsQuery = supabase
        .from('listings')
        .select('*')
        .in('id', savedIds);

      if (dbStatuses.length > 0) {
        listingsQuery = listingsQuery.in('status', dbStatuses);
      }

      if (searchTerm) {
        const sanitized = sanitizeSearch(searchTerm);
        listingsQuery = listingsQuery.or(
          [
            `name.ilike.%${sanitized}%`,
            `industry.ilike.%${sanitized}%`,
            `city.ilike.%${sanitized}%`,
            `region.ilike.%${sanitized}%`,
          ].join(',')
        );
      }

      const { data: savedListingRows, error: listingsError } = await listingsQuery;

      if (listingsError) {
        console.error('Failed to fetch listings for saved scope:', listingsError);
        return NextResponse.json(
          { error: 'Failed to fetch saved listings' },
          { status: 500 }
        );
      }

      if (!savedListingRows || savedListingRows.length === 0) {
        return NextResponse.json({
          listings: [],
          count: 0,
          hasMore: false,
        });
      }

      const savedDateMap = new Map(
        (savedRows ?? []).map((row) => [row.listing_id, row.created_at])
      );

      const orderMap = new Map(
        (savedRows ?? []).map((row, index) => [row.listing_id, index])
      );

      const sortedListings = savedListingRows
        .filter((row) => savedDateMap.has(row.id))
        .sort((a, b) => {
          const aOrder = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
          const bOrder = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        });

      const total = sortedListings.length;
      const paginatedListings = sortedListings.slice(offset, offset + limit);
      const paginatedIds = paginatedListings.map((row) => row.id);

      let financialMap = new Map<string, any>();

      if (paginatedIds.length > 0) {
        const { data: financialRows, error: financialError } = await supabase
          .from('listing_latest_financials')
          .select('*')
          .in('listing_id', paginatedIds);

        if (financialError) {
          console.error('Failed to fetch financials for saved listings:', financialError);
          return NextResponse.json(
            { error: 'Failed to fetch saved listings' },
            { status: 500 }
          );
        }

        financialMap = new Map(
          (financialRows ?? []).map((row) => [row.listing_id ?? '', row])
        );
      }

      const listings = paginatedListings.map((row) => {
        const listing = mapListingToResponse(row, financialMap.get(row.id));
        return {
          ...listing,
          savedAt: savedDateMap.get(row.id) ?? null,
        };
      });

      const hasMore = offset + listings.length < total;

      return NextResponse.json({ listings, count: total, hasMore });
    }

    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (scope === 'mine') {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query = query.eq('owner_id', user.id);
    }

    if (dbStatuses.length > 0) {
      query = query.in('status', dbStatuses);
    } else if (scope !== 'mine') {
      query = query.eq('status', 'active');
    }

    if (searchTerm) {
      const sanitized = sanitizeSearch(searchTerm);
      query = query.or(
        [
          `name.ilike.%${sanitized}%`,
          `industry.ilike.%${sanitized}%`,
          `city.ilike.%${sanitized}%`,
          `region.ilike.%${sanitized}%`,
        ].join(',')
      );
    }

    const { data: listingRows, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) {
      console.error('Failed to fetch listings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      );
    }

    if (!listingRows || listingRows.length === 0) {
      return NextResponse.json({
        listings: [],
        count: count ?? 0,
        hasMore: false,
      });
    }

    const listingIds = listingRows.map((row) => row.id);
    let financialMap = new Map<string, any>();

    if (listingIds.length > 0) {
      const { data: financialRows, error: financialError } = await supabase
        .from('listing_latest_financials')
        .select('*')
        .in('listing_id', listingIds);

      if (financialError) {
        console.error('Failed to fetch listing financials:', financialError);
        return NextResponse.json(
          { error: 'Failed to fetch listings' },
          { status: 500 }
        );
      }

      financialMap = new Map(
        (financialRows ?? []).map((row) => [row.listing_id, row])
      );
    }

    const listings = listingRows.map((row) =>
      mapListingToResponse(row, financialMap.get(row.id))
    );

    const total = count ?? listings.length;
    const hasMore = offset + listings.length < total;

    return NextResponse.json({ listings, count: total, hasMore });
  } catch (error) {
    console.error('Error in listings GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = listingInsertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { financials, status, meta, ...rest } = parsed.data;
    const statusDb =
      parseStatusInput(status ?? null) ?? ('draft' as const);

    const insertPayload: Database['public']['Tables']['listings']['Insert'] = {
      ...rest,
      owner_id: user.id,
      status: statusDb,
      meta: meta ?? null,
    };

    const { data: newListing, error: insertError } = await supabase
      .from('listings')
      .insert(insertPayload)
      .select('*')
      .single();

    if (insertError || !newListing) {
      console.error('Failed to create listing:', insertError);
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      );
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
          listing_id: newListing.id,
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
        console.error('Failed to upsert financials:', financialError);
        return NextResponse.json(
          {
            error:
              'Listing created but financial data failed to save. Please try again.',
          },
          { status: 500 }
        );
      }
    }

    const { data: financialRow } = await supabase
      .from('listing_latest_financials')
      .select('*')
      .eq('listing_id', newListing.id)
      .maybeSingle();

    const listing = mapListingToResponse(newListing, financialRow ?? undefined);

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
