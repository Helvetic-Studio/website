"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@website/ui/components/sheet";
import type { CSSProperties } from "react";
import { useState } from "react";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { isWithinRoute } from "@/app/_lib/routes";
import { SITE_LINKS } from "@/app/_lib/site-links";

export interface MobileMenuProps {
  pathname: string;
}

type ItemStyle = CSSProperties & Record<"--item", string>;

/**
 * Two lines drawn in CSS. The trigger shows them level; the sheet's close button shows the same
 * two lines crossed and starts from level, so opening reads as one icon morphing into an X.
 */
const MenuGlyph = () => (
  <span className="menu-glyph" aria-hidden="true">
    <span />
    <span />
  </span>
);

const numeral = (position: number) => String(position).padStart(2, "0");

// Below 960 the pill unrolls into a top Sheet. Not a Drawer: five links want no drag physics.
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
        <MenuGlyph />
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
                className="nav-menu-button is-close"
                aria-label="Close menu"
              />
            }
          >
            <MenuGlyph />
          </SheetClose>
        </div>
        <ul className="menu-list">
          {SITE_LINKS.map((link, index) => {
            const style: ItemStyle = { "--item": String(index) };
            return (
              <li key={link.href} className="menu-item" style={style}>
                <FlightLink
                  href={link.href}
                  className="menu-link"
                  aria-current={
                    isWithinRoute(pathname, link.href) ? "page" : undefined
                  }
                  onClick={close}
                >
                  <span className="menu-link-number" aria-hidden="true">
                    {numeral(index + 1)}
                  </span>
                  {link.label}
                </FlightLink>
              </li>
            );
          })}
        </ul>
        <div className="menu-foot">
          <FlightLink
            href="/contact"
            className="button button-primary menu-cta"
            onClick={close}
          >
            Get in touch
            <span className="button-icon">
              <ArrowIcon />
            </span>
          </FlightLink>
          <p className="menu-note">Wil SG · Switzerland</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
