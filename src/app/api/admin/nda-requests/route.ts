"use server";

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';
import { isAdminEmail } from '@/lib/admin';
import { mapRequestRow } from '@/lib/nda/transform';
import type { NdaApprovalRequestSummary } from '@/types/nda';

const querySchema = z.object({
  status: z
    .enum(['pending', 'approved', 'declined', 'signed', 'expired'])
    .optional(),
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

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.parse({
      status: searchParams.get('status') as
        | 'pending'
        | 'approved'
        | 'declined'
        | 'signed'
        | 'expired'
        | undefined,
    });

    const supabase = createServiceRoleClient();

    const baseQuery = supabase
      .from('nda_requests')
      .select(
        `
          id,
          listing_id,
          buyer_id,
          seller_id,
          buyer_email,
          buyer_company,
          status,
          requested_at,
          last_activity_at,
          expires_at,
          signed_at,
          document_url,
          risk_level,
          notes,
          listing:listings (
            id,
            name
          ),
          buyer:profiles!nda_requests_buyer_id_fkey (
            id,
            full_name
          ),
          seller:profiles!nda_requests_seller_id_fkey (
            id,
            full_name
          ),
          audit_events:nda_audit_events (
            id,
            event_type,
            created_at,
            created_by,
            request_id,
            agreement_id,
            note
          )
        `
      )
      .order('requested_at', { ascending: false })
      .order('created_at', { foreignTable: 'audit_events', ascending: false });

    const query =
      parsed.status && parsed.status.length > 0
        ? baseQuery.eq('status', parsed.status)
        : baseQuery;

    const { data, error } = await query;

    if (error) {
      console.error('Failed to load NDA requests:', error);
      return NextResponse.json(
        { error: 'Failed to load NDA requests' },
        { status: 500 }
      );
    }

    const requests: NdaApprovalRequestSummary[] = (data ?? []).map(mapRequestRow);

    return NextResponse.json({ requests });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid filter', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Unexpected admin NDA request error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;
