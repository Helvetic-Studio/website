"use client";

import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { FlightLink } from "@/app/_components/flight-link";
import { MobileMenu } from "@/app/_components/mobile-menu";
import { useFlight } from "@/app/_lib/flight";
import { SITE_LINKS } from "@/app/_lib/site-links";

interface Indicator {
  x: number;
  width: number;
}

export const SiteNav = () => {
  const pathname = usePathname();
  const flight = useFlight();
  // The indicator leads: it moves at the click, while aria-current waits for the URL.
  const target = flight?.target ?? pathname;
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  // Measured, not morphed: the indicator follows the active link's real box. Each link reserves
  // its bold width in CSS, so a box only changes when the row itself is laid out again.
  useEffect(() => {
    const list = listRef.current;
    const active = linkRefs.current.get(target);

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
  }, [target]);

  // Width, not scaleX: scaling would squash the pill's end caps into ellipses
  // while the hover background keeps true semicircles.
  const indicatorStyle: CSSProperties = indicator
    ? {
        opacity: 1,
        width: `${indicator.width}px`,
        transform: `translate3d(${indicator.x}px, 0, 0)`,
      }
    : { opacity: 0 };

  return (
    <div className="site-nav">
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
                data-active={link.href === target}
                aria-current={link.href === pathname ? "page" : undefined}
                ref={(element) => {
                  if (element) {
                    linkRefs.current.set(link.href, element);
                  } else {
                    linkRefs.current.delete(link.href);
                  }
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
