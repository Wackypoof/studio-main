import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, RateLimitType } from '@/lib/rate-limit';

// Define routes that need rate limiting
const RATE_LIMIT_ROUTES: Record<string, RateLimitType> = {
  '/api/auth/login': 'login',
  '/api/auth/signup': 'signup',
  '/api/auth/forgot-password': 'login',
  '/api/auth/reset-password': 'login',
};

export async function withRateLimit(
  request: NextRequest,
  next: () => Promise<NextResponse>
): Promise<NextResponse | undefined> {
  const pathname = request.nextUrl.pathname;
  
  // Check if the current route needs rate limiting
  const rateLimitType = RATE_LIMIT_ROUTES[pathname];
  
  if (rateLimitType) {
    const response = NextResponse.next();
    const { success, limit, remaining, reset } = await checkRateLimit(rateLimitType, getClientIp(request));
    
    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    
    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    return response;
  }
  
  // Apply general API rate limiting to all API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    const { success, limit, remaining, reset } = await checkRateLimit('api', getClientIp(request));
    
    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    
    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `API rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    return response;
  }
  
  // If no rate limiting was applied, return undefined to continue with the next middleware
  return undefined;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded || '127.0.0.1').split(',')[0].trim();
}
