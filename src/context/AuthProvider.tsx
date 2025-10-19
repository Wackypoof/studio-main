'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import {
  AuthUser,
  UserProfile,
  AuthResponse,
  AuthError,
  SignUpOptions,
  SignInCredentials,
  isAuthError,
} from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  clearError: () => void;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse<{ user: AuthUser; session: Session | null }>>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResponse<UserProfile>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createAuthError = (error: unknown, fallbackMessage: string): AuthError => {
  if (isAuthError(error)) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: typeof err.message === 'string' ? err.message : fallbackMessage,
      code: typeof err.code === 'string' ? err.code : undefined,
      status: typeof err.status === 'number' ? err.status : undefined,
      details: typeof err.name === 'string' ? err.name : undefined,
    };
  }

  return { message: fallbackMessage };
};

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

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
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      await syncSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, syncSession]);

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      setIsAuthenticating(true);
      setError(null);

      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword(credentials);

        if (signInError) {
          const authError = createAuthError(
            signInError,
            'Failed to sign in. Please check your credentials.'
          );
          setError(authError);
          toast.error(authError.message);
          return { data: null, error: authError };
        }

        const authUser = await syncSession(data.session);

        if (!authUser) {
          const authError: AuthError = {
            message: 'Unable to determine authenticated user.',
          };
          setError(authError);
          toast.error(authError.message);
          return { data: null, error: authError };
        }

        router.push('/dashboard');
        router.refresh();

        return {
          data: {
            user: authUser,
            session: data.session,
          },
          error: null,
        } as AuthResponse<{ user: AuthUser; session: Session | null }>;
      } catch (err) {
        console.error('Sign in error:', err);
        const authError = createAuthError(
          err,
          'Failed to sign in. Please check your credentials.'
        );
        setError(authError);
        toast.error(authError.message);
        return { data: null, error: authError };
      } finally {
        setIsAuthenticating(false);
      }
    },
    [router, supabase, syncSession]
  );

  const signUp = useCallback(
    async (email: string, password: string, options?: SignUpOptions) => {
      setIsAuthenticating(true);
      setError(null);

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: options?.data,
            emailRedirectTo:
              options?.emailRedirectTo || `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          const authError = createAuthError(
            signUpError,
            'Failed to create account. Please try again.'
          );
          setError(authError);
          toast.error(authError.message);
          return { data: null, error: authError };
        }

        let authUser: AuthUser | null = null;

        if (data.user) {
          authUser = await syncSession(data.session);
        } else {
          setSession(data.session);
          setUser(null);
        }

        toast.success('Please check your email to confirm your account');

        return {
          data: {
            user: authUser,
            session: data.session,
          },
          error: null,
        } as AuthResponse<{ user: AuthUser | null; session: Session | null }>;
      } catch (err) {
        console.error('Sign up error:', err);
        const authError = createAuthError(
          err,
          'Failed to create account. Please try again.'
        );
        setError(authError);
        toast.error(authError.message);
        return { data: null, error: authError };
      } finally {
        setIsAuthenticating(false);
      }
    },
    [supabase, syncSession]
  );

  const signOut = useCallback(async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        const authError = createAuthError(
          signOutError,
          'Failed to sign out. Please try again.'
        );
        setError(authError);
        toast.error(authError.message);
        return { error: authError };
      }

      await syncSession(null);
      router.push('/login');
      router.refresh();

      return { error: null };
    } catch (err) {
      console.error('Sign out error:', err);
      const authError = createAuthError(
        err,
        'Failed to sign out. Please try again.'
      );
      setError(authError);
      toast.error(authError.message);
      return { error: authError };
    } finally {
      setIsAuthenticating(false);
    }
  }, [router, supabase, syncSession]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user?.id) {
        const authError: AuthError = { message: 'No user logged in' };
        toast.error(authError.message);
        return { data: null, error: authError };
      }

      try {
        const { data, error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          const authError = createAuthError(
            updateError,
            'Failed to update profile. Please try again.'
          );
          toast.error(authError.message);
          return { data: null, error: authError };
        }

        const nextUser = {
          ...user,
          ...data,
          user_metadata: {
            ...user.user_metadata,
            full_name: data?.full_name ?? user.user_metadata?.full_name,
            avatar_url: data?.avatar_url ?? user.user_metadata?.avatar_url,
          },
        } as AuthUser;

        setUser(nextUser);
        toast.success('Profile updated successfully');

        return {
          data: data as UserProfile,
          error: null,
        } as AuthResponse<UserProfile>;
      } catch (err) {
        console.error('Update profile error:', err);
        const authError = createAuthError(
          err,
          'Failed to update profile. Please try again.'
        );
        toast.error(authError.message);
        return { data: null, error: authError };
      }
    },
    [supabase, user]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      error,
      clearError,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, session, isLoading, error, clearError, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
