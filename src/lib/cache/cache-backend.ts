// Backends must fail silently: get -> null, set/del -> false, never throw.
export type CacheBackend = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
};
