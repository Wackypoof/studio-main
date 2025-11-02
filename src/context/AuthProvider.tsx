'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type {
  AuthUser,
  UserProfile,
  AuthResponse,
  AuthError,
  SignUpOptions,
  SignInCredentials,
} from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { createAuthError } from '@/lib/auth-utils';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
  clearError: () => void;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse<{ user: AuthUser; session: Session | null }>>;
  signInWithProvider: (
    provider: 'google' | 'github' | 'discord',
    nextPath?: string
  ) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResponse<UserProfile>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const {
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
  } = useAuthState();

  const { signIn, signUp, signOut, updateProfile } = useAuthOperations(
    user,
    session,
    setUser,
    setSession,
    supabase,
    syncSession
  );

  const signInWithProvider = useCallback(async (provider: 'google' | 'github' | 'discord', nextPath?: string) => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const { data, error: providerError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ''}`,
        },
      });

      if (providerError) {
        const authError = createAuthError(
          providerError,
          `Failed to sign in with ${provider}. Please try again.`
        );
        setError(authError);
        toast.error(authError.message);
        return { data: null, error: authError };
      }

      return {
        data: {
          user: null, // OAuth doesn't return user immediately
          session: null,
        },
        error: null,
      } as AuthResponse<{ user: AuthUser | null; session: Session | null }>;
    } catch (err) {
      console.error(`${provider} sign in error:`, err);
      const authError = createAuthError(
        err,
        `Failed to sign in with ${provider}. Please try again.`
      );
      setError(authError);
      toast.error(authError.message);
      return { data: null, error: authError };
    } finally {
      setIsAuthenticating(false);
    }
  }, [setError, setIsAuthenticating, supabase]);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      error,
      clearError,
      signIn,
      signInWithProvider,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, session, isLoading, error, clearError, signIn, signInWithProvider, signUp, signOut, updateProfile]
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
