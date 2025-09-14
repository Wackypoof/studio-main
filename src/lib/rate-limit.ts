import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Initialize the Redis client using environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  // Rate limit for login attempts (5 attempts per 5 minutes per IP)
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '5 m'),
    analytics: true,
    prefix: 'ratelimit:auth:login',
  }),
  // Rate limit for signup attempts (3 per hour per IP)
  signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:auth:signup',
  }),
  // General API rate limit (100 requests per minute per IP)
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const rateLimit = RATE_LIMIT_CONFIG[type];
  const result = await rateLimit.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export async function rateLimitMiddleware(
  type: RateLimitType,
  req: Request,
  res: NextResponse
): Promise<NextResponse | null> {
  // Get the IP address from the request
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = (forwarded || '127.0.0.1').split(',')[0].trim();
  
  const { success, limit, remaining, reset } = await checkRateLimit(type, ip);
  
  // Set rate limit headers
  res.headers.set('X-RateLimit-Limit', limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-RateLimit-Reset', reset.toString());
  
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
  
  return null;
}
