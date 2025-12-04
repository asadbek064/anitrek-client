import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cacheGet, cacheSet } from '@/lib/redis';
import crypto from 'crypto';
import { proxyPool } from '@/services/proxy';

const GRAPHQL_URL = "https://graphql.anilist.co";

// Default cache TTL: 1 year (31536000 seconds)
const DEFAULT_CACHE_TTL = 31536000;

// Generate cache key from query and variables
const generateCacheKey = (query: string, variables: any): string => {
  const hash = crypto
    .createHash('md5')
    .update(query + JSON.stringify(variables))
    .digest('hex');
  return `anilist:${hash}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, variables, cacheTTL } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cacheKey = generateCacheKey(query, variables);

    // Try to get from cache first
    const cached = await cacheGet<any>(cacheKey);

    if (cached) {
      console.log('Cache hit for AniList request');
      return res.status(200).json({ data: cached });
    }

    console.log('Cache miss - fetching from AniList API');

    let responseData: any;

    // Try direct AniList request first
    try {
      const response = await axios.post<{ data: any }>(
        GRAPHQL_URL,
        {
          query,
          variables,
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      responseData = response.data?.data;
    } catch (error: any) {
      const status = error.response?.status;

      // If rate limited, try proxy pool fallback
      if (status === 429) {
        console.warn('AniList rate limit hit - trying proxy pool fallback');
        try {
          const proxyUrl = await proxyPool.getProxy();
          const proxyResponse = await axios.post<{ data: any }>(
            proxyUrl + encodeURIComponent(GRAPHQL_URL),
            {
              query,
              variables,
            },
            {
              timeout: 15000,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          );

          responseData = proxyResponse.data?.data;
          console.log('Proxy pool fallback successful');
        } catch (proxyError: any) {
          console.error('Proxy pool fallback failed:', proxyError.message);
          // Check if it's a rate limit capacity error
          const isCapacityError = proxyError.message?.includes('Rate limit exceeded');
          return res.status(429).json({
            error: {
              message: isCapacityError
                ? 'Rate limit exceeded - proxy capacity full. Please try again later.'
                : 'Rate limit exceeded and proxy failed. Please try again later.',
              status: 429,
            },
          });
        }
      } else {
        // Re-throw non-rate-limit errors
        console.error('AniList API error:', error.response?.data || error.message);
        return res.status(status || 500).json({
          error: error.response?.data || { message: 'Internal server error' },
        });
      }
    }

    // Cache the response
    if (responseData) {
      const ttl = cacheTTL || DEFAULT_CACHE_TTL;
      await cacheSet(cacheKey, responseData, ttl);
    }

    return res.status(200).json({ data: responseData });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({
      error: { message: 'Internal server error' },
    });
  }
}
