import type { CSSProperties, ReactNode } from "react";

import { FlightLink } from "@/app/_components/flight-link";
import { FADE_WHEN_REDUCED, FOCUS_RING } from "@/app/_components/styles";
import type { Cairn, Gateway } from "@/app/_lib/peaks";
import { PEAKS, pinPosition } from "@/app/_lib/peaks";

// The summits arrive after the headline has risen, so the eye reads the title, then the range.
const ENTRANCE_DELAY_MS = 620;
const ENTRANCE_STAGGER_MS = 90;

const GATEWAY_ICONS: Record<string, ReactNode> = {
  "/services": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
    </svg>
  ),
  "/work": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" opacity="0.35" />
    </svg>
  ),
  "/about": (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" />
    </svg>
  ),
  "/contact": (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 7 12 13.2 20.5 7" />
    </svg>
  ),
};

const GATEWAY_ORDER = new Map(
  PEAKS.filter((peak) => peak.kind === "gateway").map((peak, index) => [
    peak,
    index,
  ])
);

const positionStyle = (summit: { x: number; y: number }): CSSProperties => {
  const { left, top } = pinPosition(summit);
  return { left: `${left}%`, top: `${top}%` };
};

/**
 * The body carries position + counter-scale; the marker inside carries its entrance animation, so
 * a fill-mode:both keyframe never overrides the live transform. `--pin-anchor` is the dot's centre.
 */
const PIN_BODY =
  "absolute top-0 left-0 origin-[50%_var(--pin-anchor)] [transform:translate(-50%,calc(-1*var(--pin-anchor)))_scale(calc(1/var(--zoom-near)))] [transition:transform_var(--zoom-duration)_var(--ease-pin)]";

/** The summit answers the pointer: the stem lengthens, the marker slides down it and lights up. */
const SLIDES_ON_HOVER =
  "motion-safe:pointer-fine:group-hover/pin:translate-y-2 motion-reduce:duration-0";

interface GatewayPinProps {
  gateway: Gateway;
  order: number;
}

// The visible label is the accessible name. The whole ~72×95px column is the target.
const GatewayPin = ({ gateway, order }: GatewayPinProps) => {
  const entrance: CSSProperties & Record<"--pin-delay", string> = {
    "--pin-delay": `${ENTRANCE_DELAY_MS + order * ENTRANCE_STAGGER_MS}ms`,
  };

  return (
    <div className="absolute size-0" style={positionStyle(gateway)}>
      {/* 10px padding + 3.5px radius; 8px + 3.5px on a phone. */}
      <div
        className={`${PIN_BODY} [--pin-anchor:13.5px] max-md:[--pin-anchor:11.5px]`}
      >
        <FlightLink
          href={gateway.route}
          className={`group/pin pointer-events-auto flex flex-col items-center gap-[7px] rounded-[20px] px-3.5 pt-2.5 pb-3 text-ink [-webkit-tap-highlight-color:transparent] animate-[pinIn_700ms_var(--ease-out)_var(--pin-delay)_both] ${FADE_WHEN_REDUCED} in-data-[zoomed=true]:pointer-events-none ${FOCUS_RING} max-md:gap-[5px] max-md:px-1.5 max-md:pt-2 max-md:pb-2.5`}
          style={entrance}
        >
          <span className="relative size-[7px] flex-none rounded-full bg-brand shadow-[0_0_0_2px_#fff,0_0_0_5px_oklch(0.5684_0.2129_25.98/0.16)]" />
          <span className="h-4 w-px flex-none origin-top bg-[linear-gradient(180deg,oklch(0.5684_0.2129_25.98/0),oklch(0.5684_0.2129_25.98/0.5))] transition-transform duration-[320ms] ease-out motion-safe:pointer-fine:group-hover/pin:scale-y-150 motion-reduce:duration-0" />
          {/* A solid disc in a pale ring, not glass: four backdrop blurs riding a scaling layer
              cost frames during the zoom. The ring is the disc's bezel. */}
          <span
            className={`flex size-[46px] flex-none items-center justify-center rounded-full bg-white text-brand shadow-[0_0_0_5px_oklch(1_0_0/0.42),0_1px_2px_oklch(0.2393_0_0/0.08),0_14px_30px_-14px_oklch(0.35_0.1_28/0.55)] [transition:translate_320ms_var(--ease-out),scale_320ms_var(--ease-out),background-color_200ms_ease,color_200ms_ease] pointer-fine:group-hover/pin:bg-brand pointer-fine:group-hover/pin:text-white ${SLIDES_ON_HOVER} group-active/pin:duration-100 motion-safe:group-active/pin:scale-[0.94] max-md:size-[38px] max-md:shadow-[0_0_0_4px_oklch(1_0_0/0.42),0_10px_24px_-12px_oklch(0.35_0.1_28/0.55)] max-md:[&>svg]:size-4`}
          >
            {GATEWAY_ICONS[gateway.route]}
          </span>
          <span
            className={`flex-none rounded-full bg-white/78 px-2.5 py-1 text-[13.5px] font-[580] tracking-[-0.01em] whitespace-nowrap shadow-[inset_0_0_0_1px_oklch(1_0_0/0.95)] [transition:translate_320ms_var(--ease-out),color_200ms_ease] pointer-fine:group-hover/pin:text-brand-text ${SLIDES_ON_HOVER} max-md:px-2 max-md:py-[3px] max-md:text-[12px]`}
          >
            {gateway.label}
          </span>
        </FlightLink>
      </div>
    </div>
  );
};

// TODO: confirm the cairn treatment by eye — specified but never rendered during planning.
/** Cairn: a quiet dot only. Not a link, no stop, no label. */
const CairnPin = ({ cairn }: { cairn: Cairn }) => (
  <div
    className="absolute size-0"
    style={positionStyle(cairn)}
    aria-hidden="true"
  >
    <div className={`${PIN_BODY} [--pin-anchor:3px]`}>
      <span className="block size-1.5 rounded-full bg-brand/42 shadow-[0_0_0_3px_oklch(0.5684_0.2129_25.98/0.08)] animate-[fadeIn_800ms_var(--ease-out)_980ms_both] motion-reduce:animate-none" />
    </div>
  </div>
);

export const PeakPins = () => (
  // Welded to the near layer, contents counter-scaled. Zooming in: fade over the first 40%, then
  // leave the tree entirely.
  <nav
    aria-label="Site sections"
    data-slot="pins"
    className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-(--ridge-height) origin-top-left opacity-(--pins-opacity) will-change-[transform,opacity] [transform:translate(calc(var(--focus-x-pins)*(1_-_var(--zoom-near))),calc(var(--focus-y)*(1_-_var(--zoom-near))))_scale(var(--zoom-near))] [transition:transform_var(--zoom-duration)_var(--ease-near),opacity_calc(var(--zoom-duration)*0.4)_linear_calc(var(--zoom-duration)*0.6),visibility_0s_linear_0s] in-data-[zoomed=true]:invisible in-data-[zoomed=true]:[transition:transform_var(--zoom-duration)_var(--ease-near),opacity_calc(var(--zoom-duration)*0.4)_linear,visibility_0s_linear_var(--zoom-duration)]"
  >
    {PEAKS.map((peak) =>
      peak.kind === "cairn" ? (
        <CairnPin key={`cairn-${peak.x}`} cairn={peak} />
      ) : (
        <GatewayPin
          key={peak.route}
          gateway={peak}
          order={GATEWAY_ORDER.get(peak) ?? 0}
        />
      )
    )}
  </nav>
);
