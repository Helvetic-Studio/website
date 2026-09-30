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

import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import {
  buttonClass,
  FOCUS_RING,
  NAV_BRAND,
  NAV_MARK,
} from "@/app/_components/styles";
import { isWithinRoute } from "@/app/_lib/routes";
import { SITE_LINKS } from "@/app/_lib/site-links";

export interface MobileMenuProps {
  pathname: string;
}

type ItemStyle = CSSProperties & Record<"--item", string>;

const GLYPH_LINE =
  "absolute inset-x-0 h-[1.5px] rounded-[1px] bg-current [transition:transform_360ms_var(--ease-drawer)] motion-reduce:duration-0";

// Crossed, except while the sheet unrolls or rolls up: the X starts from, and returns to, level.
const CROSSED =
  "in-data-ending-style:[transform:none] in-data-starting-style:[transform:none]";

/**
 * Two lines. The trigger shows them level; the sheet's close button shows the same two lines
 * crossed and starts from level, so opening reads as one icon morphing into an X in the same
 * pixels.
 */
const MenuGlyph = ({ crossed = false }: { crossed?: boolean }) => (
  <span className="relative block h-3 w-[18px]" aria-hidden="true">
    <span
      className={`${GLYPH_LINE} top-[2.5px] ${crossed ? `[transform:translateY(3.25px)_rotate(45deg)] ${CROSSED}` : ""}`}
    />
    <span
      className={`${GLYPH_LINE} bottom-[2.5px] ${crossed ? `[transform:translateY(-3.25px)_rotate(-45deg)] ${CROSSED}` : ""}`}
    />
  </span>
);

const MENU_BUTTON = `size-[46px] cursor-pointer items-center justify-center rounded-full border-0 bg-ink/4 text-ink [-webkit-tap-highlight-color:transparent] [transition:background-color_180ms_ease,scale_140ms_var(--ease-out)] pointer-fine:hover:bg-ink/8 motion-safe:active:scale-[0.94] ${FOCUS_RING} motion-reduce:duration-0`;

/**
 * Reveals from the pill's exact outline: the modal header occupies the same pixels as the original
 * header, so only the lower edge moves. Important where it replaces the Sheet's own slide and fade.
 * With reduced motion the sheet fades in place instead.
 */
const MENU_SHEET = `z-70! mx-auto max-h-[calc(100dvh-var(--nav-top)-12px)] max-w-[1160px] overflow-y-auto overscroll-contain rounded-[calc(var(--nav-compact-height)/2)] border-0! bg-surface-top/97! px-0 pt-0 pb-[max(14px,env(safe-area-inset-bottom))] text-ink! shadow-[inset_0_0_0_1px_oklch(1_0_0/0.9),0_30px_60px_-30px_oklch(0.35_0.08_30/0.45)]! backdrop-blur-[28px] backdrop-saturate-[170%] inset-x-(--nav-gutter)! top-(--nav-top)! [clip-path:inset(0_0_0_0_round_calc(var(--nav-compact-height)/2))] data-ending-style:translate-none! data-starting-style:translate-none! motion-safe:[transition:clip-path_380ms_var(--ease-drawer)]! motion-safe:data-ending-style:duration-[260ms]! motion-safe:data-ending-style:opacity-100! motion-safe:data-starting-style:opacity-100! motion-safe:data-ending-style:[clip-path:inset(0_0_calc(100%_-_var(--nav-compact-height))_0_round_calc(var(--nav-compact-height)/2))] motion-safe:data-starting-style:[clip-path:inset(0_0_calc(100%_-_var(--nav-compact-height))_0_round_calc(var(--nav-compact-height)/2))] motion-reduce:[transition:opacity_160ms_ease]! [@media(prefers-reduced-transparency:reduce)]:bg-surface-top! [@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none`;

// The links come up out of the unrolling sheet one after another.
const MENU_ITEM =
  "motion-safe:[transition:opacity_320ms_var(--ease-out)_calc(70ms_+_var(--item)*45ms),transform_520ms_var(--ease-out)_calc(70ms_+_var(--item)*45ms)] motion-safe:in-data-starting-style:opacity-0 motion-safe:in-data-starting-style:[transform:translate3d(0,16px,0)] motion-safe:in-data-ending-style:opacity-0 motion-safe:in-data-ending-style:delay-0 motion-safe:in-data-ending-style:duration-[140ms] motion-reduce:[transition:opacity_160ms_ease] motion-reduce:in-data-ending-style:opacity-0 motion-reduce:in-data-starting-style:opacity-0";

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
            className={`hidden max-nav:inline-flex ${MENU_BUTTON}`}
            aria-label="Open menu"
          />
        }
      >
        <MenuGlyph />
      </SheetTrigger>
      <SheetContent
        side="top"
        data-slot="menu-sheet"
        className={MENU_SHEET}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex min-h-[calc(var(--nav-compact-height)-2px)] shrink-0 items-center justify-between py-[7px] pr-[7px] pl-4 leading-[1.5]">
          <FlightLink href="/" className={NAV_BRAND} onClick={close}>
            <span className={NAV_MARK} aria-hidden="true" />
            helvetic.studio
          </FlightLink>
          <SheetClose
            render={
              <button
                type="button"
                className={`inline-flex ${MENU_BUTTON}`}
                aria-label="Close menu"
              />
            }
          >
            <MenuGlyph crossed />
          </SheetClose>
        </div>
        <ul className="mx-2 mt-2.5 flex flex-col gap-0.5">
          {SITE_LINKS.map((link, index) => {
            const style: ItemStyle = { "--item": String(index) };
            return (
              <li key={link.href} className={MENU_ITEM} style={style}>
                <FlightLink
                  href={link.href}
                  className={`group/link flex items-baseline gap-3.5 rounded-[18px] px-3.5 py-2.5 text-[30px] leading-[1.15] font-[560] tracking-[-0.045em] text-ink [transition:background-color_180ms_ease,color_180ms_ease] pointer-fine:hover:bg-ink/4 active:bg-ink/6 aria-[current=page]:text-brand-text ${FOCUS_RING}`}
                  aria-current={
                    isWithinRoute(pathname, link.href) ? "page" : undefined
                  }
                  onClick={close}
                >
                  <span
                    className="min-w-[1.6em] text-[11px] font-semibold tracking-[0.04em] text-ink-muted tabular-nums group-aria-[current=page]/link:text-brand-text"
                    aria-hidden="true"
                  >
                    {numeral(index + 1)}
                  </span>
                  {link.label}
                </FlightLink>
              </li>
            );
          })}
        </ul>
        <div className="mt-[18px] mr-3 ml-4 flex items-center justify-between gap-4 pt-[18px] shadow-rule">
          <FlightLink
            href="/contact"
            className={buttonClass("primary")}
            onClick={close}
          >
            Get in touch
            <ButtonIcon />
          </FlightLink>
          <p className="text-[12px] text-ink-muted">Wil SG · Switzerland</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
