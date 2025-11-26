import type { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';

// Singleton pattern for Redis client to reuse connections
let client: Redis | null = null;
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 5;

const getRedisClient = () => {
  if (!client && process.env.REDIS_URL) {
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 2, // Reduced to save commands on free tier
      enableReadyCheck: true,
      enableOfflineQueue: false,
      connectTimeout: 5000,
      commandTimeout: 3000, // Prevent hanging commands
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          return null; // Stop retrying after 3 attempts
        }
        return Math.min(times * 50, 1000);
      },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      consecutiveErrors++;
    });

    client.on('connect', () => {
      console.log('Redis Client Connected');
      consecutiveErrors = 0;
    });
  }
  return client;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Circuit breaker check
  if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
    return res.status(503).json({
      error: 'Cache service temporarily unavailable',
      message: 'Circuit breaker active due to repeated errors'
    });
  }

  const redis = getRedisClient();

  if (!redis) {
    return res.status(503).json({ error: 'Redis not configured' });
  }

  // Ensure Redis is connected
  try {
    if (redis.status !== 'ready') {
      await redis.connect();
    }
  } catch (error) {
    console.error('Redis connection error:', error);
    consecutiveErrors++;
    return res.status(503).json({ error: 'Cache service unavailable' });
  }

  switch (method) {
    case 'GET':
      try {
        const key = req.query.key as string;
        if (!key) {
          return res.status(400).json({ error: 'Key is required' });
        }

        const response = await redis.get(key);
        if (response) {
          consecutiveErrors = 0; // Reset on success
          // Cache at edge for 60 seconds, serve stale for up to 5 minutes while revalidating
          res.setHeader(
            'Cache-Control',
            'public, s-maxage=60, stale-while-revalidate=300'
          );
          res.status(200).json({ key, value: response });
        } else {
          res.status(404).json({ error: 'Key not found' });
        }
      } catch (error) {
        console.error('Redis GET error:', error);
        consecutiveErrors++;
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
      break;

    case 'PUT':
      try {
        const { key, value, ttl } = req.body;
        if (!key || value === undefined) {
          return res.status(400).json({ error: 'Key and value are required' });
        }

        // Check value size before caching (prevent exceeding 256 MB limit)
        const serialized = JSON.stringify(value);
        const sizeInMB = Buffer.byteLength(serialized, 'utf8') / (1024 * 1024);

        if (sizeInMB > 10) {
          return res.status(413).json({
            error: 'Payload too large',
            message: `Value size (${sizeInMB.toFixed(2)} MB) exceeds 10 MB limit`
          });
        }

        // Support optional TTL (time-to-live) in seconds
        if (ttl && typeof ttl === 'number') {
          await redis.setex(key, ttl, serialized);
        } else {
          await redis.set(key, serialized);
        }

        consecutiveErrors = 0; // Reset on success
        res.status(200).json({ message: 'Key set successfully', key, ttl: ttl || null });
      } catch (error) {
        console.error('Redis PUT error:', error);
        consecutiveErrors++;
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
      break;

    case 'DELETE':
      try {
        const key = req.query.key as string;
        if (!key) {
          return res.status(400).json({ error: 'Key is required' });
        }

        const result = await redis.del(key);
        consecutiveErrors = 0; // Reset on success
        res.status(200).json({ message: 'Key deleted', deleted: result === 1 });
      } catch (error) {
        console.error('Redis DELETE error:', error);
        consecutiveErrors++;
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
