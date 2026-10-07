import type { CSSProperties, ReactNode } from "react";

import {
  BEZEL,
  BEZEL_CORE,
  BRAND_DOT,
  EYEBROW,
  SECTION_TITLE,
  SWISS_CROSS,
} from "@/app/_components/styles";
import { numeral } from "@/app/services/_lib/tour";

/** Hairline marks, drawn for these steps: a compass, layers, code, a line going up. */
const StepIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// TODO: first-draft copy — confirm "fixed price" and the live preview promise
const STEPS = [
  {
    title: "Discover",
    text: "A call and a short workshop: your goals, your audience, your content.",
    outcome: "A clear scope and a fixed price.",
    icon: (
      <StepIcon>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15 9-1.8 4.2L9 15l1.8-4.2z" />
      </StepIcon>
    ),
  },
  {
    title: "Design",
    text: "Wireframes first, then the visual design. Nothing is built before you’ve approved it.",
    outcome: "A design you’ve signed off.",
    icon: (
      <StepIcon>
        <path d="M12 4 3.5 8.5 12 13l8.5-4.5z" />
        <path d="m3.5 12.5 8.5 4.5 8.5-4.5" />
        <path d="m3.5 16 8.5 4.5 8.5-4.5" />
      </StepIcon>
    ),
  },
  {
    title: "Build",
    text: "Fast, accessible and tested in real browsers. You follow every step on a live preview.",
    outcome: "A preview link, all the way.",
    icon: (
      <StepIcon>
        <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />
      </StepIcon>
    ),
  },
  {
    title: "Launch & care",
    text: "We launch, measure and keep improving — or hand over cleanly to your team.",
    outcome: "A site that keeps working for you.",
    icon: (
      <StepIcon>
        <path d="m4 17 5-5 3.5 3.5L20 8" />
        <path d="M15 8h5v5" />
      </StepIcon>
    ),
  },
] as const;

type StepStyle = CSSProperties & Record<"--climb", string>;

/** Each step stands this much higher than the one before it, on a wide screen. */
const STEP_RISE = "lg:mt-[calc(var(--climb)*56px)]";

/** The steps arrive one after another, from the foot of the climb; then the flag goes in. */
const STEP_BEAT_MS = 120;
const FLAG_DELAY_MS = STEPS.length * STEP_BEAT_MS + 260;

/** The summit's flag: a pole and the Swiss cross, planted on the last step. */
const SummitFlag = () => (
  <span
    className="absolute -top-[46px] right-9 flex origin-bottom-left items-start max-lg:hidden"
    aria-hidden="true"
    data-reveal="pop"
    data-reveal-delay={FLAG_DELAY_MS}
  >
    <span className="h-[46px] w-[1.5px] rounded-full bg-ink-soft" />
    <span
      className={`${SWISS_CROSS} rounded-[4px] shadow-[0_6px_14px_-6px_oklch(0.5684_0.2129_25.98/0.8)]`}
    />
  </span>
);

/**
 * The same four steps whatever the service: the answer to "what happens after I get in touch?".
 * Set as a climb — each step a little higher than the last, the launch at the top — and each one
 * ends in what the client holds at that point.
 */
export const ProcessClimb = () => (
  <section className="pt-[136px] max-md:pt-24" aria-labelledby="process-title">
    <div
      className="mb-20 flex items-end justify-between gap-x-12 gap-y-6 max-lg:mb-14 max-lg:flex-col max-lg:items-start max-md:mb-10"
      data-reveal
    >
      <div>
        <p className={EYEBROW}>
          <span className={BRAND_DOT} aria-hidden="true" />
          How a project runs
        </p>
        <h2 id="process-title" className={SECTION_TITLE}>
          Four steps.
          <br />
          No surprises.
        </h2>
      </div>
      <p className="max-w-[34ch] text-[15.5px] leading-[1.65] text-pretty text-ink-muted">
        The same route for every service. You always know what comes next, and
        the price is fixed before anything is built.
      </p>
    </div>
    <ol className="grid grid-cols-4 items-start gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
      {STEPS.map((step, index) => {
        const style: StepStyle = {
          "--climb": String(STEPS.length - 1 - index),
        };
        return (
          <li
            key={step.title}
            className={`${BEZEL} relative ${STEP_RISE}`}
            style={style}
            data-reveal
            data-reveal-delay={index * STEP_BEAT_MS}
          >
            {index === STEPS.length - 1 ? <SummitFlag /> : null}
            <div
              className={`${BEZEL_CORE} flex min-h-[320px] flex-col px-6 pt-6 pb-[22px] max-lg:min-h-0`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-[15px] bg-brand/8 text-brand-text">
                  {step.icon}
                </span>
                <span
                  className="text-[13px] font-semibold text-ink-muted tabular-nums"
                  aria-hidden="true"
                >
                  {numeral(index + 1)}
                </span>
              </div>
              <h3 className="mt-9 text-[23px] leading-[1.1] font-semibold tracking-[-0.045em]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-pretty text-ink-muted">
                {step.text}
              </p>
              <p className="mt-auto pt-6">
                <span className="block pt-[18px] text-[11px] font-semibold tracking-[0.12em] text-brand-text uppercase shadow-rule">
                  You get
                </span>
                <span className="mt-1.5 block text-[15.5px] leading-[1.4] font-[560] tracking-[-0.015em] text-ink">
                  {step.outcome}
                </span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);
