"use server";

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';
import { isAdminEmail } from '@/lib/admin';
import { mapRequestRow } from '@/lib/nda/transform';
import type { NdaApprovalRequestSummary } from '@/types/nda';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

const bodySchema = z.object({
  status: z.enum(['approved', 'declined']),
  note: z.string().trim().max(500).optional(),
});

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = await request.json().catch(() => ({}));
    const { status, note } = bodySchema.parse(body);
    const { id } = paramsSchema.parse(context.params);

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

    const supabase = createServiceRoleClient();

    const { data: existing, error: fetchError } = await supabase
      .from('nda_requests')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    const { data: updatedRow, error: updateError } = await supabase
      .from('nda_requests')
      .update({
        status,
        last_activity_at: now,
        updated_at: now,
      })
      .eq('id', id)
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
      .single();

    if (updateError || !updatedRow) {
      console.error('Failed to apply NDA decision:', updateError);
      return NextResponse.json(
        { error: 'Unable to update NDA request' },
        { status: 500 }
      );
    }

    const { error: auditError } = await supabase.from('nda_audit_events').insert({
      request_id: id,
      agreement_id: null,
      event_type: status,
      created_by: user.email ?? user.id,
      note: note ?? null,
    });

    if (auditError) {
      console.warn('Failed to log NDA decision audit event:', auditError);
    }

    // Re-fetch including the new audit entry
    const { data: refreshedRow, error: refreshError } = await supabase
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
      .eq('id', id)
      .order('created_at', { foreignTable: 'audit_events', ascending: false })
      .single();

    const row = refreshError || !refreshedRow ? updatedRow : refreshedRow;

    const requestPayload: NdaApprovalRequestSummary = mapRequestRow(row);

    return NextResponse.json({ request: requestPayload });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Unexpected NDA decision error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;
