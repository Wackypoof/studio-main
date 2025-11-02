"use server";

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-client';
import { mapAgreementRow } from '@/lib/nda/transform';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

interface RouteContext {
  params: { id: string };
}

export async function POST(_: Request, context: RouteContext) {
  try {
    const { id } = paramsSchema.parse(context.params);

    const serverClient = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await serverClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    const { data: agreementRow, error: fetchError } = await supabase
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
      .eq('id', id)
      .single();

    if (fetchError || !agreementRow) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    if (agreementRow.buyer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!agreementRow.renewal_requested) {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('nda_agreements')
        .update({
          renewal_requested: true,
          updated_at: now,
        })
        .eq('id', id);

      if (updateError) {
        console.error('Failed to mark renewal request:', updateError);
        return NextResponse.json(
          { error: 'Unable to request renewal' },
          { status: 500 }
        );
      }

      const { error: auditError } = await supabase.from('nda_audit_events').insert({
        request_id: null,
        agreement_id: id,
        event_type: 'system',
        created_by: user.email ?? user.id,
        note: 'Buyer requested renewal via dashboard',
      });

      if (auditError) {
        console.warn('Failed to log NDA renewal audit event:', auditError);
      }

      agreementRow.renewal_requested = true;
      agreementRow.updated_at = now;
    }

    const agreement = mapAgreementRow(agreementRow);

    return NextResponse.json({ agreement });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Unexpected error in NDA renewal:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;
