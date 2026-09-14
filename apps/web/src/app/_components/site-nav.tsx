"use client";

import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { FlightLink } from "@/app/_components/flight-link";
import { MobileMenu } from "@/app/_components/mobile-menu";
import type { Flight } from "@/app/_lib/flight";
import { useFlight } from "@/app/_lib/flight";
import { isWithinRoute } from "@/app/_lib/routes";
import { SITE_LINKS } from "@/app/_lib/site-links";

interface Indicator {
  x: number;
  width: number;
}

/**
 * Measured, not morphed: the indicator follows the active link's real box. Each link reserves its
 * bold width in CSS, so a box only changes when the row itself is laid out again.
 */
const useIndicator = (activeHref: string) => {
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = linkRefs.current.get(activeHref);

    const measure = () => {
      if (!(list && active)) {
        setIndicator(null);
        return;
      }
      // Rects, not offsets: offsetLeft/offsetWidth round to whole pixels and
      // leave the indicator a fraction narrower than the link it traces.
      const listBox = list.getBoundingClientRect();
      const activeBox = active.getBoundingClientRect();
      setIndicator({
        x: activeBox.left - listBox.left,
        width: activeBox.width,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (list) {
      observer.observe(list);
    }
    return () => {
      observer.disconnect();
    };
  }, [activeHref]);

  // Width, not scaleX: scaling would squash the pill's end caps into ellipses
  // while the hover background keeps true semicircles.
  const style: CSSProperties = indicator
    ? {
        opacity: 1,
        width: `${indicator.width}px`,
        transform: `translate3d(${indicator.x}px, 0, 0)`,
      }
    : { opacity: 0 };

  const registerLink = (href: string, element: HTMLAnchorElement | null) => {
    if (element) {
      linkRefs.current.set(href, element);
    } else {
      linkRefs.current.delete(href);
    }
  };

  return { listRef, style, registerLink };
};

/**
 * The link the indicator sits on. It leads: the flight's target from the click, while aria-current
 * waits for the URL. A Work filter lights the Work link; a page outside the links lights nothing.
 */
const activeLinkFor = (flight: Flight | null, pathname: string): string => {
  const target = flight === null ? pathname : flight.target;
  const active = SITE_LINKS.find((link) => isWithinRoute(target, link.href));
  return active === undefined ? target : active.href;
};

export const SiteNav = () => {
  const pathname = usePathname();
  const activeHref = activeLinkFor(useFlight(), pathname);
  const {
    listRef,
    style: indicatorStyle,
    registerLink,
  } = useIndicator(activeHref);

  return (
    <div className="site-nav">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav className="nav-pill" aria-label="Primary">
        <FlightLink href="/" className="nav-brand">
          {/* TODO: placeholder mark — the real Helvetic Studio mark does not exist yet */}
          <span className="nav-mark" aria-hidden="true" />
          helvetic.studio
        </FlightLink>
        <ul className="nav-links" ref={listRef}>
          <li
            className="nav-indicator"
            style={indicatorStyle}
            aria-hidden="true"
          />
          {SITE_LINKS.map((link) => (
            <li key={link.href}>
              <FlightLink
                href={link.href}
                className="nav-link"
                data-active={link.href === activeHref}
                aria-current={
                  isWithinRoute(pathname, link.href) ? "page" : undefined
                }
                ref={(element) => {
                  registerLink(link.href, element);
                }}
              >
                {/* data-label is the width reservation: ::after re-sets it in the active weight. */}
                <span className="nav-label" data-label={link.label}>
                  {link.label}
                </span>
              </FlightLink>
            </li>
          ))}
        </ul>
        <FlightLink href="/contact" className={cn(buttonVariants(), "nav-cta")}>
          Get in touch
        </FlightLink>
        <MobileMenu pathname={pathname} />
      </nav>
    </div>
  );
};
