const config = {
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  adminSupabaseKey: process.env.ADMIN_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  nodeServerUrl: process.env.NEXT_PUBLIC_NODE_SERVER_URL,
  proxyServerUrl: process.env.NEXT_PUBLIC_PROXY_SERVER_URL,
  socketServerUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  webPushPublicKey: process.env.NEXT_PUBLIC_WEB_PUSH,
  AniTrekServer: process.env.NEXT_PUBLIC_AniTrek_SERVER_URL,
  externalPlayerDomain: process.env.EXTERNAL_PLAYER_DOMAIN,
  // "sqlite" = persistent disk cache (VPS), otherwise Upstash. Server-only bare names.
  cacheBackend: process.env.CACHE_BACKEND,
  cacheDbPath: process.env.CACHE_DB_PATH,
};

export default config;
