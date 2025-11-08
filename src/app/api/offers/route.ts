import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mapListingToResponse } from '@/lib/listings/helpers';
import type { Database, Tables, Views } from '@/types/db';

const DEFAULT_LIMIT = 50;
const FALLBACK_EMPTY_RESPONSE = {
  offers: [],
  count: 0,
  hasMore: false,
};

const SUPABASE_IGNORABLE_ERROR_CODES = new Set(['42P01', '42501']);

const isIgnorableSupabaseError = (error: unknown): error is { code?: string; message?: string } => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error ? (error as Record<string, unknown>).code : undefined;
  return typeof code === 'string' && SUPABASE_IGNORABLE_ERROR_CODES.has(code);
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') ?? 'buyer';
    const limitParam = Number.parseInt(
      url.searchParams.get('limit') ?? `${DEFAULT_LIMIT}`,
      10
    );
    const offsetParam = Number.parseInt(
      url.searchParams.get('offset') ?? '0',
      10
    );

    const limit = Number.isFinite(limitParam)
      ? Math.max(1, Math.min(DEFAULT_LIMIT, limitParam))
      : DEFAULT_LIMIT;
    const offset = Number.isFinite(offsetParam)
      ? Math.max(0, offsetParam)
      : 0;

    const statusFilters = url
      .searchParams
      .getAll('status')
      .flatMap((value) =>
        value
          .split(',')
          .map((status) => status.trim())
          .filter(Boolean)
      );

    let query = supabase
      .from('offers')
      .select(
        `
          id,
          listing_id,
          buyer_id,
          seller_id,
          offer_amount,
          listing_price,
          status,
          message,
          expires_at,
          created_at,
          updated_at,
          listing:listings(*),
          buyer:profiles(id, full_name, avatar_url),
          seller:profiles(id, full_name, avatar_url)
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (scope === 'buyer') {
      query = query.eq('buyer_id', user.id);
    } else if (scope === 'seller') {
      query = query.eq('seller_id', user.id);
    } else if (scope === 'listing') {
      const listingId = url.searchParams.get('listingId');
      if (!listingId) {
        return NextResponse.json(
          { error: 'listingId is required for listing scope' },
          { status: 400 }
        );
      }
      query = query.eq('listing_id', listingId);
    } else {
      return NextResponse.json({ error: 'Invalid scope' }, { status: 400 });
    }

    if (statusFilters.length > 0) {
      query = query.in(
        'status',
        statusFilters as Database['public']['Enums']['offer_status'][]
      );
    }

    const { data, error, count } = await query;

    if (error) {
      if (isIgnorableSupabaseError(error)) {
        console.warn(
          'Offers table unavailable or restricted, returning empty dataset:',
          error.message ?? error
        );
        return NextResponse.json(FALLBACK_EMPTY_RESPONSE);
      }

      console.error('Failed to fetch offers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      );
    }

    const offers = data ?? [];
    const listingIds = offers
      .map((offer) => offer.listing?.id)
      .filter((id): id is string => Boolean(id));

    let financialMap = new Map<string, Views<'listing_latest_financials'> | null>();

    if (listingIds.length > 0) {
      const uniqueListingIds = Array.from(new Set(listingIds));
      const { data: financialRows, error: financialError } = await supabase
        .from('listing_latest_financials')
        .select('*')
        .in('listing_id', uniqueListingIds);

      if (financialError) {
        if (isIgnorableSupabaseError(financialError)) {
          console.warn(
            'Listing financials view unavailable or restricted while loading offers, continuing without financial enrichment:',
            financialError.message ?? financialError
          );
        } else {
          console.error(
            'Failed to fetch listing financials for offers:',
            financialError
          );
          return NextResponse.json(
            { error: 'Failed to fetch offers' },
            { status: 500 }
          );
        }
      } else if (financialRows) {
        financialMap = new Map(
          financialRows.map((row) => [row.listing_id ?? '', row])
        );
      }
    }

    const formatted = offers.map((offer) => {
      const listingRow = offer.listing as Tables<'listings'> | null;
      const listing =
        listingRow != null
          ? mapListingToResponse(listingRow, financialMap.get(listingRow.id))
          : null;

      return {
        id: offer.id,
        listingId: offer.listing_id,
        buyerId: offer.buyer_id,
        sellerId: offer.seller_id,
        status: offer.status,
        offerAmount: offer.offer_amount,
        listingPrice:
          offer.listing_price ?? listing?.financials?.askingPrice ?? null,
        message: offer.message,
        expiresAt: offer.expires_at,
        createdAt: offer.created_at,
        updatedAt: offer.updated_at,
        listing,
        buyer: offer.buyer ?? null,
        seller: offer.seller ?? null,
      };
    });

    const total = count ?? formatted.length;
    const hasMore = offset + formatted.length < total;

    return NextResponse.json({
      offers: formatted,
      count: total,
      hasMore,
    });
  } catch (error) {
    console.error('Error in offers GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
