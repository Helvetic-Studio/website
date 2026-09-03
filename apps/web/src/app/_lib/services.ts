/**
 * The service catalogue: what Helvetic Studio sells, in the order it is sold. Every service owns a
 * Work filter (`/work/<slug>`), so a visitor goes from "what you do" to "what you did" in one click.
 */
// TODO: first-draft copy — confirm the promises (TWINT and invoice, fixed price, monthly report)

export type ServiceSlug =
  | "websites"
  | "shops"
  | "applications"
  | "design"
  | "care";

/** The Work page narrowed to one service. One static page per service exists. */
export type WorkRoute = `/work/${ServiceSlug}`;

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** The outcome in one line, under the title. */
  promise: string;
  description: string;
  /** What the client receives, in the order it usually happens. */
  deliverables: readonly string[];
  goodFor: string;
  /** Heading and lede of the Work page when this service is the filter. */
  workTitle: string;
  workLede: string;
  /** The link from the service to its work. */
  workLinkLabel: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: "websites",
    title: "Websites",
    promise: "Your company's front door.",
    description:
      "A company site should load fast, read clearly and make the next step obvious. We plan the structure, write around your content, design in your brand and build it to last — on a CMS you can edit yourself.",
    deliverables: [
      "Structure and page plan",
      "Design in your brand",
      "Fast, accessible build",
      "SEO foundations",
      "A CMS you edit yourself",
    ],
    goodFor:
      "Companies that need a site customers trust and search engines can find.",
    workTitle: "Websites we've built",
    workLede: "Company sites, landing pages and relaunches.",
    workLinkLabel: "See websites we've built",
  },
  {
    slug: "shops",
    title: "Online shops",
    promise: "Sell in Switzerland without friction.",
    description:
      "A shop that fits how Swiss customers actually pay: TWINT, cards and invoice, with shipping and VAT handled correctly. Connected to your stock and accounting, so orders don't turn into admin.",
    deliverables: [
      "Product catalogue and checkout",
      "TWINT, cards and invoice",
      "Shipping, VAT and returns rules",
      "Order and shipping emails",
      "Stock and accounting integrations",
    ],
    goodFor:
      "Retailers and brands that want to sell online without hiring an admin team.",
    workTitle: "Shops we've built",
    workLede: "Online shops with Swiss payment methods built in.",
    workLinkLabel: "See shops we've built",
  },
  {
    slug: "applications",
    title: "Web applications",
    promise: "Custom tools for the work off-the-shelf software can't do.",
    description:
      "Customer portals, booking systems, dashboards and internal tools — built on the web, so there is nothing to install and everyone sees the same data. We start with a prototype you can click through, then build in short, reviewed iterations.",
    deliverables: [
      "Workshop and clickable prototype",
      "Secure login and user roles",
      "Database, API and integrations",
      "Hosting, backups and monitoring",
      "Training and documentation",
    ],
    goodFor:
      "Companies replacing spreadsheets, email chains or a tool that no longer fits.",
    workTitle: "Applications we've built",
    workLede: "Portals, booking systems and internal tools.",
    workLinkLabel: "See applications we've built",
  },
  {
    slug: "design",
    title: "Design",
    promise: "Interfaces people understand at first glance.",
    description:
      "Web design, UI and UX — from the first wireframe to a design system your team can build on. We design in Figma, test the flows with real content, and hand over files developers can actually use. Yours, or ours.",
    deliverables: [
      "UX flows and wireframes",
      "Visual design in Figma",
      "Clickable prototype",
      "Design system and components",
      "Developer handover",
    ],
    goodFor:
      "Teams with their own developers, and products that need a stronger interface.",
    workTitle: "Design work",
    workLede: "Interfaces, flows and design systems.",
    workLinkLabel: "See our design work",
  },
  {
    slug: "care",
    title: "Care & growth",
    promise: "Launch is the start, not the finish.",
    description:
      "We keep what we built fast, secure and up to date, and use real usage data to make it better every month. Content changes, new features and SEO work happen on a plan, not in emergencies.",
    deliverables: [
      "Updates and security patches",
      "Uptime and performance monitoring",
      "Content and feature changes",
      "SEO and conversion tuning",
      "Monthly report and check-in",
    ],
    goodFor:
      "Any site or app that matters to the business and shouldn't quietly decay.",
    workTitle: "Sites and apps we look after",
    workLede: "Ongoing care, improvements and growth.",
    workLinkLabel: "See what we look after",
  },
];

export const workRouteFor = (slug: ServiceSlug): WorkRoute => `/work/${slug}`;

/** The service a URL segment names, if any. Unknown segments come from the address bar. */
export const serviceBySlug = (slug: string): Service | undefined =>
  SERVICES.find((service) => service.slug === slug);
