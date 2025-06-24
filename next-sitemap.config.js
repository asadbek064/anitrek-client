const siteUrl = process.env.SITE_URL || "https://www.anitrek.com";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "weekly",
  exclude: ["/upload/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "Amazonbot",
        disallow: "/", // block Amazonbot entirely
      },
    ]
  }
};

module.exports = config;
        