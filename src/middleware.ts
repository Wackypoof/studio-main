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
  
  // Example protected route logic (uncomment and modify as needed)
  // if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  
  return nextResponse;
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
