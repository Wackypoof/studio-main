"use client";

const AUTH_REDIRECT_KEY = 'auth:redirect';
const DEFAULT_REDIRECT_PATH = '/login';

export const setAuthRedirect = (path: string) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(AUTH_REDIRECT_KEY, path);
};

export const clearAuthRedirect = () => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
};

export const consumeAuthRedirect = () => {
  if (typeof window === 'undefined') return DEFAULT_REDIRECT_PATH;

  const storedRedirect = window.sessionStorage.getItem(AUTH_REDIRECT_KEY);
  if (storedRedirect) {
    window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
    return storedRedirect;
  }

  return DEFAULT_REDIRECT_PATH;
};
