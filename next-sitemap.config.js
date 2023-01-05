const siteUrl = process.env.SITE_URL || "https://v3.animet.tv";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "weekly",
  exclude: ["/upload/*"],
};

module.exports = config;
