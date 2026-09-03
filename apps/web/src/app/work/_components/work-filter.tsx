"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { SERVICES, workRouteFor } from "@/app/_lib/services";

/**
 * One chip per service plus the whole. Plain links, not flights: every filter is a page of the
 * Work summit, so the camera stays and only the grid changes. `prefetch` resolves each filter's
 * page ahead of the click, so the swap is instant; `scroll={false}` because the chips sit at the
 * top and a jump would read as a reload.
 */
export const WorkFilter = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="work-filter" aria-label="Filter by service">
      <Link
        href="/work"
        className="filter-chip"
        aria-current={segment === null ? "page" : undefined}
        prefetch={true}
        scroll={false}
      >
        All work
      </Link>
      {SERVICES.map((service) => (
        <Link
          key={service.slug}
          href={workRouteFor(service.slug)}
          className="filter-chip"
          aria-current={segment === service.slug ? "page" : undefined}
          prefetch={true}
          scroll={false}
        >
          {service.title}
        </Link>
      ))}
    </nav>
  );
};
