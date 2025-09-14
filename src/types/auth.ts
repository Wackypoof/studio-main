import { User as SupabaseUser, UserMetadata } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends Omit<SupabaseUser, 'user_metadata'> {
  user_metadata: UserMetadata & {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
  details?: string;
}

export interface SignUpOptions {
  data?: {
    full_name: string;
    [key: string]: any;
  };
  emailRedirectTo?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  fullName: string;
}

// Type guard for AuthError
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

// Type guard for AuthResponse
export function isAuthResponse<T = any>(response: any): response is AuthResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'error' in response
  );
}
