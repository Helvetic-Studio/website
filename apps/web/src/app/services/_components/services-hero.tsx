import type { CSSProperties } from "react";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import {
  BEZEL,
  BEZEL_CORE,
  BRAND_DOT,
  buttonClass,
  FADE_WHEN_REDUCED,
  FOCUS_RING,
  PAGE_EYEBROW,
  PAGE_LINK,
} from "@/app/_components/styles";
import { SERVICES } from "@/app/_lib/services";
import { numeral } from "@/app/services/_lib/tour";

const TITLE: readonly (readonly TitleWord[])[] = [
  [{ text: "Five" }, { text: "services." }],
  [
    { text: "One", accent: true },
    { text: "team.", accent: true },
  ],
];

const MICRO =
  "text-[11px] leading-[1.5] font-semibold tracking-[0.12em] uppercase";

type RowStyle = CSSProperties & Record<"--row", string>;

/**
 * A row is felt on hover only where hover is real: the arrow disc fills and leans the way the
 * link goes (down the page). The press is felt everywhere.
 */
const ROUTE =
  "group/route grid min-h-[68px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] px-4 py-3 [-webkit-tap-highlight-color:transparent] [transition:background-color_200ms_ease,scale_160ms_var(--ease-out)] pointer-fine:hover:bg-brand/5 motion-safe:active:scale-[0.985] max-md:px-3";
const ROUTE_DISC =
  "grid size-[34px] place-items-center rounded-full bg-brand/8 text-brand-text [transition:background-color_200ms_ease,color_200ms_ease,translate_220ms_var(--ease-out)] pointer-fine:group-hover/route:bg-brand pointer-fine:group-hover/route:text-white motion-safe:pointer-fine:group-hover/route:translate-y-[2px] [&>svg]:size-[15px] [&>svg]:rotate-90";
// The rows follow the card in, one beat apart.
const ROUTE_ENTER = `animate-[riseIn_700ms_var(--ease-out)_calc(420ms_+_var(--row)*60ms)_both] ${FADE_WHEN_REDUCED}`;

/**
 * The visitor's way in: the situation in their own words, finishing "I need…", each one a jump to
 * the service that answers it. Plain anchors: the page scrolls, nothing flies.
 */
const NeedRouter = () => (
  <nav
    aria-labelledby="need-router-title"
    className={`${BEZEL} animate-[riseIn_1000ms_var(--ease-out)_280ms_both] ${FADE_WHEN_REDUCED}`}
  >
    <div className={`${BEZEL_CORE} px-3 pt-[26px] pb-3 max-md:px-2`}>
      <div className="px-4 pb-3 max-md:px-3">
        <p className={`${MICRO} text-warm-muted`}>Find your starting point</p>
        <p
          id="need-router-title"
          className="mt-1.5 text-[26px] leading-[1.15] font-semibold tracking-[-0.045em]"
        >
          I need…
        </p>
      </div>
      <ul>
        {SERVICES.map((service, index) => {
          const style: RowStyle = { "--row": String(index) };
          return (
            <li
              key={service.slug}
              // Hairlines between the rows, inset so a hovered row's tint never meets them.
              className={`relative not-first:before:absolute not-first:before:inset-x-4 not-first:before:top-0 not-first:before:h-px not-first:before:bg-hairline not-first:before:content-[''] ${ROUTE_ENTER}`}
              style={style}
            >
              <a href={`#${service.slug}`} className={`${ROUTE} ${FOCUS_RING}`}>
                <span
                  className="text-[12px] font-semibold text-brand-text tabular-nums"
                  aria-hidden="true"
                >
                  {numeral(index + 1)}
                </span>
                <span>
                  <span className="block text-[16.5px] leading-[1.3] font-[560] tracking-[-0.02em] text-balance text-ink">
                    <span className="sr-only">I need </span>
                    {service.need}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-muted">
                    {service.title}
                  </span>
                </span>
                {/* The site's arrow, turned to point down the page. */}
                <span className={ROUTE_DISC} aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mx-1 mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[18px] bg-ink/3 py-2 pr-2 pl-4 text-[14px] text-ink-muted">
        Something else in mind?
        <FlightLink href="/contact" className={`${PAGE_LINK} px-2`}>
          Tell us the goal
          <ArrowIcon />
        </FlightLink>
      </p>
    </div>
  </nav>
);

/**
 * The page's promise and its way in, side by side: what the studio offers on the left, the
 * visitor's own situation on the right. One column on narrower screens, the words first.
 */
export const ServicesHero = () => (
  <header className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-[clamp(40px,6vw,80px)] pt-2 pb-[120px] max-lg:grid-cols-1 max-lg:gap-12 max-md:pb-20">
    <div>
      <p className={PAGE_EYEBROW}>
        <span className={BRAND_DOT} aria-hidden="true" />
        Services
      </p>
      <MaskedTitle
        lines={TITLE}
        className="m-0 text-[clamp(52px,5.6vw,84px)] leading-[0.98] font-semibold tracking-[-0.06em] [--words-delay:120ms] max-md:text-[clamp(48px,14vw,72px)]"
      />
      <p
        className={`mt-7 max-w-[38ch] text-[clamp(17px,1.45vw,20px)] leading-[1.6] tracking-[-0.01em] text-pretty text-ink-muted animate-[riseIn_800ms_var(--ease-out)_380ms_both] ${FADE_WHEN_REDUCED}`}
      >
        Websites, online shops, web applications, design and care. Planned,
        built and looked after by the same small team, so nothing gets lost in a
        hand-off.
      </p>
      <div
        className={`mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 animate-[riseIn_800ms_var(--ease-out)_460ms_both] ${FADE_WHEN_REDUCED}`}
      >
        <FlightLink href="/contact" className={buttonClass("primary")}>
          Start a project
          <ButtonIcon />
        </FlightLink>
        <p className="text-[12.5px] leading-[1.6] text-ink-muted">
          A price range before
          <br />
          you commit to anything.
        </p>
      </div>
    </div>
    <NeedRouter />
  </header>
);
