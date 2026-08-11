import type { MetadataRoute } from "next";

const SITE_URL = "https://helvetic.studio";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;
