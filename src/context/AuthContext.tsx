'use client';

import { createContext, useState, useEffect, useCallback, ReactNode, useContext, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import {
  AuthUser,
  UserProfile,
  AuthResponse,
  AuthError,
  SignUpOptions,
  SignInCredentials,
  isAuthError
} from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  clearError: () => void;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse<{ user: AuthUser; session: Session | null }>>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<AuthResponse<{ user: AuthUser | null; session: Session | null }>>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResponse<UserProfile>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Handle authentication state changes
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setError({
          message: 'Failed to get session',
          code: 'session_error'
        });
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  const clearError = useCallback(() => setError(null), []);

  const handleAuthError = useCallback((error: unknown, defaultMessage = 'An authentication error occurred'): AuthError => {
    console.error('Auth error:', error);
    
    if (isAuthError(error)) {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String(error.message),
        code: 'status' in error ? String(error.status) : 'unknown_error',
        status: 'status' in error ? Number(error.status) : undefined,
      };
    }
    
    return { 
      message: defaultMessage,
      code: 'unexpected_error'
    };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const { email, password } = credentials;
    try {
      setLoading(true);
      clearError();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const authError = handleAuthError(error, 'Failed to sign in. Please check your credentials.');
        setError(authError);
        return { data: null, error: authError };
      }
      
      if (!data.session || !data.user) {
        const authError: AuthError = { 
          message: 'No session or user data returned', 
          code: 'no_session' 
        };
        setError(authError);
        return { data: null, error: authError };
      }
      
      // Update local state
      setUser(data.user as unknown as AuthUser);
      setSession(data.session);
      
      return { 
        data: { 
          user: data.user as unknown as AuthUser, 
          session: data.session 
        }, 
        error: null 
      };
    } catch (error: any) {
      const authError = handleAuthError(error, 'An unexpected error occurred during sign in');
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  }, [clearError, handleAuthError]);

  const signUp = useCallback(async (email: string, password: string, options?: SignUpOptions) => {
    try {
      setLoading(true);
      clearError();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data,
          emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        const authError = handleAuthError(error, 'Failed to sign up. Please try again.');
        setError(authError);
        return { data: null, error: authError };
      }
      
      return { 
        data: { 
          user: data.user as unknown as AuthUser, 
          session: data.session 
        }, 
        error: null 
      };
    } catch (error: any) {
      const authError = handleAuthError(error, 'An unexpected error occurred during sign up');
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  }, [clearError, handleAuthError]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const authError = handleAuthError(error, 'Failed to sign out');
        setError(authError);
        return { error: authError };
      }
      
      // Clear user and session state
      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error: any) {
      const authError = handleAuthError(error, 'An unexpected error occurred during sign out');
      setError(authError);
      return { error: authError };
    } finally {
      setLoading(false);
    }
  }, [clearError, handleAuthError]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      const error: AuthError = { 
        message: 'User not authenticated', 
        code: 'unauthenticated' 
      };
      setError(error);
      return { data: null, error };
    }
    
    try {
      setLoading(true);
      clearError();
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (updateError) {
        const authError = handleAuthError(updateError, 'Failed to update profile');
        setError(authError);
        return { data: null, error: authError };
      }
      
      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      return { 
        data: updatedUser, 
        error: null 
      };
    } catch (error: any) {
      const authError = handleAuthError(error, 'An unexpected error occurred while updating profile');
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  }, [user, clearError, handleAuthError]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    error,
    clearError,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }), [user, session, loading, error, clearError, signIn, signUp, signOut, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
