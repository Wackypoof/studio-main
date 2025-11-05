import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/db';

const DEFAULT_LIMIT = 50;

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
    const listing = url.searchParams.get('listing');
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

    const sourceFilters = url
      .searchParams
      .getAll('source')
      .flatMap((value) =>
        value
          .split(',')
          .map((source) => source.trim())
          .filter(Boolean)
      );

    let query = supabase
      .from('buyer_leads')
      .select(
        `
          id,
          seller_id,
          buyer_id,
          listing_id,
          buyer_email,
          buyer_phone,
          buyer_company,
          buyer_position,
          status,
          source,
          notes,
          last_contacted_at,
          created_at,
          updated_at,
          buyer:profiles(id, full_name, avatar_url),
          listing:listings(id, name)
        `,
        { count: 'exact' }
      )
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (listing) {
      query = query.eq('listing_id', listing);
    }

    if (statusFilters.length > 0) {
      query = query.in(
        'status',
        statusFilters as Database['public']['Enums']['buyer_lead_status'][]
      );
    }

    if (sourceFilters.length > 0) {
      query = query.in(
        'source',
        sourceFilters as Database['public']['Enums']['buyer_lead_source'][]
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch buyer leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    const leads = (data ?? []).map((lead) => ({
      id: lead.id,
      listingId: lead.listing_id,
      listingName: lead.listing?.name ?? null,
      sellerId: lead.seller_id,
      buyerId: lead.buyer_id,
      name: lead.buyer?.full_name ?? null,
      email: lead.buyer_email,
      phone: lead.buyer_phone,
      company: lead.buyer_company,
      position: lead.buyer_position,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      lastContactedAt: lead.last_contacted_at,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
      buyerAvatar: lead.buyer?.avatar_url ?? null,
    }));

    const total = count ?? leads.length;
    const hasMore = offset + leads.length < total;

    // Aggregate status counts (simple pass for now)
    const { data: statusRows, error: statusError } = await supabase
      .from('buyer_leads')
      .select('status')
      .eq('seller_id', user.id);

    if (statusError) {
      console.error('Failed to compute lead status counts:', statusError);
    }

    const statusCounts = (statusRows ?? []).reduce<Record<string, number>>(
      (acc, row) => {
        const statusKey = row.status as string;
        acc[statusKey] = (acc[statusKey] ?? 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      leads,
      count: total,
      hasMore,
      statusCounts,
    });
  } catch (error) {
    console.error('Error in leads GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
