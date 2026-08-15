import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import config from '@/config';
import type { CacheBackend } from './cache-backend';

// Persistent Brotli disk cache. Entries never expire, so SSR avoids AniList rate limits.
// better-sqlite3 is server-only and lazily loaded; excluded from the client build.
type Database = import('better-sqlite3').Database;
type Statement = import('better-sqlite3').Statement;

const brotliOpts = (len: number) => ({
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 5,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: len,
  },
});

let db: Database | null = null;
let dbFailed = false;

let stmtGet: Statement | null = null;
let stmtSet: Statement | null = null;
let stmtDel: Statement | null = null;

const getDb = (): Database | null => {
  if (db) return db;
  if (dbFailed) return null;

  try {
    const BetterSqlite3 = require('better-sqlite3');
    const dbPath = config.cacheDbPath || path.join(process.cwd(), '.cache', 'anilist-cache.db');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    const instance: Database = new BetterSqlite3(dbPath);
    // WAL: every PM2 cluster worker opens this one file concurrently.
    instance.pragma('journal_mode = WAL');
    instance.pragma('busy_timeout = 5000');
    instance.pragma('synchronous = NORMAL');

    instance.exec('CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value BLOB NOT NULL)');

    stmtGet = instance.prepare('SELECT value FROM cache WHERE key = ?');
    stmtSet = instance.prepare('INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)');
    stmtDel = instance.prepare('DELETE FROM cache WHERE key = ?');

    db = instance;
    return db;
  } catch (error) {
    console.error('SQLite cache init error:', error);
    dbFailed = true; // Fail open — app keeps working without the disk cache.
    return null;
  }
};

// Shared guard + fail-open wrapper for every op.
const withDb = <T>(op: string, fallback: T, fn: () => T): T => {
  if (!getDb()) return fallback;
  try {
    return fn();
  } catch (error) {
    console.error(`SQLite cache ${op} error:`, error);
    return fallback;
  }
};

const get = async <T>(key: string): Promise<T | null> =>
  withDb<T | null>('get', null, () => {
    const row = stmtGet!.get(key) as { value: Buffer } | undefined;
    if (!row) return null;
    try {
      return JSON.parse(zlib.brotliDecompressSync(row.value).toString('utf8')) as T;
    } catch {
      stmtDel!.run(key); // drop a corrupt row so it stops re-missing
      return null;
    }
  });

const set = async (key: string, value: any): Promise<boolean> =>
  withDb('set', false, () => {
    const json = JSON.stringify(value);
    stmtSet!.run(key, zlib.brotliCompressSync(Buffer.from(json, 'utf8'), brotliOpts(json.length)));
    return true;
  });

const del = async (key: string): Promise<boolean> =>
  withDb('del', false, () => {
    stmtDel!.run(key);
    return true;
  });

export const sqliteBackend: CacheBackend = { get, set, del };
