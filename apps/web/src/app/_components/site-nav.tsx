"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { MobileMenu } from "@/app/_components/mobile-menu";
import {
  buttonClass,
  FOCUS_RING,
  NAV_BRAND,
  NAV_MARK,
} from "@/app/_components/styles";
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

/**
 * A floating island of glass; content scrolls beneath it. As the page scrolls under it the glass
 * thickens — more opaque, a deeper shadow — driven by the scroll position itself, no listener.
 * The `animation` shorthand resets the timeline, so each is followed by its timeline and range
 * (Tailwind emits them in that order). Without scroll timelines the thickening has no duration and
 * fills to its end: the glass starts thick, keeping the links at AA over the closing panels. With
 * reduced motion the drop becomes a fade; the thickening is a state, not motion, and stays.
 */
const NAV_PILL =
  "mx-auto flex max-w-[1160px] items-center justify-between gap-6 rounded-full bg-white/66 py-[7px] pr-[7px] pl-[18px] shadow-[inset_0_0_0_1px_oklch(1_0_0/0.9),0_1px_2px_oklch(0.2393_0_0/0.04),0_18px_40px_-26px_oklch(0.35_0.08_30/0.45)] backdrop-blur-[20px] backdrop-saturate-[170%] [animation:navDrop_620ms_var(--ease-out)_both,navThicken_linear_both] [animation-range:normal,0_160px] [animation-timeline:auto,scroll(root)] motion-reduce:[animation:fadeIn_160ms_ease_both,navThicken_linear_both] motion-reduce:[animation-range:normal,0_160px] motion-reduce:[animation-timeline:auto,scroll(root)] max-nav:pl-4 [@media(prefers-reduced-transparency:reduce)]:bg-surface-top [@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none [body:has([data-slot=menu-sheet])_&]:invisible";

export const SiteNav = () => {
  const pathname = usePathname();
  const activeHref = activeLinkFor(useFlight(), pathname);
  const {
    listRef,
    style: indicatorStyle,
    registerLink,
  } = useIndicator(activeHref);

  return (
    <div className="sticky top-0 z-60 px-(--nav-gutter) pt-(--nav-top) pb-1.5">
      <a
        href="#main-content"
        className="absolute top-6 left-1/2 z-1 -translate-x-1/2 -translate-y-[160%] rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand"
      >
        Skip to content
      </a>
      <nav className={NAV_PILL} aria-label="Primary">
        <FlightLink href="/" className={NAV_BRAND}>
          {/* TODO: placeholder mark — the real Helvetic Studio mark does not exist yet */}
          <span className={NAV_MARK} aria-hidden="true" />
          helvetic.studio
        </FlightLink>
        <ul
          className="relative flex items-center gap-0.5 max-nav:hidden"
          ref={listRef}
        >
          {/* Stretched to the row box so the indicator matches the link's hover area. */}
          <li
            data-slot="nav-indicator"
            className="pointer-events-none absolute inset-y-0 left-0 w-0 rounded-full bg-white/95 opacity-0 shadow-[0_1px_2px_oklch(0.2393_0_0/0.06),0_6px_16px_-8px_oklch(0.35_0.08_30/0.35)] [transition:transform_380ms_var(--ease-drawer),width_380ms_var(--ease-drawer),opacity_180ms_ease] motion-reduce:duration-0"
            style={indicatorStyle}
            aria-hidden="true"
          />
          {SITE_LINKS.map((link) => (
            <li key={link.href}>
              <FlightLink
                href={link.href}
                // Geist is variable, so the active weight interpolates instead of snapping; it rides
                // the same clock as the colour and lands with the indicator. Driven by the flight
                // target, not aria-current: the label lights up at the click, with the indicator.
                className={`relative block rounded-full px-4 py-2.5 text-[14px] font-[480] tracking-[-0.01em] text-ink-muted [transition:color_260ms_ease,font-weight_260ms_ease] pointer-fine:hover:text-ink data-[active=true]:font-semibold data-[active=true]:text-ink ${FOCUS_RING} motion-reduce:duration-0`}
                data-active={link.href === activeHref}
                aria-current={
                  isWithinRoute(pathname, link.href) ? "page" : undefined
                }
                ref={(element) => {
                  registerLink(link.href, element);
                }}
              >
                {/* Every label reserves its own bold width (data-label, re-set by ::after in the
                    active weight), so going active never widens the link and nudges the row. */}
                <span
                  className="block after:invisible after:block after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-label)]"
                  data-label={link.label}
                >
                  {link.label}
                </span>
              </FlightLink>
            </li>
          ))}
        </ul>
        <FlightLink
          href="/contact"
          className={`${buttonClass("primary", "compact")} max-nav:hidden`}
        >
          Get in touch
          <ButtonIcon />
        </FlightLink>
        <MobileMenu pathname={pathname} />
      </nav>
    </div>
  );
};
