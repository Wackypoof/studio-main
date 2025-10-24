import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { AuthUser, AuthError } from '@/types/auth';
import { createAuthError } from '@/lib/auth-utils';
import { createClient } from '@/lib/supabase/client';

export function useAuthState() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isLoading = isInitializing || isAuthenticating;

  const fetchProfile = useCallback(
    async (baseUser: AuthUser): Promise<AuthUser> => {
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
    },
    [supabase]
  );

  const syncSession = useCallback(
    async (incomingSession: Session | null): Promise<AuthUser | null> => {
      setSession(incomingSession);

      if (!incomingSession?.user) {
        setUser(null);
        return null;
      }

      const baseUser = {
        ...(incomingSession.user as AuthUser),
        user_metadata: {
          ...(incomingSession.user.user_metadata ?? {}),
        },
      } as AuthUser;

      const authUser = await fetchProfile(baseUser);
      setUser(authUser);
      return authUser;
    },
    [fetchProfile]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialiseAuth = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          const authError = createAuthError(
            sessionError,
            'Unable to retrieve session. Please try again.'
          );
          setError(authError);
          setSession(null);
          setUser(null);
          return;
        }

        setError(null);
        await syncSession(data.session);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error('Unexpected error fetching session:', err);
        const authError = createAuthError(
          err,
          'Unable to retrieve session. Please try again.'
        );
        setError(authError);
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initialiseAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, newSession: Session | null) => {
      await syncSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, syncSession]);

  return {
    user,
    session,
    isLoading,
    error,
    clearError,
    setUser,
    setSession,
    setIsAuthenticating,
    syncSession,
    supabase,
    setError,
  };
}
