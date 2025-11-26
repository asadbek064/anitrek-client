import { NextApiResponse } from "next";

/**
 * Cache configuration presets for API routes
 */
export const CachePresets = {
  /**
   * Short cache: 30 seconds at edge, stale for 2 minutes
   * Best for: Frequently changing data like recent searches, live stats
   */
  SHORT: "public, s-maxage=30, stale-while-revalidate=120",

  /**
   * Medium cache: 60 seconds at edge, stale for 5 minutes
   * Best for: Semi-static data like user profiles, content lists
   */
  MEDIUM: "public, s-maxage=60, stale-while-revalidate=300",

  /**
   * Long cache: 5 minutes at edge, stale for 30 minutes
   * Best for: Mostly static data like metadata, configuration
   */
  LONG: "public, s-maxage=300, stale-while-revalidate=1800",

  /**
   * No cache: Disable all caching
   * Best for: Authentication, mutations, real-time data
   */
  NONE: "private, no-cache, no-store, must-revalidate",
} as const;

/**
 * Sets cache headers on API response
 *
 * @param res - Next.js API response object
 * @param cacheControl - Cache-Control header value or preset
 *
 * @example
 * ```ts
 * // Using preset
 * setCacheHeaders(res, CachePresets.MEDIUM);
 *
 * // Custom cache control
 * setCacheHeaders(res, "public, s-maxage=120, stale-while-revalidate=600");
 * ```
 */
export function setCacheHeaders(
  res: NextApiResponse,
  cacheControl: string = CachePresets.MEDIUM
): void {
  res.setHeader("Cache-Control", cacheControl);
}

/**
 * Custom cache configuration
 *
 * @param sMaxAge - Cache duration at edge in seconds
 * @param staleWhileRevalidate - Time to serve stale content while revalidating in seconds
 * @returns Cache-Control header value
 *
 * @example
 * ```ts
 * // Cache for 2 minutes, stale for 10 minutes
 * setCacheHeaders(res, customCache(120, 600));
 * ```
 */
export function customCache(
  sMaxAge: number,
  staleWhileRevalidate: number = sMaxAge * 5
): string {
  return `public, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
}
