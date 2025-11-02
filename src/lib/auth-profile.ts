import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { AuthUser } from '@/types/auth';

/**
 * Fetches and merges user profile data from the profiles table.
 * This shared utility prevents code duplication and ensures consistent
 * profile syncing across the auth system.
 */
export async function fetchUserProfile(
  baseUser: AuthUser,
  supabase: SupabaseClient<Database>
): Promise<AuthUser> {
  try {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', baseUser.id)
      .single();

    if (profileError) {
      // Supabase returns code PGRST116 when no profile exists yet.
      if (profileError.code && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
      }

      return baseUser;
    }

    const existingMetadata = baseUser.user_metadata ?? {};

    return {
      ...baseUser,
      ...data,
      user_metadata: {
        ...existingMetadata,
        full_name: data?.full_name ?? existingMetadata.full_name,
        avatar_url: data?.avatar_url ?? existingMetadata.avatar_url,
      },
    } as AuthUser;
  } catch (err) {
    console.error('Unexpected error fetching user profile:', err);
    return baseUser;
  }
}
