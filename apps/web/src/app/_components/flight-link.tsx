"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { startFlight } from "@/app/_lib/flight";

export type FlightLinkProps = Omit<ComponentProps<typeof Link>, "onNavigate">;

/**
 * A link whose client-side navigation is deferred until the content has faded out (see
 * ContentStage). `onNavigate` only fires for plain same-origin clicks, so modifier clicks, external
 * hrefs and downloads keep their native behaviour; a click on the current page is a normal link.
 */
export const FlightLink = ({ href, ...props }: FlightLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onNavigate={(event) => {
        if (typeof href !== "string" || href === pathname) {
          return;
        }
        event.preventDefault();
        startFlight(href);
      }}
      {...props}
    />
  );
};
