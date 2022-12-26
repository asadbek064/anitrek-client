const withPWA = require("next-pwa");
const defaultRuntimeCaching = require("./cache");
const { i18n } = require("./next-i18next.config");

const envVars = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:"https://ybqceoexfwjelfmcyvqv.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicWNlb2V4ZndqZWxmbWN5dnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE4MjM4NjAsImV4cCI6MTk4NzM5OTg2MH0.Wz4dz2b7m3GZzllP9L9FOU1G4B7VLjKRZdM_4xH_tvE",
    NEXT_PUBLIC_NODE_SERVER_URL:"http://localhost:3001",
    NEXT_PUBLIC_ANIMETTV_SERVER_URL:"http://localhost:3011",
    NEXT_PUBLIC_SOCKET_SERVER_URL:"",
    NEXT_PUBLIC_PROXY_SERVER_URL:"https://cors-daddy.onrender.com/",
    NEXT_PUBLIC_WEB_PUSH:"BM_SuH7oXb676nhhzuimIM0kp9nVCxF38Ua6orQyV2MW7CooeysNfsoF-Y82uEgDsTDuhrWErpt4qXsxAe6ab-4",
    SENTRY_AUTH_TOKEN:"34dae03c4b0811ed9e9f4ed53395ef1a",
    SENTRY_DSN: "https://97cdd21525fe4685b8d62348e2d39c66@o610195.ingest.sentry.io/4503976885354496",
    NODE_ENV: "production",
  }
}
const moduleExports = withPWA({
  future: { webpack: true },
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
      "img.animet.site",
      "media.kitsu.io",
      "frosty-snyder-1df076.netlify.app",
      "derf9v1xhwwx1.cloudfront.net",
    ],
    minimumCacheTTL: 604800, // a week,
  },
  pwa: {
    dest: "public",
    buildExcludes: [
      /middleware-manifest\.json$/,
      /_middleware\.js$/,
      /_middleware\.js\.map$/,
      /middleware-runtime\.js$/,
      /middleware-runtime\.js\.map$/,
    ],
    disable: process.env.NODE_ENV === "development",
    runtimeCaching: defaultRuntimeCaching,
  },
  i18n,
  envVars,
});

module.exports = moduleExports;

