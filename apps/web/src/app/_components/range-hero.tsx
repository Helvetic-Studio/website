import type { ReactNode } from "react";

import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import {
  BRAND_DOT,
  FADE_WHEN_REDUCED,
  LIVE_DOT,
} from "@/app/_components/styles";

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
 * is not a gateway (the 404), where the markers below are the ways on. Every vertical size is in
 * vh so the block shrinks with the viewport and stays clear of the summits; `--ridge-height` is
 * derived from the same budget.
 */
export const RangeHero = ({ badge, title, lede, children }: RangeHeroProps) => (
  <div className="mx-auto box-border max-w-[1040px] px-6 pt-[clamp(20px,4.5vh,48px)] text-center max-md:px-5 max-md:pt-[clamp(32px,5svh,52px)] max-md:pb-12">
    <p
      className={`mb-[clamp(12px,2.2vh,24px)] inline-flex items-center gap-2.5 rounded-full bg-white/66 py-[7px] pr-3.5 pl-[11px] text-[13px] font-[520] tracking-[-0.005em] text-ink-soft shadow-[inset_0_0_0_1px_oklch(1_0_0/0.95),0_10px_24px_-18px_oklch(0.35_0.08_30/0.5)] animate-[riseIn_700ms_var(--ease-out)_60ms_both] ${FADE_WHEN_REDUCED} max-md:max-w-full max-md:text-[12px] max-md:leading-[1.5]`}
    >
      <span
        className={badge.live === true ? LIVE_DOT : BRAND_DOT}
        aria-hidden="true"
      />
      <span>{badge.lead}</span>
      <span className="h-3 w-px bg-hairline" aria-hidden="true" />
      <span className="text-ink-muted">{badge.note}</span>
    </p>
    <MaskedTitle
      lines={title}
      className="m-0 text-[clamp(38px,min(7.8vw,9.4vh),92px)] leading-none font-[620] tracking-[-0.058em] text-balance max-md:text-[clamp(38px,11.4vw,64px)] max-md:leading-[1.02]"
    />
    <p
      className={`mx-auto mt-[clamp(12px,2.2vh,22px)] max-w-[520px] text-[clamp(16px,2.1vh,20px)] leading-[1.5] tracking-[-0.01em] text-ink-muted text-balance animate-[riseIn_800ms_var(--ease-out)_460ms_both] ${FADE_WHEN_REDUCED} max-md:mt-[18px] max-md:max-w-[30ch] max-md:text-[16px]`}
    >
      {lede}
    </p>
    <div
      className={`mt-[clamp(16px,2.8vh,30px)] flex flex-wrap items-center justify-center gap-2.5 animate-[riseIn_800ms_var(--ease-out)_560ms_both] ${FADE_WHEN_REDUCED} max-md:mt-6`}
    >
      {children}
    </div>
  </div>
);
