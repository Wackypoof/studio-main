import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type Limiter = {
  limit: (id: string) => Promise<LimitResult>;
};

// Prefer Upstash if credentials are provided; otherwise fall back to in-memory limiter for local dev
const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

function createMemoryLimiter(max: number, windowMs: number): Limiter {
  const store = new Map<string, { count: number; resetAt: number }>();
  return {
    async limit(id: string): Promise<LimitResult> {
      const now = Date.now();
      const entry = store.get(id);

      if (!entry || entry.resetAt <= now) {
        store.set(id, { count: 1, resetAt: now + windowMs });
        return { success: true, limit: max, remaining: max - 1, reset: now + windowMs };
      }

      if (entry.count < max) {
        entry.count += 1;
        return { success: true, limit: max, remaining: max - entry.count, reset: entry.resetAt };
      }

      return { success: false, limit: max, remaining: 0, reset: entry.resetAt };
    },
  };
}

// Rate limit configuration
const RATE_LIMIT_CONFIG: Record<RateLimitType, Limiter> = ((): Record<RateLimitType, Limiter> => {
  if (hasUpstash) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return {
      login: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '5 m'),
        analytics: true,
        prefix: 'ratelimit:auth:login',
      }),
      signup: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: 'ratelimit:auth:signup',
      }),
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:api',
      }),
    } as const;
  }

  // In-memory fallbacks for local development
  return {
    login: createMemoryLimiter(5, 5 * 60 * 1000),
    signup: createMemoryLimiter(3, 60 * 60 * 1000),
    api: createMemoryLimiter(100, 60 * 1000),
  } as const;
})();

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<LimitResult> {
  const limiter = RATE_LIMIT_CONFIG[type];
  return limiter.limit(identifier);
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
