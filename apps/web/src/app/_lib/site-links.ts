import type { Route } from "next";

export interface SiteLink {
  href: Route;
  label: string;
}

export const SITE_LINKS: readonly SiteLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
