import type { MetadataRoute } from "next";

const SITE_URL = "https://helvetic.studio";

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: SITE_URL,
    lastModified: new Date(),
  },
];

export default sitemap;
