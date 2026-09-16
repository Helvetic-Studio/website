import type { MetadataRoute } from "next";

// Stamped once per build so the route stays static under Cache Components.
const BUILT_AT = new Date();

// The real pages only. Work is noindex until its placeholder projects are replaced; the remaining
// stubs are noindex too and do not belong here.
const sitemap = (): MetadataRoute.Sitemap => [
  { url: "https://helvetic.studio", lastModified: BUILT_AT, priority: 1 },
  {
    url: "https://helvetic.studio/services",
    lastModified: BUILT_AT,
    priority: 0.8,
  },
  {
    url: "https://helvetic.studio/about",
    lastModified: BUILT_AT,
    priority: 0.6,
  },
];

export default sitemap;
