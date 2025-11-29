// pages/api/data.ts

import Redis from 'ioredis';
import type { NextApiRequest, NextApiResponse } from 'next';

// @ts-ignore
const redis = new Redis(process.env.REDIS_URL);

const MAX_ITEMS = 20; // Maximupm items in the array

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const newData = JSON.parse(req.body); // Assuming you're sending JSON data

      // Push new data to the Redis array
      await redis.lpush('recent_ai_search', JSON.stringify(newData));
      
      // Trim the array to MAX_ITEMS
      await redis.ltrim('recent_ai_search', 0, MAX_ITEMS - 1);

      res.status(200).json({ message: 'Data pushed successfully.' });
    } catch (error) {
      console.error('Error pushing data:', error);
      res.status(500).json({ error: 'Failed to push data.' });
    }
  } else if (req.method === 'GET') {
    try {
      // Retrieve the array from Redis
      const data = await redis.lrange('recent_ai_search', 0, MAX_ITEMS - 1);
      const parsedData = data.map((item) => JSON.parse(item));

      res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=600'
      );
      res.status(200).json(parsedData);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Failed to retrieve data.' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
