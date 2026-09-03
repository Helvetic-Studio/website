import type { Route } from "next";

import type { WorkRoute } from "@/app/_lib/services";

/**
 * Any internal page a link can fly to. `Route` on its own is the static pages: the Work filters
 * are one dynamic route, so they are named here for the flight and the links to accept them.
 */
export type SiteRoute = Route | WorkRoute;

/** Whether `pathname` is `route` itself or a page beneath it. Nothing lies beneath the home page. */
export const isWithinRoute = (pathname: string, route: string): boolean =>
  pathname === route || (route !== "/" && pathname.startsWith(`${route}/`));
