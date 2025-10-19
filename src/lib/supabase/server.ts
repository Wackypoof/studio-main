import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      async get(name: string) {
        const cookie = cookieStore.get(name);
        return cookie?.value;
      },
      async set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          console.error('Error setting cookie:', error);
        }
      },
      async remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          console.error('Error removing cookie:', error);
        }
      },
    },
  });
}
