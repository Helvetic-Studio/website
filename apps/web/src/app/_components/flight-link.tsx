"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { startFlight } from "@/app/_lib/flight";
import { summitFor } from "@/app/_lib/peaks";
import type { SiteRoute } from "@/app/_lib/routes";

export type FlightLinkProps = Omit<LinkProps<SiteRoute>, "onNavigate">;

/**
 * A link whose client-side navigation is deferred until the content has faded out (see
 * ContentStage). `onNavigate` only fires for plain same-origin clicks, so modifier clicks, external
 * hrefs and downloads keep their native behaviour. A click within the current summit — the page
 * itself, or another Work filter — is a plain navigation: the camera would not move, so the content
 * does not fade either.
 */
export const FlightLink = ({ href, ...props }: FlightLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        if (
          typeof href !== "string" ||
          summitFor(href) === summitFor(pathname)
        ) {
          return;
        }
        event.preventDefault();
        startFlight(href);
      }}
      {...props}
    />
  );
};
