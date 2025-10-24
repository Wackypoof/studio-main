// Centralize Database types by re-exporting the generated types
// from `src/lib/supabase/database.types`. This avoids drift between
// multiple Database interfaces across the codebase.
export type { Database } from '@/lib/supabase/database.types';

// Convenience helper types derived from the single Database source
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type Profile = Tables<'profiles'>;
