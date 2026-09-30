import type { CSSProperties } from "react";

import {
  BRAND_DOT,
  EYEBROW,
  SECTION_HEAD,
  SECTION_TITLE,
} from "@/app/_components/styles";

// TODO: first-draft copy — confirm "fixed price" and the live preview promise
const STEPS = [
  {
    title: "Discover",
    text: "A call and a short workshop: goals, audience, content. You get a clear scope and a fixed price.",
  },
  {
    title: "Design",
    text: "Wireframes first, then the visual design. Nothing gets built before you’ve approved it.",
  },
  {
    title: "Build",
    text: "Fast, accessible, tested in real browsers. You follow progress on a live preview link.",
  },
  {
    title: "Launch & care",
    text: "We launch, measure and keep improving — or hand over cleanly to your team.",
  },
] as const;

const numeral = (position: number) => String(position).padStart(2, "0");

type StepStyle = CSSProperties & Record<"--step", string>;

/**
 * The track draws at a constant speed from the first waypoint to the last (its `--rise-ease` is linear),
 * so waypoint n is reached at n / (steps − 1) of the draw; it is set down right then.
 */
const TRACK_DRAW_MS = 1200;
const WAYPOINT_MS = TRACK_DRAW_MS / (STEPS.length - 1);
const TEXT_LAG_MS = 90;

/**
 * The same four steps whatever the service: the answer to "what happens after I get in touch?".
 * A route along a track, drawn as the section scrolls in, with one waypoint per step.
 */
export const ProcessSteps = () => (
  <section
    className="mt-[136px] max-md:mt-[88px]"
    aria-labelledby="process-title"
  >
    <div className={SECTION_HEAD} data-reveal>
      <p className={EYEBROW}>
        <span className={BRAND_DOT} aria-hidden="true" />
        How a project runs
      </p>
      <h2 id="process-title" className={SECTION_TITLE}>
        Four steps. No surprises.
      </h2>
    </div>
    {/* The route: a hairline from the first waypoint to the last, with the ink drawn over it. It
        runs to the last waypoint (four columns, 32px gaps, the node's centre 22px in), and turns
        vertical on a phone, down the waypoints' left edge. */}
    <div className="relative">
      <div
        className="absolute top-[22px] right-[calc(25%-46px)] left-[22px] h-px bg-hairline max-md:right-auto max-md:bottom-[60px] max-md:h-auto max-md:w-px md:max-lg:right-[calc(25%-37px)]"
        aria-hidden="true"
      >
        {/* Constant speed, so each waypoint is reached on a known beat. */}
        <span
          className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-brand),oklch(0.5684_0.2129_25.98/0.45))] [--rise-ease:linear] max-md:bg-[linear-gradient(180deg,var(--color-brand),oklch(0.5684_0.2129_25.98/0.45))]"
          data-reveal="draw"
        />
      </div>
      <ol className="grid grid-cols-4 gap-8 max-md:grid-cols-1 md:max-lg:gap-5">
        {STEPS.map((step, index) => {
          const style: StepStyle = { "--step": String(index) };
          return (
            <li
              key={step.title}
              className="max-md:grid max-md:grid-cols-[44px_minmax(0,1fr)] max-md:gap-x-5"
              style={style}
            >
              <span
                className="relative mb-[26px] grid size-11 place-items-center rounded-full bg-core text-[12px] font-semibold text-brand-text tabular-nums shadow-[0_0_0_6px_oklch(1_0_0/0.5),inset_0_0_0_1px_oklch(0.5684_0.2129_25.98/0.22),0_10px_24px_-14px_oklch(0.35_0.1_28/0.5)] [--rise-ease:var(--ease-out)] max-md:m-0"
                aria-hidden="true"
                data-reveal="pop"
                data-reveal-delay={index * WAYPOINT_MS}
              >
                {numeral(index + 1)}
              </span>
              <div
                data-reveal
                data-reveal-delay={index * WAYPOINT_MS + TEXT_LAG_MS}
              >
                <h3 className="text-[21px] font-semibold tracking-[-0.035em] max-md:pt-[9px]">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-[30ch] text-[15px] leading-[1.6] text-pretty text-ink-muted">
                  {step.text}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);
