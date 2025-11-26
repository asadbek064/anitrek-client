import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { cacheGet, cacheSet } from '@/lib/redis';
import crypto from 'crypto';

const GRAPHQL_URL = "https://graphql.anilist.co";

// Default cache TTL: 10 minutes (client-side requests)
const DEFAULT_CACHE_TTL = 600;

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

    // Try to get from cache first
    const cacheKey = generateCacheKey(query, variables);
    const cached = await cacheGet<any>(cacheKey);

    if (cached) {
      console.log('Cache hit for AniList request');
      return res.status(200).json({ data: cached });
    }

    console.log('Cache miss - fetching from AniList API');

    // Make the request to AniList
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

    const responseData = response.data?.data;

    // Cache the response
    if (responseData) {
      const ttl = cacheTTL || DEFAULT_CACHE_TTL;
      await cacheSet(cacheKey, responseData, ttl);
    }

    return res.status(200).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: 'Internal server error' };

    // Handle rate limiting gracefully - don't retry, just return error
    if (status === 429) {
      console.warn('AniList rate limit hit - returning error without retry');
      return res.status(429).json({
        error: {
          message: 'Rate limit exceeded. Please try again later.',
          status: 429,
        },
      });
    }

    console.error('AniList API error:', errorData);
    return res.status(status).json({
      error: errorData,
    });
  }
}
