"use server";

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';
import type { NdaAgreementSummary } from '@/types/nda';
import { mapAgreementRow } from '@/lib/nda/transform';

const querySchema = z.object({
  role: z.enum(['buyer', 'seller']).default('buyer'),
});

export async function GET(request: NextRequest) {
  try {
    const serverClient = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await serverClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      role: (searchParams.get('role') as 'buyer' | 'seller' | null) ?? undefined,
    });

    const supabase = createServiceRoleClient();

    const query = supabase
      .from('nda_agreements')
      .select(
        `
          id,
          listing_id,
          buyer_id,
          seller_id,
          buyer_company,
          status,
          signed_at,
          expires_at,
          document_url,
          renewal_requested,
          security_level,
          updated_at,
          listing:listings (
            id,
            name
          ),
          buyer:profiles!nda_agreements_buyer_id_fkey (
            id,
            full_name
          ),
          seller:profiles!nda_agreements_seller_id_fkey (
            id,
            full_name
          )
        `
      )
      .eq(parsed.role === 'buyer' ? 'buyer_id' : 'seller_id', user.id)
      .order('updated_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch NDA agreements:', error);
      return NextResponse.json(
        { error: 'Failed to load NDAs' },
        { status: 500 }
      );
    }

    const agreements = (data ?? []).map(mapAgreementRow);

    return NextResponse.json({ agreements });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Unexpected error in NDA GET:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;
