import type { MetadataRoute } from "next";

// Stubs are kept out of the index by their own `robots: { index: false }`. A disallow here would
// stop them being crawled at all, so the noindex could never be discovered.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: "https://helvetic.studio/sitemap.xml",
});

export default robots;
