import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRateLimit } from './middleware/rate-limit-middleware';

export async function middleware(request: NextRequest) {
  // Reuse a single response instance so Supabase can set cookies on it
  const response = NextResponse.next();

  // Initialize Supabase (SSR helper) and refresh session cookies on every matched request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Apply rate limiting; only return if blocked (429)
  const rateLimitBlock = await withRateLimit(request, response);
  if (rateLimitBlock) return rateLimitBlock;

  // Fast server-side redirect for protected dashboard routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve intent so we can navigate after login
    url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return response;
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    // Limit middleware to routes that need it to reduce overhead
    '/api/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/auth/:path*',
  ],
};
