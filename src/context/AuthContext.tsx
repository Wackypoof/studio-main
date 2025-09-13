'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: { 
    data?: any,
    emailRedirectTo?: string 
  }) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signIn: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    },
    signUp: async (email: string, password: string, options?: { data?: any, emailRedirectTo?: string }) => {
      try {
        // First, sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: options?.data?.full_name || '',
              ...options?.data
            },
            emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        // The profile will be created by the database trigger
        // We'll verify it was created successfully
        if (data.user) {
          // Wait a short moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify the profile was created
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.warn('Profile not found after signup, attempting to create:', profileError);
            
            // If profile wasn't created by trigger, try to create it manually
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                full_name: options?.data?.full_name || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (createError) {
              console.error('Failed to create profile:', createError);
              // Don't fail the signup if profile creation fails
              // The user can update their profile later
            }
          }
        }

        return { data, error: null };
      } catch (error: any) {
        console.error('Signup error:', error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
