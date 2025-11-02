"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { AuthUser, UserProfile, AuthResponse, AuthError, SignUpOptions, SignInCredentials } from '@/types/auth';
import { createAuthError } from '@/lib/auth-utils';

export function useAuthOperations(
  user: AuthUser | null,
  session: Session | null,
  setUser: (user: AuthUser | null) => void,
  setSession: (session: Session | null) => void,
  supabase: SupabaseClient<Database>,
  syncSession: (incomingSession: Session | null) => Promise<AuthUser | null>
) {
  const router = useRouter();

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword(credentials);

        if (signInError) {
          const authError = createAuthError(
            signInError,
            'Failed to sign in. Please check your credentials.'
          );
          toast.error(authError.message);
          return { data: null, error: authError };
        }

        const authUser = await syncSession(data.session);

        if (!authUser) {
          const authError: AuthError = {
            message: 'Unable to determine authenticated user.',
          };
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
        toast.error(authError.message);
        return { data: null, error: authError };
      }
    },
    [router, supabase, syncSession]
  );

  const signUp = useCallback(
    async (email: string, password: string, options?: SignUpOptions) => {
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
        toast.error(authError.message);
        return { data: null, error: authError };
      }
    },
    [supabase, syncSession, setSession, setUser]
  );

  const signOut = useCallback(async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        const authError = createAuthError(
          signOutError,
          'Failed to sign out. Please try again.'
        );
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
      toast.error(authError.message);
      return { error: authError };
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
    [supabase, user, setUser]
  );

  return {
    syncSession,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
