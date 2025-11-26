const withPWA = require("next-pwa");
const defaultRuntimeCaching = require("./cache");
const { i18n } = require("./next-i18next.config");

const envVars = {
  env: {
    NEXT_PUBLIC_NODE_SERVER_URL: process.env.NEXT_PUBLIC_NODE_SERVER_URL || "http://localhost:3001",
    NEXT_PUBLIC_AniTrek_SERVER_URL: process.env.NEXT_PUBLIC_AniTrek_SERVER_URL || "http://localhost:3011",
    NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "",
    NEXT_PUBLIC_PROXY_SERVER_URL: process.env.NEXT_PUBLIC_PROXY_SERVER_URL || "https://cors-daddy.onrender.com/",
    NEXT_PUBLIC_WEB_PUSH: process.env.NEXT_PUBLIC_WEB_PUSH || "BM_SuH7oXb676nhhzuimIM0kp9nVCxF38Ua6orQyV2MW7CooeysNfsoF-Y82uEgDsTDuhrWErpt4qXsxAe6ab-4",
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || "",
    SENTRY_DSN: process.env.SENTRY_DSN || ""
  }
};

// Separate PWA configuration
const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_middleware\.js$/,
    /_middleware\.js\.map$/,
    /middleware-runtime\.js$/,
    /middleware-runtime\.js\.map$/,
  ],
  runtimeCaching: defaultRuntimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "s4.anilist.co",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "i.ibb.co",
      "thumb.tapecontent.net",
      "emojis.slackmojis.com",
      "pic-bstarstatic.akamaized.net",
      "cdn.discordapp.com",
      "media.kitsu.io",
      "frosty-snyder-1df076.netlify.app",
      "derf9v1xhwwx1.cloudfront.net",
      "www.chatbro.com",
      "chatbro.com",
      "cdn.plyr.io",
      "anitrek.com",
      "image.tmdb.org",
      "f002.backblazeb2.com",
      "anitrek-player-plyr.pages.dev",
      "youtube.com",
      "google.com",
      "jkuhmgfrgofwdtrlbqxj.supabase.co"
    ],
    minimumCacheTTL: 604800, // a week
  },
  i18n,
  ...envVars
};

// Apply PWA config to Next.js config
module.exports = withPWAConfig(nextConfig);

/**
 * 
 *   experimental: {
    fetchCache: 'force-no-store'
  }
 */