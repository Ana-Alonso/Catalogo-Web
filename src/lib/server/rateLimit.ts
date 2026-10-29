import { createSupabaseAdmin } from './supabaseAdmin';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const MAX_TRACKED_KEYS = 5000;

const buckets = new Map<string, RateLimitBucket>();

const purgeExpiredBuckets = (now: number): void => {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
};

const consumeFromMemory = (
  key: string,
  limit: number,
  windowMs: number,
  now: number
): RateLimitResult => {
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      purgeExpiredBuckets(now);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
};

const readResult = (payload: unknown): RateLimitResult | null => {
  const row = Array.isArray(payload) ? payload[0] : payload;

  if (typeof row !== 'object' || row === null) {
    return null;
  }

  const record = row as Record<string, unknown>;

  if (typeof record.allowed !== 'boolean') {
    return null;
  }

  const retryAfterSeconds =
    typeof record.retry_after_seconds === 'number' ? record.retry_after_seconds : 0;

  return { allowed: record.allowed, retryAfterSeconds };
};

export const consumeRateLimit = async (
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> => {
  try {
    const { data, error } = await createSupabaseAdmin().rpc('consume_rate_limit', {
      p_bucket_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = readResult(data);

    if (!result) {
      throw new Error('respuesta vacía de consume_rate_limit');
    }

    return result;
  } catch (err) {
    console.error('[rate-limit]', err instanceof Error ? err.message : 'Error desconocido');
    return consumeFromMemory(key, limit, windowMs, Date.now());
  }
};
