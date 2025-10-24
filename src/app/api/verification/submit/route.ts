import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const submitSchema = z.object({
  doc_type: z.enum([
    'identity',
    'business_registration',
    'business_address',
    'bank_verification',
    'proof_of_funds',
    'other',
  ]),
  storage_path: z.string().min(1),
  file_name: z.string().optional(),
  file_size: z.number().int().nonnegative().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const payload = submitSchema.parse(body);

    const { data, error } = await supabase
      .from('verification_documents')
      .insert({
        user_id: user.id,
        doc_type: payload.doc_type as any,
        status: 'pending',
        storage_path: payload.storage_path,
        file_name: payload.file_name,
        file_size: payload.file_size,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Insert verification document failed:', error);
      return NextResponse.json({ error: 'Failed to submit document' }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 });
    }
    console.error('Submit verification doc error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 5;

