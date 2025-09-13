import { supabase } from './client';

// Sign up a new user
export const signUp = async (email: string, password: string, options: { data?: any, emailRedirectTo?: string } = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: options.emailRedirectTo || `${window.location.origin}/dashboard`,
      data: options.data || {}
    }
  });
  return { data, error };
};

// Sign in a user
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Sign out the current user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Reset password
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { data, error };
};

// Update user password
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};
