const siteUrl = process.env.SITE_URL || "https://app.anitrek.co";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "weekly",
  exclude: ["/upload/*"],
};

module.exports = config;
        