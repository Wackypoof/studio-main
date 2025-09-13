import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();
  
  // You can add protected route logic here if needed
  // Example:
  // if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  
  return response;
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
