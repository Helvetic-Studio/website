import type { Service, ServiceSlug } from "@/app/_lib/services";
import { SERVICES } from "@/app/_lib/services";

export interface Project {
  slug: string;
  title: string;
  /** Who the client is, in a few words: sector and place. */
  client: string;
  year: number;
  /** What was built, in one line. Results and numbers only once they are real. */
  summary: string;
  services: readonly ServiceSlug[];
  /** The live site, when it is public. */
  url?: string;
  /** Hue of the placeholder cover tile, within the warm range of the brand red. */
  coverHue: number;
}

// TODO: placeholder projects — replace with real case studies and cover images (next/image)
// before lifting the Work noindex. Names and clients are invented.
export const PROJECTS: readonly Project[] = [
  {
    slug: "alpstein-treuhand",
    title: "Alpstein Treuhand",
    client: "Fiduciary · St. Gallen",
    year: 2026,
    summary:
      "Relaunch with a clear service overview and online appointment booking.",
    services: ["websites", "design"],
    coverHue: 25,
  },
  {
    slug: "rheintal-bikes",
    title: "Rheintal Bikes",
    client: "Retail · Buchs",
    year: 2026,
    summary:
      "Online shop with TWINT and click-and-collect for the local store.",
    services: ["shops"],
    coverHue: 45,
  },
  {
    slug: "saentis-facility",
    title: "Säntis Facility",
    client: "Facility management · Gossau",
    year: 2026,
    summary: "Customer portal for service requests, schedules and invoices.",
    services: ["applications"],
    coverHue: 15,
  },
  {
    slug: "toggenburg-tourismus",
    title: "Toggenburg Tourismus",
    client: "Tourism · Wildhaus",
    year: 2025,
    summary: "Multilingual site with an events calendar and seasonal content.",
    services: ["websites", "care"],
    coverHue: 55,
  },
  {
    slug: "nova-dental",
    title: "Nova Dental",
    client: "Health · Zürich",
    year: 2025,
    summary:
      "Brand refresh and a site that makes booking a check-up a two-minute job.",
    services: ["design", "websites"],
    coverHue: 5,
  },
  {
    slug: "walensee-charters",
    title: "Walensee Charters",
    client: "Leisure · Weesen",
    year: 2025,
    summary:
      "Booking system with availability, deposits and automatic confirmations.",
    services: ["applications", "shops"],
    coverHue: 35,
  },
  {
    slug: "bodensee-kanzlei",
    title: "Bodensee Kanzlei",
    client: "Law · Rorschach",
    year: 2025,
    summary: "Ongoing care: updates, security and monthly content changes.",
    services: ["care"],
    coverHue: 20,
  },
];

export const projectsFor = (slug: ServiceSlug): readonly Project[] =>
  PROJECTS.filter((project) => project.services.includes(slug));

/** A project's services in catalogue order, for its tags. */
export const servicesOf = (project: Project): readonly Service[] =>
  SERVICES.filter((service) => project.services.includes(service.slug));
