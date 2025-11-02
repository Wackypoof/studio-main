import { useState, useEffect, useCallback, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { AuthUser, AuthError } from '@/types/auth';
import { createAuthError } from '@/lib/auth-utils';
import { createClient } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/lib/auth-profile';

export function useAuthState() {
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isLoading = isInitializing || isAuthenticating;

  const fetchProfile = useCallback(
    async (baseUser: AuthUser): Promise<AuthUser> => {
      return fetchUserProfile(baseUser, supabase);
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
    // supabase is stable from useRef, so supabase.auth is also stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncSession]);

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
    fetchProfile,
  };
}
