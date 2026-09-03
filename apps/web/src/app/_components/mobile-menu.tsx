"use client";

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@website/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@website/ui/components/sheet";
import { cn } from "@website/ui/lib/utils";
import { useState } from "react";

import { FlightLink } from "@/app/_components/flight-link";
import { isWithinRoute } from "@/app/_lib/routes";
import { SITE_LINKS } from "@/app/_lib/site-links";

export interface MobileMenuProps {
  pathname: string;
}

// Below 768 the pill unrolls into a top Sheet. Not a Drawer: five links want no drag physics.
// The sheet covers the pill and repeats its header row, because a modal dialog hides everything
// outside itself from assistive technology — the pill's own trigger cannot be the close control.
export const MobileMenu = ({ pathname }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="nav-menu-button"
            aria-label="Open menu"
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} size={22} strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="top" className="menu-sheet" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="menu-head">
          <FlightLink href="/" className="nav-brand" onClick={close}>
            <span className="nav-mark" aria-hidden="true" />
            helvetic.studio
          </FlightLink>
          <SheetClose
            render={
              <button
                type="button"
                className="nav-menu-button"
                aria-label="Close menu"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={2} />
          </SheetClose>
        </div>
        <ul className="menu-list">
          {SITE_LINKS.map((link) => (
            <li key={link.href}>
              <FlightLink
                href={link.href}
                className="menu-link"
                aria-current={
                  isWithinRoute(pathname, link.href) ? "page" : undefined
                }
                onClick={close}
              >
                {link.label}
              </FlightLink>
            </li>
          ))}
        </ul>
        <FlightLink
          href="/contact"
          className={cn(buttonVariants(), "nav-cta menu-cta")}
          onClick={close}
        >
          Get in touch
        </FlightLink>
      </SheetContent>
    </Sheet>
  );
};
