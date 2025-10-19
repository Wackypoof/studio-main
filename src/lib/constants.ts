// Route constants to avoid magic strings
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/forgot-password',
  AUTH_CALLBACK: '/auth/callback',
} as const;

// Form validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Common form field names
export const FORM_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
  FULL_NAME: 'fullName',
} as const;
