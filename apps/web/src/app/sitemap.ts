import type { MetadataRoute } from "next";

// Stamped once per build so the route stays static under Cache Components.
const BUILT_AT = new Date();

// Only the one real page. The stubs are noindex and do not belong here.
const sitemap = (): MetadataRoute.Sitemap => [
  { url: "https://helvetic.studio", lastModified: BUILT_AT, priority: 1 },
];

export default sitemap;
