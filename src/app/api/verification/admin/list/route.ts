import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const paramsSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  limit: z.coerce.number().int().positive().max(200).default(50),
  role: z.enum(['buyer', 'seller']).optional(),
});

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return allow.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    const serverClient = await createServerClient();
    const { data: { user }, error: userErr } = await serverClient.auth.getUser();
    if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!isAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const parsed = paramsSchema.parse({
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') || undefined,
      role: (searchParams.get('role') as 'buyer' | 'seller' | null) || undefined,
    });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return NextResponse.json({ error: 'Server is missing Supabase configuration' }, { status: 500 });
    const supabase = createClient(url, serviceKey);

    // Fetch documents with basic profile info
    const baseQuery = supabase
      .from('verification_documents')
      .select(`
        id,
        user_id,
        doc_type,
        status,
        storage_path,
        file_name,
        file_size,
        created_at,
        profiles:profiles!verification_documents_user_id_fkey (
          id,
          full_name
        )
      `)
      .eq('status', parsed.status)
      .order('created_at', { ascending: false })
      .limit(parsed.limit);

    // Optional role filter via doc_type mapping
    const sellerDocTypes = ['business_registration', 'business_address', 'bank_verification'] as const;
    const buyerDocTypes = ['identity', 'proof_of_funds'] as const;

    const { data, error } = await (
      parsed.role === 'seller'
        ? baseQuery.in('doc_type', sellerDocTypes as unknown as string[])
        : parsed.role === 'buyer'
        ? baseQuery.in('doc_type', buyerDocTypes as unknown as string[])
        : baseQuery
    );

    if (error) {
      console.error('List verification docs failed:', error);
      return NextResponse.json({ error: 'Failed to load verifications' }, { status: 500 });
    }

    // Attach signed URL for viewing the private file
    const results = await Promise.all((data || []).map(async (row) => {
      let signed_url: string | null = null;
      try {
        const { data: signed } = await supabase
          .storage
          .from('verification-documents')
          .createSignedUrl(row.storage_path, 60 * 60); // 1 hour
        signed_url = signed?.signedUrl ?? null;
      } catch {}
      return { ...row, signed_url } as any;
    }));

    return NextResponse.json({ verifications: results });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 });
    }
    console.error('Verification admin list error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 10;
