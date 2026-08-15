import config from '@/config';
import type { CacheBackend } from './cache-backend';

// Selected once, lazily, so better-sqlite3 is only required when actually chosen.
let backend: CacheBackend | null = null;

const getBackend = (): CacheBackend => {
  if (backend) return backend;

  backend =
    config.cacheBackend === 'sqlite' && typeof window === 'undefined'
      ? (require('./sqlite-backend').sqliteBackend as CacheBackend)
      : (require('./upstash-backend').upstashBackend as CacheBackend);

  return backend;
};

export const cacheGet = <T>(key: string): Promise<T | null> => getBackend().get<T>(key);

export const cacheSet = (key: string, value: any, ttlSeconds?: number): Promise<boolean> =>
  getBackend().set(key, value, ttlSeconds);

export const cacheDel = (key: string): Promise<boolean> => getBackend().del(key);
