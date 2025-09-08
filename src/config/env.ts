import { z } from 'zod';

// Schema for environment variables
const envSchema = z.object({
  // Required environment variables
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Next.js Auth
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  
  // Database (example with Firestore)
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase Auth Domain is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
  FIREBASE_CLIENT_EMAIL: z.string().email("Firebase Client Email must be a valid email"),
  FIREBASE_PRIVATE_KEY: z.string().min(1, "Firebase Private Key is required"),
  
  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().describe('Sentry DSN for client-side error tracking'),
  SENTRY_AUTH_TOKEN: z.string().optional().describe('Sentry auth token for source maps upload'),
  NEXT_PUBLIC_ENABLE_MONITORING: z.string().default('false').transform(val => val === 'true').describe('Enable error monitoring and performance tracking'),
  
  // Optional with defaults
  PORT: z.coerce.number().default(3000),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_SIGNUP: z.string().default('false').transform(val => val === 'true'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().default('false').transform(val => val === 'true'),
  ENABLE_MONITORING: z.string().default('true').transform(val => val === 'true'),
});

type Env = z.infer<typeof envSchema>;

// Validate environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

// Validate environment variables on startup
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingEnvVars = error.errors
        .map((err) => `${err.path.join('.')} (${err.message})`)
        .join('\n  - ');
      
      throw new Error(`Missing or invalid environment variables:\n  - ${missingEnvVars}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  ...validateEnv(),
} as const;
