import type { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const key = req.query.key as string;
        if (!key) {
          return res.status(400).json({ error: 'Key is required' });
        }

        const response = await client.get(key);
        if (response) {
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
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
      break;

    case 'PUT':
      try {
        const { key, value } = req.body;
        if (!key || value === undefined) {
          return res.status(400).json({ error: 'Key and value are required' });
        }

        await client.set(key, JSON.stringify(value));
        res.status(200).json({ message: 'Key set successfully', key, value });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
