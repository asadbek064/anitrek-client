// Backward-compatible shim. The cache implementation now lives in `@/lib/cache`
// (pluggable SQLite disk cache on the VPS, Upstash fallback on serverless). Existing
// importers of `@/lib/redis` keep working unchanged.
export { cacheGet, cacheSet, cacheDel } from './cache';
export { getRedisClient } from './cache/upstash-backend';
