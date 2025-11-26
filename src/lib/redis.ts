import { Redis } from '@upstash/redis';

// Upstash Redis client for serverless (uses REST API, no persistent connections)
let redis: Redis | null = null;
let redisEnabled = true; // Circuit breaker for Redis failures
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 3;

export const getRedisClient = () => {
  if (!redisEnabled) {
    return null;
  }

  // Check for Upstash env vars first, then fall back to REDIS_URL
  const hasUpstashEnv = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasRedisUrl = process.env.REDIS_URL;

  if (!hasUpstashEnv && !hasRedisUrl) {
    console.warn('No Redis configuration found (UPSTASH_REDIS_REST_URL or REDIS_URL)');
    return null;
  }

  if (!redis) {
    if (hasUpstashEnv) {
      // Use Upstash environment variables
      redis = Redis.fromEnv();
      console.log('Upstash Redis client initialized from env');
    } else if (hasRedisUrl) {
      // Parse REDIS_URL for Upstash (if it's an Upstash URL)
      // Upstash URLs are in format: https://xxx.upstash.io
      const url = process.env.REDIS_URL;

      // If it's an Upstash REST URL, extract token from URL or use separate token
      if (url.includes('upstash.io')) {
        // Upstash format: redis://default:TOKEN@HOST:PORT or https://HOST
        const token = process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

        if (token) {
          redis = new Redis({
            url: url.startsWith('http') ? url : `https://${url.replace(/^redis:\/\/.*@/, '')}`,
            token: token,
          });
          console.log('Upstash Redis client initialized from REDIS_URL');
        } else {
          console.error('REDIS_URL is Upstash but no REDIS_TOKEN found');
          return null;
        }
      } else {
        console.error('REDIS_URL is not an Upstash URL. Please use Upstash Redis for serverless.');
        return null;
      }
    }
  }

  return redis;
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    // Upstash returns the value directly (already parsed)
    const cached = await client.get<T>(key);

    if (!cached) return null;

    consecutiveErrors = 0; // Reset on success
    return cached;
  } catch (error: any) {
    console.error('Redis cache get error:', error);
    consecutiveErrors++;

    // Circuit breaker: disable Redis temporarily after too many errors
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      console.error(`Redis: Circuit breaker triggered after ${MAX_CONSECUTIVE_ERRORS} errors`);
      redisEnabled = false;

      // Re-enable after 5 minutes
      setTimeout(() => {
        console.log('Redis: Re-enabling after cooldown');
        redisEnabled = true;
        consecutiveErrors = 0;
      }, 5 * 60 * 1000);
    }

    return null; // Fail gracefully, don't crash the app
  }
};

export const cacheSet = async (
  key: string,
  value: any,
  ttlSeconds: number = 3600
): Promise<boolean> => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    // Check value size before caching (prevent exceeding 256 MB limit)
    const serialized = JSON.stringify(value);
    const sizeInMB = Buffer.byteLength(serialized, 'utf8') / (1024 * 1024);

    if (sizeInMB > 10) {
      console.warn(`Redis: Skipping cache set for large value (${sizeInMB.toFixed(2)} MB) on key: ${key}`);
      return false;
    }

    // Upstash automatically serializes - use setex with TTL
    await client.setex(key, ttlSeconds, value);
    consecutiveErrors = 0; // Reset on success
    return true;
  } catch (error: any) {
    console.error('Redis cache set error:', error);
    consecutiveErrors++;

    // Circuit breaker: disable Redis temporarily after too many errors
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      console.error(`Redis: Circuit breaker triggered after ${MAX_CONSECUTIVE_ERRORS} errors`);
      redisEnabled = false;

      // Re-enable after 5 minutes
      setTimeout(() => {
        console.log('Redis: Re-enabling after cooldown');
        redisEnabled = true;
        consecutiveErrors = 0;
      }, 5 * 60 * 1000);
    }

    return false; // Fail gracefully
  }
};

export const cacheDel = async (key: string): Promise<boolean> => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    await client.del(key);
    consecutiveErrors = 0; // Reset on success
    return true;
  } catch (error: any) {
    console.error('Redis cache delete error:', error);
    consecutiveErrors++;

    // Circuit breaker: disable Redis temporarily after too many errors
    if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
      console.error(`Redis: Circuit breaker triggered after ${MAX_CONSECUTIVE_ERRORS} errors`);
      redisEnabled = false;

      // Re-enable after 5 minutes
      setTimeout(() => {
        console.log('Redis: Re-enabling after cooldown');
        redisEnabled = true;
        consecutiveErrors = 0;
      }, 5 * 60 * 1000);
    }

    return false;
  }
};
