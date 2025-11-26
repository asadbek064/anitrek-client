import { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand ISR Revalidation API
 *
 * This endpoint allows you to trigger revalidation of specific pages without waiting for the revalidate time.
 *
 * Usage examples:
 *
 * 1. Revalidate a single anime details page:
 *    POST /api/revalidate
 *    Body: { secret: "YOUR_SECRET_TOKEN", type: "anime", id: 1 }
 *
 * 2. Revalidate multiple pages:
 *    POST /api/revalidate
 *    Body: { secret: "YOUR_SECRET_TOKEN", paths: ["/anime/details/1", "/manga/details/123"] }
 *
 * 3. Revalidate by type and ID:
 *    POST /api/revalidate
 *    Body: { secret: "YOUR_SECRET_TOKEN", type: "manga", id: 123 }
 *
 * Setup:
 * Add REVALIDATE_SECRET to your .env.local file:
 * REVALIDATE_SECRET=your_random_secret_here
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check for secret to confirm this is a valid request
  if (req.body.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const { type, id, paths } = req.body;

    // If paths array is provided, revalidate all of them
    if (paths && Array.isArray(paths)) {
      await Promise.all(paths.map((path: string) => res.revalidate(path)));
      return res.json({
        revalidated: true,
        paths,
        message: `Revalidated ${paths.length} paths`,
      });
    }

    // If type and id are provided, construct the path and revalidate
    if (type && id) {
      const pathMap: Record<string, string> = {
        anime: `/anime/details/${id}`,
        manga: `/manga/details/${id}`,
        character: `/characters/details/${id}`,
        "voice-actor": `/voice-actors/details/${id}`,
        studio: `/studios/${id}`,
      };

      const path = pathMap[type];
      if (!path) {
        return res.status(400).json({
          message: `Invalid type. Must be one of: ${Object.keys(pathMap).join(
            ", "
          )}`,
        });
      }

      await res.revalidate(path);
      return res.json({
        revalidated: true,
        path,
        message: `Revalidated ${type} with id ${id}`,
      });
    }

    // If neither paths nor type/id provided
    return res.status(400).json({
      message: 'Must provide either "paths" array or "type" and "id"',
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error revalidating",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
