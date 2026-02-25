type BucketState = {
  count: number;
  resetAt: number;
};

type BucketMap = Map<string, BucketState>;

type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as { rateLimitBuckets?: BucketMap };

function getBuckets() {
  if (!globalForRateLimit.rateLimitBuckets) {
    globalForRateLimit.rateLimitBuckets = new Map<string, BucketState>();
  }
  return globalForRateLimit.rateLimitBuckets;
}

export function consumeRateLimit({ key, limit, windowMs }: RateLimitInput): RateLimitResult {
  const now = Date.now();
  const buckets = getBuckets();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
      resetAt
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      resetAt: current.resetAt
    };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    resetAt: current.resetAt
  };
}

export function resetRateLimit(key: string) {
  getBuckets().delete(key);
}

export function getRequestClientIp(request: Request) {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
