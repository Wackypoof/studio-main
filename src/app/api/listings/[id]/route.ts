import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  listingUpdateSchema,
  mapListingToResponse,
  parseStatusInput,
} from '@/lib/listings/helpers';
import type { Database } from '@/types/supabase';

const shouldApplyFinancials = (
  financials: Record<string, unknown> | null | undefined
) => {
  if (!financials) return false;
  return Object.values(financials).some(
    (value) => value !== null && value !== undefined
  );
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
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

    const { data: financialRow } = await supabase
      .from('listing_latest_financials')
      .select('*')
      .eq('listing_id', listing.id)
      .maybeSingle();

    const response = mapListingToResponse(listing, financialRow ?? undefined);

    return NextResponse.json({ listing: response });
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
  { params }: { params: { id: string } }
) {
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
      .eq('id', params.id)
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
        .eq('id', params.id)
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

    const { data: financialRow } = await supabase
      .from('listing_latest_financials')
      .select('*')
      .eq('listing_id', updatedListing.id)
      .maybeSingle();

    const response = mapListingToResponse(
      updatedListing,
      financialRow ?? undefined
    );

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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .eq('id', params.id)
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
      .eq('id', params.id);

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
