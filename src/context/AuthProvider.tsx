'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

// Query keys
const authKeys = {
  session: ['auth', 'session'] as const,
  user: ['auth', 'user'] as const,
};

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch session
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user profile when session changes
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (error) throw error;
      return { ...session.user, ...data } as AuthUser;
    },
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials: SignInCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        return { data: null, error } as AuthResponse<{ user: AuthUser; session: Session | null }>;
      }
      
      // Fetch the full user profile
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      const authUser = { ...data.user, ...userData } as AuthUser;
      
      return { 
        data: { 
          user: authUser, 
          session: data.session 
        }, 
        error: null 
      } as AuthResponse<{ user: AuthUser; session: Session | null }>;
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(authKeys.session, response.data.session);
        queryClient.setQueryData(authKeys.user, response.data.user);
        router.push('/dashboard');
        router.refresh();
      }
    },
    onError: (error) => {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials.');
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      options,
    }: {
      email: string;
      password: string;
      options?: SignUpOptions;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data,
          emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { data: null, error } as AuthResponse<{ user: AuthUser | null; session: Session | null }>;
      }

      let authUser: AuthUser | null = null;
      
      if (data.user) {
        // If user is returned (email confirmation not required), fetch full profile
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        authUser = { ...data.user, ...userData } as AuthUser;
      }

      return { 
        data: { 
          user: authUser, 
          session: data.session 
        }, 
        error: null 
      } as AuthResponse<{ user: AuthUser | null; session: Session | null }>;
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(authKeys.session, response.data.session);
        queryClient.setQueryData(authKeys.user, response.data.user);
        toast.success('Please check your email to confirm your account');
      }
    },
    onError: (error) => {
      console.error('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error } as { error: AuthError };
      }
      
      return { error: null };
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null);
      queryClient.setQueryData(authKeys.user, null);
      router.push('/login');
      router.refresh();
    },
    onError: (error) => {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
      return { error: error as AuthError };
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) {
        throw new Error('No user logged in');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        return { data: null, error } as AuthResponse<UserProfile>;
      }
      
      const updatedUser = { ...user, ...data } as AuthUser;
      
      return { 
        data: data as UserProfile, 
        error: null 
      } as AuthResponse<UserProfile>;
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(authKeys.user, (old: AuthUser | null) => 
          old ? { ...old, ...response.data } : null
        );
        toast.success('Profile updated successfully');
      }
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile. Please try again.');
    },
  });

  // Clear error function
  const clearError = useCallback(() => {
    queryClient.setQueryData(authKeys.session, (current: any) => 
      current ? { ...current, error: null } : null
    );
  }, [queryClient]);

  // Auth state change subscription - using useEffect instead of useQuery for side effects
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          queryClient.setQueryData(authKeys.session, session);
          if (session?.user) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            queryClient.setQueryData(authKeys.user, userData);
          }
        } else if (event === 'SIGNED_OUT') {
          queryClient.setQueryData(authKeys.session, null);
          queryClient.setQueryData(authKeys.user, null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient, supabase.auth]);

  const value = useMemo(() => ({
    user: user || null,
    session: session || null,
    isLoading: isLoadingSession || isLoadingUser,
    error: null, // Errors are now handled by the mutations
    clearError,
    signIn: signInMutation.mutateAsync,
    signUp: (email: string, password: string, options?: SignUpOptions) =>
      signUpMutation.mutateAsync({ email, password, options }),
    signOut: signOutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  }), [
    user, 
    session, 
    isLoadingSession, 
    isLoadingUser, 
    clearError, 
    signInMutation.mutateAsync, 
    signUpMutation.mutateAsync, 
    signOutMutation.mutateAsync, 
    updateProfileMutation.mutateAsync
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
