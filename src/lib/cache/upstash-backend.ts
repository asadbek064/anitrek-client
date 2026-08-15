import { Redis } from '@upstash/redis';
import type { CacheBackend } from './cache-backend';

// Upstash (REST) — fallback backend for serverless targets where the disk cache can't persist.
let redis: Redis | null = null;
let redisEnabled = true; // circuit breaker
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 3;

export const getRedisClient = () => {
  if (!redisEnabled) {
    return null;
  }

  const hasUpstashEnv = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasRedisUrl = process.env.REDIS_URL;

  if (!hasUpstashEnv && !hasRedisUrl) {
    console.warn('No Redis configuration found (UPSTASH_REDIS_REST_URL or REDIS_URL)');
    return null;
  }

  if (!redis) {
    if (hasUpstashEnv) {
      redis = Redis.fromEnv();
      console.log('Upstash Redis client initialized from env');
    } else if (hasRedisUrl) {
      const url = process.env.REDIS_URL;

      if (url.includes('upstash.io')) {
        const token = process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

        if (token) {
          // REDIS_URL may be redis://default:TOKEN@HOST — strip to the https host.
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

const tripBreakerOnError = () => {
  consecutiveErrors++;
  if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
    console.error(`Redis: Circuit breaker triggered after ${MAX_CONSECUTIVE_ERRORS} errors`);
    redisEnabled = false;
    setTimeout(() => {
      console.log('Redis: Re-enabling after cooldown');
      redisEnabled = true;
      consecutiveErrors = 0;
    }, 5 * 60 * 1000);
  }
};

const get = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const cached = await client.get<T>(key);
    if (!cached) return null;

    consecutiveErrors = 0;
    return cached;
  } catch (error: any) {
    console.error('Redis cache get error:', error);
    tripBreakerOnError();
    return null;
  }
};

const set = async (key: string, value: any, ttlSeconds: number = 3600): Promise<boolean> => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    // Upstash rejects oversized values; skip >10 MB.
    const sizeInMB = Buffer.byteLength(JSON.stringify(value), 'utf8') / (1024 * 1024);
    if (sizeInMB > 10) {
      console.warn(`Redis: Skipping cache set for large value (${sizeInMB.toFixed(2)} MB) on key: ${key}`);
      return false;
    }

    // Upstash serializes the object itself.
    await client.setex(key, ttlSeconds, value);
    consecutiveErrors = 0;
    return true;
  } catch (error: any) {
    console.error('Redis cache set error:', error);
    tripBreakerOnError();
    return false;
  }
};

const del = async (key: string): Promise<boolean> => {
  try {
    const client = getRedisClient();
    if (!client) return false;

    await client.del(key);
    consecutiveErrors = 0;
    return true;
  } catch (error: any) {
    console.error('Redis cache delete error:', error);
    tripBreakerOnError();
    return false;
  }
};

export const upstashBackend: CacheBackend = { get, set, del };
