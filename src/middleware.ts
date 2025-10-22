import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withRateLimit } from './middleware/rate-limit-middleware';

export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const response = await withRateLimit(request, () => {
    const response = NextResponse.next();
    return Promise.resolve(response);
  });
  
  // If rate limiting returned a response (e.g., rate limit exceeded), return it
  if (response !== undefined) {
    return response;
  }
  
  // Handle session management for all routes
  const nextResponse = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: nextResponse });
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Fast server-side redirect for protected dashboard routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve intent so we can navigate after login
    url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  
  return nextResponse;
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
