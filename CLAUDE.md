# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AniTrek — a multi-language anime/manga discovery & tracking client. Next.js 12 (Pages Router), React 17, TypeScript, TailwindCSS, Supabase, react-query. Data is aggregated from AniList (GraphQL), TMDB, trace.moe (AI scene search), and animethemes.moe. No streaming sources are hosted here.

> Current state: the project is effectively in archive mode. AniList now enforces CORS/rate limits, which is why so much of the codebase is proxy + cache machinery (see "AniList data flow" below). Several backend URLs (`NEXT_PUBLIC_SOCKET_SERVER_URL`, `NEXT_PUBLIC_NODE_SERVER_URL`) are dead in production.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`); Node `<20.16.0`. Docs under `.ai/` say `yarn` — that's stale, use pnpm.

- `pnpm dev` — dev server (port 3000; PWA disabled in dev)
- `pnpm build` — production build (`postbuild` runs `next-sitemap`)
- `pnpm start` — serve production build on port **3033**
- `pnpm lint` — `next lint` (eslint, `next/core-web-vitals`)
- `pnpm ts` — typecheck only (`tsc --noEmit --incremental`); `pnpm ts:watch` to watch

There is **no test framework** configured — do not assume jest/vitest or invent test commands. TypeScript `strict` is off.

Path alias: `@/*` → `src/*`.

## AniList data flow (the core of this codebase)

`src/services/anilist/` is the primary data source and the most load-bearing subsystem.

- `queries.ts` — GraphQL queries are **string-template builder functions** (`mediaQuery`, `mediaDetailsQuery`, `charactersQuery`, …), not `.graphql`/`gql`. "Fragments" are exported field-set string constants (`mediaDefaultFields`, etc.) interpolated in; every builder takes an optional `fields` override.
- `index.ts` — `anilistFetcher` + adapters (`getMedia`, `getMediaDetails`, `getPageMedia`, `getCharacters`/`getStaff`/`getStudios`, …). **Dual transport**: on the server it POSTs directly to `https://graphql.anilist.co` with server-side caching (`@/lib/cache`, see "Caching" below); on the client it POSTs to the internal `/api/anilist` route to dodge CORS. Cache key = `md5(query + variables)`.
- On AniList `429`, it falls back to a rotating proxy pool (`src/services/proxy/`, driven by `process.env.PROXY_ENDPOINT`). This is **separate** from the CORS/streaming proxy below.
- `getMedia`/`getMediaDetails` enrich AniList data by joining the Supabase `kaguya_translations` table, falling back to TMDB translations.

Two distinct proxy mechanisms — don't conflate them:
1. **CORS/streaming proxy** — `config.proxyServerUrl` (`NEXT_PUBLIC_PROXY_SERVER_URL`), via `createProxyUrl()` in `src/utils/index.ts`. Wraps video/manga source URLs for playback.
2. **AniList rate-limit proxy pool** — `src/services/proxy/`, only used inside `anilistFetcher` / `api/anilist.ts` on 429.

## Rendering & pages (`src/pages/`)

Three deliberate strategies by page type:

- **Pure SSG (no `revalidate`)** for public catalog detail pages: `anime/details`, `manga/details`, `characters/details`, `voice-actors/details`, `studios` — all `getStaticProps` + `getStaticPaths({ paths: [], fallback: "blocking" })`. Time-based ISR was intentionally removed for cost (see `.ai/COST_OPTIMIZATION.md`); content is refreshed only via **on-demand `POST /api/revalidate`** (guarded by `REVALIDATE_SECRET`) or a full rebuild.
- **`getServerSideProps`** for fresh/dynamic pages: watch/read pages, `reviews/[id]`, `wwf/[...params]`, `themes`, `sitemap-index.xml` — query Supabase directly (`kaguya_anime_source` → `kaguya_episodes`/`kaguya_sources`).
- **Auth-gated SSR** via `withAdditionalUser(...)` HOC (injects the extended `AdditionalUser`) — the whole `upload/*` CMS tree, `watchlist`; a few use Supabase's `withPageAuth`.

Dynamic content routes use catch-all `[...params]` (e.g. `/anime/details/{mediaId}/{sourceMediaId}`; `params[0]` = AniList media id).

`src/pages/api/` is a thin layer — only 5 endpoints: `anilist.ts` (cached GraphQL proxy), `redis.ts` (generic KV cache with circuit breaker), `ai-scene-search/recent-searches.ts`, `auth/[...supabase].ts`, `revalidate.ts`. Most data is fetched directly from AniList/Supabase in services/hooks.

## App wiring & state

`src/pages/_app.tsx` composes providers (outer→inner): `QueryClientProvider` → `UserProvider` (Supabase auth-helpers) → `SubscriptionContextProvider` → `GlobalPlayerContextProvider` → `ErrorBoundary`. The `QueryClient` disables refetch-on-focus/mount/reconnect and skips retries on 429/4xx. Per-page layouts via `Component.getLayout` (defaults to `BaseLayout`; watch/read pages return the page bare, upload pages use `UploadLayout`).

- **Contexts** (`src/contexts/`) are fine-grained, one-per-concern: video (`GlobalPlayerContext`, `WatchContext`, `CustomVideoStateContext`), manga reader (`Read*Context`), watch-together rooms (`Room*Context` holding a `socket.io-client` socket + `peerjs` peer), themes, comments (`CommentReplyContext`), `SubscriptionContext`.
- **Hooks** (`src/hooks/`, ~100 files) are the runtime data layer: AniList `useQuery` wrappers, Supabase CRUD query/mutation hooks, auth hooks (`useSyncUser`, `useSignIn`, `useSignInEmail`), player/media utilities, and generic DOM hooks. Reusable Supabase+react-query wrappers live in `src/utils/supabase.ts` (`useSupabaseQuery`, `useSupabaseSingleQuery`, `useSupaInfiniteQuery`, 30-item pages).
- **HOCs** (`src/hocs/`): `withAuthRedirect` (client guard), `withAdditionalUser` (SSR user + `users` table join), `withRedirect` (conditional client redirect).

## Supabase & auth

- Two Supabase clients coexist: the auth-aware `supabaseClient` from `@supabase/auth-helpers-nextjs` (used app-wide via `<UserProvider>` and everywhere access/session is needed) vs. a plain anon `createClient` in `src/lib/supabase.ts` (used **only** by `sitemap-index.xml.tsx`). Default to the auth-helpers client.
- Edge `middleware.ts` = `withMiddlewareAuth({ redirectTo: "/login" })`; `api/auth/[...supabase].ts` = `handleAuth(...)`.
- Tables are the `kaguya_*` schema (this project is a fork of Kaguya) plus `users` (extended profile: `authRole`, `isVerified`).

## Caching & cost optimization

Read `.ai/REDIS_FREE_TIER_OPTIMIZATIONS.md` and `.ai/COST_OPTIMIZATION.md` before touching caching/revalidation — they encode hard constraints:

- **Cache** = pluggable backend in `src/lib/cache/`, chosen by `CACHE_BACKEND` env. On the VPS (`sqlite`) it's a persistent, brotli-compressed **SQLite** disk cache (`sqlite-backend.ts` via `better-sqlite3`) that stores every response **forever** — no TTL, no size cap — so SSR never re-hits AniList. Otherwise (serverless: Vercel/Netlify) it falls back to **Upstash** (`upstash-backend.ts`, `@upstash/redis` REST, resolves `UPSTASH_REDIS_REST_URL`/`_TOKEN` first, else `REDIS_URL`/`REDIS_TOKEN`; circuit breaker + 10 MB guard). `src/lib/redis.ts` is now a thin re-export of `@/lib/cache`, so the two importers (`services/anilist/index.ts`, `api/anilist.ts`) are unchanged. All cache ops fail silently (GET→null, SET→false) and never crash a request; the backend is lazy-`require`d server-only, and `better-sqlite3` is externalized server-side + aliased off the client bundle (`next.config.js`). Note: `api/redis.ts` is a **separate** generic `ioredis` KV endpoint, not this cache. Purge the disk cache with `DELETE FROM cache` (keys are `md5(query+vars)`, so no per-entity invalidation).
- Free-tier rules to respect: `MAX_PAGES = 10` pagination cap, no nested retries, 10s AniList timeouts. `CACHE_TTL` in `src/services/anilist/index.ts` (lists 1d, details/characters/staff/studio 30d, airing 6h) applies **only to the Upstash fallback** — the SQLite backend ignores TTLs and caches permanently.
- **PWA** (`next-pwa`): Workbox `runtimeCaching` in `cache.js`; `/api/auth/*` is deliberately excluded from caching (breaks OAuth in Safari otherwise). `worker/index.js` is the push-notification service-worker handler (not a job queue).
- `vercel.json` caps function durations (API 5s, pages 30s). Deploy targets: Vercel (`vercel.json`) and Netlify (`netlify.toml`, `@netlify/plugin-nextjs`).

## i18n (two parallel systems)

1. **UI strings** — `next-i18next`. Locales configured in `next-i18next.config.js`: `en, de, ru, es, cn, id` (default `en`, `localeDetection: false`). Translations are namespaced JSON in `public/locales/<lang>/*.json` (~28 namespaces). Pages call `serverSideTranslations(locale, [...namespaces])`; components use `useTranslation(ns)`.
2. **Enum labels** — hand-written per-language constant bundles in `src/constants/{en,es,ru,cn,id}.ts` (season/format/status/genre/sort labels, etc.), selected by `getConstantTranslation(locale)` in `src/utils/data.ts`. `convert()` maps enum ↔ localized label.

Known gaps: no `de.ts` constant bundle (German enum labels fall back to English), and `src/utils/data.ts` has a duplicate `case "cn"` that shadows `id`. A `public/locales/vi` dir also exists (Vietnamese — the project's original language, source of the `vietnameseSlug` slug util) though `vi` isn't in the config.

## Types (`src/types/`)

- `anilist.ts` — ~1360 lines auto-generated from the AniList schema, marked **DO NOT MODIFY**. Canonical `Media` (unified anime+manga), `Character`, `Staff`, `Studio`, `MediaList`, pagination, and all the enums (`MediaFormat`, `MediaStatus`, `MediaSeason`, `MediaSort`, …).
- `index.ts` — the app's own domain layer that extends AniList: `Episode`, `Chapter`, `Source`, `Video`/`Subtitle`/`Font`, `Comment`/`CommentReaction`, `Review`, `Room`/`Chat`, `SourceStatus<T>`, `AdditionalUser`, etc. Re-exports `Media`. This split (external/generated vs app domain) is intentional.

## Key UI subsystems

- **Video player** — `src/components/features/anime/Player/`, built on the `netplayer` library with custom desktop/mobile controls, HLS (`hls.js`), skip-intro/timestamp panels. Subtitles: SRT/VTT via `@plussub/srt-vtt-parser`; styled `.ass` + custom fonts via `libass-wasm` (SubtitlesOctopus).
- **Comment engine** — `src/components/features/comment/` (ported from supabase-comments-extension): nested replies, reactions, and a TipTap editor (`Editor.tsx`) with a custom spoiler node.
- **Manga reader** — `src/components/features/manga/Reader/` with vertical/horizontal/RTL modes driven by `ReadSettingsContext`.
- **Watch-together rooms** — `features/trivia/RoomPage/` and `features/wwf/RoomPage/` are **near-identical duplicates** (synced player + text chat + WebRTC audio over `RoomContext`); a dedup candidate if extending.

## Conventions

- Feature-based colocation under `src/components/features/*`; shared primitives in `src/components/shared/`. Files/folders are mixed-case here (existing pattern is PascalCase components, camelCase utils) — match the surrounding directory.
- Env config is centralized in `src/config.ts` (all endpoint URLs derive from env). A populated `.env` exists locally (gitignored) with real credentials for Supabase/Upstash/TMDB.
- Commit tooling: commitizen/git-cz config in `changelog.config.js` (conventional commits), though recent history doesn't strictly follow it.
