const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isDev = process.env.NODE_ENV === "development";


module.exports = {
  backend: {
    backendOptions: [{ expirationTime: isDev ? 60 : 60 * 60 * 1000 },
    {
      loadPath: require('path').resolve('/locales/{{lng}}/{{ns}}.json')
    }
    ], // 1 hour
    backends:
      typeof window !== "undefined" ? [LocalStorageBackend, HttpBackend] : [],
  },
  i18n: {
    locales: ["en", "de", "ru", "es", "cn", "id"],
    defaultLocale: "en"
  },
  localePath: require('path').resolve('./public/locales'),
  localeDetection: false,
  serializeConfig: false,
  use: typeof window !== "undefined" ? [ChainedBackend] : [],
};
