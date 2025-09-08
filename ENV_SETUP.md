# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Environment
NODE_ENV=development  # or 'production' in production

# Next.js Auth
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-long
NEXTAUTH_URL=http://localhost:3000  # Update for production

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key

# Sentry Configuration (for error tracking and performance monitoring)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token-here
NEXT_PUBLIC_ENABLE_MONITORING=false # Set to 'true' in production

# Optional with defaults
PORT=3000

# Feature flags
NEXT_PUBLIC_ENABLE_SIGNUP=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Sentry Setup

1. **Get Your DSN**: 
   - Go to your Sentry project settings
   - Navigate to "Client Keys (DSN)"
   - Copy the DSN and add it to your `.env.local` file as `NEXT_PUBLIC_SENTRY_DSN`

2. **Source Maps Upload**:
   - Create an auth token in Sentry (Settings > Account > API > Auth Tokens)
   - Add the token to your `.env.local` file as `SENTRY_AUTH_TOKEN`
   - The build process will automatically upload source maps to Sentry

3. **Enable Monitoring**:
   - Set `NEXT_PUBLIC_ENABLE_MONITORING=true` in production to enable error tracking and performance monitoring
   - Keep it `false` in development to avoid cluttering your Sentry dashboard with test errors

## Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to Project Settings > Service Accounts
4. Generate a new private key and save it securely
5. Copy the configuration values to your `.env.local` file

## Security Notes

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in your `.gitignore`
- For production, set these variables in your hosting platform (Vercel, Netlify, etc.)
- Rotate your secrets regularly, especially if they are compromised

## Validating Environment Variables

The application includes runtime validation of environment variables. If any required variables are missing or invalid, the application will fail to start with a descriptive error message.
