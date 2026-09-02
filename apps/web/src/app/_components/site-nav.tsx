"use client";

import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { MobileMenu } from "@/app/_components/mobile-menu";
import { SITE_LINKS } from "@/app/_lib/site-links";

const INDICATOR_BASE_WIDTH = 100;

interface Indicator {
  x: number;
  width: number;
}

export const SiteNav = () => {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  // Measured, not morphed: the indicator follows the active link's real box.
  useEffect(() => {
    const measure = () => {
      const active = linkRefs.current.get(pathname);
      if (!active) {
        setIndicator(null);
        return;
      }
      setIndicator({ x: active.offsetLeft, width: active.offsetWidth });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) {
      observer.observe(listRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const indicatorStyle: CSSProperties = indicator
    ? {
        opacity: 1,
        transform: `translate3d(${indicator.x}px, 0, 0) scaleX(${indicator.width / INDICATOR_BASE_WIDTH})`,
      }
    : { opacity: 0 };

  return (
    <div className="site-nav">
      <nav className="nav-pill" aria-label="Primary">
        <Link href="/" className="nav-brand">
          {/* TODO: placeholder mark — the real Helvetic Studio mark does not exist yet */}
          <span className="nav-mark" aria-hidden="true" />
          helvetic.studio
        </Link>
        <ul className="nav-links" ref={listRef}>
          <li
            className="nav-indicator"
            style={indicatorStyle}
            aria-hidden="true"
          />
          {SITE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link"
                aria-current={link.href === pathname ? "page" : undefined}
                ref={(element) => {
                  if (element) {
                    linkRefs.current.set(link.href, element);
                  } else {
                    linkRefs.current.delete(link.href);
                  }
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" className={cn(buttonVariants(), "nav-cta")}>
          Get in touch
        </Link>
        <MobileMenu pathname={pathname} />
      </nav>
    </div>
  );
};
