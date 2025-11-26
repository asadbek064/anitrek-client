import Redis from 'ioredis';

// Singleton Redis client for server-side caching
let redis: Redis | null = null;
let redisEnabled = true; // Circuit breaker for Redis failures
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 5;

export const getRedisClient = () => {
  if (!redisEnabled || !process.env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      connectTimeout: 5000,
      commandTimeout: 3000, 
      retryStrategy: (times) => {
        // stop retrying after 3 attempts
        if (times > 3) {
          console.error('Redis: Max retry attempts reached');
          return null;
        }
        const delay = Math.min(times * 50, 1000);
        return delay;
      },
    });

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
      consecutiveErrors++;

      // Circuit breaker: disable Redis temporarily after too many errors
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        console.error(`Redis: Circuit breaker triggered after ${MAX_CONSECUTIVE_ERRORS} errors`);
        redisEnabled = false;

        // re-enable after 5 minutes
        setTimeout(() => {
          console.log('Redis: Re-enabling after cooldown');
          redisEnabled = true;
          consecutiveErrors = 0;
        }, 5 * 60 * 1000);
      }
    });

    redis.on('connect', () => {
      console.log('Redis Client Connected');
      consecutiveErrors = 0; // Reset error counter on successful connection
    });
  }
  return redis;
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const cached = await client.get(key);
    if (!cached) return null;

    consecutiveErrors = 0; // Reset on success
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('Redis cache get error:', error);
    consecutiveErrors++;
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

    await client.setex(key, ttlSeconds, serialized);
    consecutiveErrors = 0; // Reset on success
    return true;
  } catch (error) {
    console.error('Redis cache set error:', error);
    consecutiveErrors++;
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
  } catch (error) {
    console.error('Redis cache delete error:', error);
    consecutiveErrors++;
    return false;
  }
};
