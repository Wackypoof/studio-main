import type { AuthError } from '@/types/auth';
import { isAuthError } from '@/types/auth';

export const createAuthError = (error: unknown, fallbackMessage: string): AuthError => {
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
