import type { ReactNode } from "react";

import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";

export interface RangeHeroProps {
  /** The badge's lead ("Swiss web studio", "404") and the quieter note after the rule. */
  badge: { lead: string; note: string; live?: boolean };
  title: readonly (readonly TitleWord[])[];
  lede: string;
  /** The buttons. */
  children: ReactNode;
}

/**
 * Text standing over the whole range, clear of the summits: the home page, and any address that
 * is not a gateway (the 404), where the markers below are the ways on. Heights live in vh in CSS
 * (`.hero`), budgeted against `--ridge-height`.
 */
export const RangeHero = ({ badge, title, lede, children }: RangeHeroProps) => (
  <div className="hero">
    <p className="hero-badge">
      <span
        className={badge.live === true ? "live-dot" : "brand-dot"}
        aria-hidden="true"
      />
      <span>{badge.lead}</span>
      <span className="hero-badge-rule" aria-hidden="true" />
      <span className="hero-badge-note">{badge.note}</span>
    </p>
    <MaskedTitle lines={title} className="hero-title" />
    <p className="hero-lede">{lede}</p>
    <div className="hero-actions">{children}</div>
  </div>
);
