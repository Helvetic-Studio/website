import { cn } from "@website/ui/lib/utils";
import type { ReactNode } from "react";

import { BEZEL, EYEBROW_SHAPE } from "@/app/_components/styles";
import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

export interface ClosingPanelProps {
  /** Red for the site's moment of decision; ink for a quieter, personal close. */
  tone: "red" | "ink";
  id: string;
  title: string;
  text: string;
  eyebrow?: string;
  /** Spacing from the section above; merged over the default. */
  className?: string;
  /** The buttons. */
  children: ReactNode;
}

const TONES = {
  red: "[background:radial-gradient(90%_70%_at_50%_0%,oklch(0.64_0.2_30)_0%,oklch(0.64_0.2_30/0)_70%),var(--color-brand)] shadow-[inset_0_1px_0_oklch(1_0_0/0.28),0_30px_70px_-40px_oklch(0.5684_0.2129_25.98/0.9)]",
  // Night over the range: the front ridge keeps the last of the alpenglow.
  ink: "[--ridge-back:oklch(1_0_0/0.05)] [--ridge-front:oklch(0.5684_0.2129_25.98/0.55)] [background:radial-gradient(90%_70%_at_50%_0%,var(--color-night-glow)_0%,oklch(0.36_0.02_30/0)_70%),var(--color-night)] shadow-[inset_0_1px_0_oklch(1_0_0/0.14),0_30px_70px_-40px_oklch(0.2_0.02_30/0.8)]",
} as const;

/**
 * The close of a content page: one solid surface in a bezel, with the home range standing in its
 * lower edge — the way back to every door. Red is the site's one solid red surface, kept for the
 * moment of decision. Rises into view with the page's Reveal.
 */
export const ClosingPanel = ({
  tone,
  id,
  title,
  text,
  eyebrow,
  className,
  children,
}: ClosingPanelProps) => (
  <section
    className={cn(BEZEL, "mt-[136px] max-md:mt-[88px]", className)}
    aria-labelledby={id}
    data-reveal
  >
    <div
      className={`relative overflow-hidden rounded-core px-6 pt-[clamp(52px,7vw,96px)] pb-[clamp(128px,15vw,200px)] text-center text-white max-md:px-5 ${TONES[tone]}`}
    >
      <svg
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[62%] w-[120%]"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          points={RIDGE_POLYGONS.mid}
          className="[fill:var(--ridge-back,oklch(1_0_0/0.07))]"
        />
        <polygon
          points={RIDGE_POLYGONS.near}
          className="[fill:var(--ridge-front,oklch(1_0_0/0.11))]"
        />
      </svg>
      {eyebrow === undefined ? null : (
        <p
          className={`${EYEBROW_SHAPE} relative bg-white/10 text-white/88 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.18)]`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="relative mx-auto max-w-[16ch] text-[clamp(34px,4.8vw,62px)] leading-none font-semibold tracking-[-0.055em] text-balance"
      >
        {title}
      </h2>
      {/* 0.96: 0.86 fell to ~3:1 on the gradient's lighter top. */}
      <p className="relative mx-auto mt-5 max-w-[520px] text-[clamp(16px,1.35vw,18px)] leading-[1.55] text-balance text-white/96">
        {text}
      </p>
      <div className="relative mt-[34px] flex flex-wrap items-center justify-center gap-2.5">
        {children}
      </div>
    </div>
  </section>
);
