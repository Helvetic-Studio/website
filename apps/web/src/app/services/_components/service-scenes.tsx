import type { CSSProperties, JSX, ReactNode } from "react";

import { LIVE_DOT } from "@/app/_components/styles";
import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";
import type { ServiceSlug } from "@/app/_lib/services";

/*
 * One drawing per service: the thing the client ends up with, drawn with utilities and sized in
 * container units so it scales with its frame. Every scene is built in three depths — a window,
 * a card floating over it and a small tag in front — and each depth travels a little further than
 * the one behind it when the scene changes (see `ServiceTour`), so a swap reads as depth, not as a
 * slide. Decorative throughout: the chapter beside it says it all in words.
 */

/**
 * How far each depth waits off stage, and when it arrives. The scene layer (the `scene` group)
 * carries the state; the pieces only follow it. Out is quick and together; in is slower, the
 * nearer pieces a beat later.
 */
const DEPTH = {
  window:
    "transition-[translate] duration-[260ms] ease-out group-data-[state=active]/scene:delay-[40ms] group-data-[state=active]/scene:duration-[760ms] motion-safe:group-data-[state=after]/scene:translate-y-[2.5cqi] motion-safe:group-data-[state=before]/scene:-translate-y-[1.5cqi]",
  card: "transition-[translate] duration-[260ms] ease-out group-data-[state=active]/scene:delay-[130ms] group-data-[state=active]/scene:duration-[820ms] motion-safe:group-data-[state=after]/scene:translate-y-[6cqi] motion-safe:group-data-[state=before]/scene:-translate-y-[3.5cqi]",
  tag: "transition-[translate] duration-[260ms] ease-out group-data-[state=active]/scene:delay-[210ms] group-data-[state=active]/scene:duration-[860ms] motion-safe:group-data-[state=after]/scene:translate-y-[9cqi] motion-safe:group-data-[state=before]/scene:-translate-y-[5cqi]",
} as const;

/** The first time a scene is seen it rises with the page's Reveal, nearer pieces a beat later. */
const REVEAL_DELAY = { window: 140, card: 300, tag: 440 } as const;

interface PieceProps {
  /** Where the piece sits in the scene: position and size. */
  className: string;
  children: ReactNode;
}

const TINT_LINE =
  "block h-[1.3cqi] rounded-full bg-[oklch(0.93_0.012_var(--scene-hue))]";

/** A browser window, cropped by the frame like a product shot. */
const SceneWindow = ({
  label,
  className,
  children,
}: PieceProps & { label: string }) => (
  <div
    className={`absolute ${DEPTH.window} ${className}`}
    data-reveal
    data-reveal-delay={REVEAL_DELAY.window}
  >
    <div className="flex size-full flex-col overflow-hidden rounded-[2.4cqi] bg-white text-ink shadow-[0_0_0_1px_oklch(1_0_0/0.7),0_5cqi_10cqi_-5cqi_oklch(0.32_0.1_var(--scene-hue)/0.45)]">
      <div className="flex h-[6cqi] shrink-0 items-center gap-[2.6cqi] bg-[oklch(0.975_0.006_var(--scene-hue))] px-[2.4cqi] shadow-[0_1px_0_oklch(0.9_0.012_var(--scene-hue))]">
        <span className="flex gap-[1cqi] *:size-[1.4cqi] *:rounded-full *:bg-[oklch(0.86_0.01_var(--scene-hue))]">
          <span />
          <span />
          <span />
        </span>
        <span className="truncate rounded-[1.2cqi] bg-white px-[2.6cqi] py-[0.6cqi] text-[1.9cqi] text-ink-muted">
          {label}
        </span>
      </div>
      {children}
    </div>
  </div>
);

/** A card floating over the window. */
const SceneCard = ({ className, children }: PieceProps) => (
  <div
    className={`absolute ${DEPTH.card} ${className}`}
    data-reveal
    data-reveal-delay={REVEAL_DELAY.card}
  >
    <div className="rounded-[2.2cqi] bg-white p-[3.2cqi] text-ink shadow-[0_0_0_1px_oklch(1_0_0/0.9),0_6cqi_12cqi_-6cqi_oklch(0.3_0.1_var(--scene-hue)/0.5)]">
      {children}
    </div>
  </div>
);

/** A small pill in front of everything. */
const SceneTag = ({ className, children }: PieceProps) => (
  <div
    className={`absolute ${DEPTH.tag} ${className}`}
    data-reveal
    data-reveal-delay={REVEAL_DELAY.tag}
  >
    <div className="flex items-center gap-[1.4cqi] rounded-full bg-ink py-[1.3cqi] pr-[2.4cqi] pl-[1.8cqi] text-[1.9cqi] font-semibold whitespace-nowrap text-white shadow-[0_4cqi_8cqi_-4cqi_oklch(0.2_0.02_30/0.6)]">
      {children}
    </div>
  </div>
);

/** The tick of a finished item, in a red disc. */
const Tick = () => (
  <span className="grid size-[2.8cqi] shrink-0 place-items-center rounded-full bg-brand/10 text-brand-text">
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[1.9cqi]"
      aria-hidden="true"
    >
      <path d="m3 7.4 2.6 2.6L11 4.4" />
    </svg>
  </span>
);

/** A site that answers the first question — who are you? — and is found when someone searches. */
const WebsitesScene = () => (
  <>
    <SceneWindow
      label="muster-ag.ch"
      className="top-[12%] right-[-6%] bottom-[20%] left-[10%]"
    >
      <div className="flex items-center justify-between px-[5cqi] pt-[3.6cqi]">
        <span className="text-[2.6cqi] font-[650] tracking-[-0.04em]">
          Muster AG
        </span>
        <span className="flex gap-[2.4cqi] *:h-[1.1cqi] *:w-[6cqi] *:rounded-full *:bg-[oklch(0.92_0.012_var(--scene-hue))]">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="flex flex-1 gap-[4cqi] px-[5cqi] pt-[5.6cqi] pb-[4cqi]">
        <div className="min-w-0">
          <span className="block text-[1.8cqi] font-semibold tracking-[0.14em] text-[oklch(0.52_0.15_var(--scene-hue))] uppercase">
            Carpentry · Wil SG
          </span>
          <span className="mt-[1.6cqi] block text-[5.6cqi] leading-[0.98] font-[640] tracking-[-0.055em] whitespace-nowrap">
            Made to measure.
            <br />
            Made to last.
          </span>
          <span className={`${TINT_LINE} mt-[3cqi] w-[86%]`} />
          <span className={`${TINT_LINE} mt-[1.4cqi] w-[62%]`} />
          <span className="mt-[3.4cqi] inline-flex rounded-full bg-[oklch(0.58_0.2_var(--scene-hue))] px-[3cqi] py-[1.4cqi] text-[1.9cqi] font-semibold text-white">
            Request a quote
          </span>
        </div>
        {/* The hero photograph, as a warm tile with the light coming in from the top. */}
        <span className="flex-1 rounded-[1.8cqi] [background:radial-gradient(70%_60%_at_70%_18%,oklch(0.97_0.03_70)_0%,oklch(0.97_0.03_70/0)_70%),linear-gradient(170deg,oklch(0.8_0.07_55)_0%,oklch(0.62_0.09_40)_100%)]" />
      </div>
    </SceneWindow>
    <SceneCard className="right-[4%] bottom-[5%] w-[54%]">
      <span className="flex items-center gap-[1.6cqi] rounded-full bg-ink/5 px-[2.2cqi] py-[1.2cqi] text-[1.9cqi] text-ink-muted">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="size-[2.2cqi]"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
        carpenter near wil
      </span>
      <span className="mt-[2.6cqi] flex items-center gap-[1.4cqi] text-[1.7cqi] text-ink-muted">
        <span className="size-[2.6cqi] rounded-full bg-[oklch(0.58_0.2_var(--scene-hue))]" />
        muster-ag.ch › carpentry
      </span>
      <span className="mt-[1.2cqi] block text-[2.7cqi] leading-[1.2] font-semibold tracking-[-0.02em]">
        Muster AG — Carpentry in Wil SG
      </span>
      <span className={`${TINT_LINE} mt-[1.6cqi] w-[92%]`} />
      <span className={`${TINT_LINE} mt-[1.2cqi] w-[64%]`} />
    </SceneCard>
    <SceneTag className="top-[5%] left-[6%]">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[2.2cqi]"
        aria-hidden="true"
      >
        <path d="M10.5 3.5 12.5 5.5 6 12H4v-2z" />
      </svg>
      Edit this page
    </SceneTag>
  </>
);

const PAYMENTS = [
  {
    label: "TWINT",
    row: "bg-brand/8 shadow-[inset_0_0_0_1px_oklch(0.5684_0.2129_25.98/0.35)]",
    radio: "border-[0.75cqi] border-brand",
  },
  {
    label: "Card",
    row: "bg-ink/4",
    radio: "border-[0.3cqi] border-ink/20",
  },
  {
    label: "Invoice",
    row: "bg-ink/4",
    radio: "border-[0.3cqi] border-ink/20",
  },
] as const;

/** A product, and a checkout that knows how the Swiss pay. */
const ShopsScene = () => (
  <>
    <SceneWindow
      label="velo-muster.ch"
      className="top-[10%] bottom-[12%] left-[7%] w-[58%]"
    >
      <div className="flex flex-1 flex-col gap-[2.6cqi] p-[3.6cqi]">
        <span className="block flex-1 rounded-[1.8cqi] [background:radial-gradient(circle_at_50%_50%,oklch(0.68_0.16_var(--scene-hue))_0_15%,transparent_16%),radial-gradient(circle_at_50%_50%,oklch(0.9_0.05_var(--scene-hue))_0_29%,transparent_30%),oklch(0.95_0.025_var(--scene-hue))]" />
        <span>
          <span className="block text-[1.6cqi] font-semibold tracking-[0.14em] text-ink-muted uppercase">
            Accessories
          </span>
          <span className="mt-[0.8cqi] block text-[3cqi] font-[620] tracking-[-0.04em]">
            City bike lock
          </span>
          <span className="mt-[0.6cqi] block text-[2.3cqi] font-medium text-ink-soft tabular-nums">
            CHF 49.00
          </span>
        </span>
        <span className="flex h-[5.6cqi] shrink-0 items-center justify-center rounded-full bg-ink text-[1.9cqi] font-semibold text-white">
          Add to cart
        </span>
      </div>
    </SceneWindow>
    <SceneCard className="top-[20%] right-[5%] w-[43%]">
      <span className="block text-[2.6cqi] font-[620] tracking-[-0.03em]">
        Checkout
      </span>
      <span className="mt-[2.2cqi] grid gap-[1.2cqi]">
        {PAYMENTS.map((payment) => (
          <span
            key={payment.label}
            className={`flex items-center gap-[1.6cqi] rounded-[1.4cqi] px-[1.8cqi] py-[1.5cqi] text-[2cqi] font-medium ${payment.row}`}
          >
            <span
              className={`size-[2.4cqi] rounded-full bg-white ${payment.radio}`}
            />
            {payment.label}
          </span>
        ))}
      </span>
      <span className="mt-[2.4cqi] flex justify-between pt-[2cqi] text-[1.8cqi] text-ink-muted shadow-rule">
        Total incl. VAT
        <span className="font-semibold text-ink tabular-nums">CHF 49.00</span>
      </span>
      <span className="mt-[2.2cqi] flex h-[5.6cqi] items-center justify-center rounded-full bg-brand text-[1.9cqi] font-semibold text-white">
        Pay with TWINT
      </span>
    </SceneCard>
    <SceneTag className="right-[9%] bottom-[6%]">
      <span className="size-[1.4cqi] rounded-full bg-brand" />
      Order confirmed · email sent
    </SceneTag>
  </>
);

const REQUESTS = [
  {
    initials: "AK",
    title: "Heating check",
    status: "Open",
    pill: "bg-brand/10 text-brand-text",
  },
  {
    initials: "MB",
    title: "Window repair",
    status: "Scheduled",
    pill: "bg-ink/6 text-ink-soft",
  },
  {
    initials: "SR",
    title: "Annual service",
    status: "Scheduled",
    pill: "bg-ink/6 text-ink-soft",
  },
  {
    initials: "LF",
    title: "New key",
    status: "Done",
    pill: "bg-ink/6 text-ink-muted",
  },
] as const;

/** The week's requests, left to right; the last bar is today. */
const WEEK = [
  "h-[40%] bg-brand/25",
  "h-[64%] bg-brand/25",
  "h-[48%] bg-brand/25",
  "h-[82%] bg-brand/25",
  "h-[58%] bg-brand/25",
  "h-full bg-brand",
] as const;

/** A portal the whole company works in: requests, people, status — no spreadsheet in sight. */
const ApplicationsScene = () => (
  <>
    <SceneWindow
      label="portal.muster.ch"
      className="top-[10%] right-[4%] bottom-[15%] left-[7%]"
    >
      <div className="grid flex-1 grid-cols-[20%_minmax(0,1fr)]">
        <span className="flex flex-col gap-[2.2cqi] bg-[oklch(0.975_0.008_var(--scene-hue))] px-[2.6cqi] py-[3.6cqi] *:h-[1.2cqi] *:rounded-full *:bg-[oklch(0.9_0.015_var(--scene-hue))]">
          <span className="mb-[1.4cqi] h-[4cqi]! w-[4cqi] rounded-[1.2cqi]! bg-brand!" />
          <span className="w-[80%] bg-brand/70!" />
          <span className="w-[66%]" />
          <span className="w-[74%]" />
          <span className="w-[58%]" />
        </span>
        <span className="flex flex-col px-[4cqi] pt-[3.6cqi]">
          <span className="flex items-center justify-between gap-[2cqi]">
            <span className="text-[3.1cqi] font-[620] tracking-[-0.045em]">
              Service requests
            </span>
            <span className="rounded-full bg-ink px-[2.2cqi] py-[1cqi] text-[1.7cqi] font-semibold text-white">
              + New
            </span>
          </span>
          <span className="mt-[2.6cqi] grid">
            {REQUESTS.map((request) => (
              <span
                key={request.initials}
                className="grid grid-cols-[4cqi_minmax(0,1fr)_auto] items-center gap-[2cqi] py-[1.9cqi] not-first:shadow-[0_-1px_0_oklch(0.93_0.01_var(--scene-hue))]"
              >
                <span className="grid size-[4cqi] place-items-center rounded-full bg-[oklch(0.93_0.03_var(--scene-hue))] text-[1.5cqi] font-semibold text-ink-soft">
                  {request.initials}
                </span>
                <span className="truncate text-[2cqi] font-medium">
                  {request.title}
                </span>
                <span
                  className={`rounded-full px-[1.6cqi] py-[0.6cqi] text-[1.6cqi] font-semibold ${request.pill}`}
                >
                  {request.status}
                </span>
              </span>
            ))}
          </span>
        </span>
      </div>
    </SceneWindow>
    <SceneCard className="bottom-[6%] left-[3%] w-[38%]">
      <span className="flex justify-between text-[1.8cqi]">
        <span className="font-semibold">This week</span>
        <span className="text-ink-muted">Requests</span>
      </span>
      <span className="mt-[2.2cqi] flex h-[11cqi] items-end gap-[1.4cqi]">
        {WEEK.map((bar) => (
          <span key={bar} className={`flex-1 rounded-t-[0.8cqi] ${bar}`} />
        ))}
      </span>
    </SceneCard>
    <SceneTag className="top-[4.5%] right-[8%]">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="size-[2.2cqi]"
        aria-hidden="true"
      >
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
        <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
      </svg>
      Signed in · Admin
    </SceneTag>
  </>
);

const SWATCHES = [
  "bg-brand",
  "bg-ink",
  "bg-[oklch(0.9437_0.0219_21.01)]",
  "bg-white shadow-[inset_0_0_0_1px_oklch(0.2393_0_0/0.12)]",
] as const;

/** An artboard on the canvas, labelled the way design files are. */
const Artboard = ({
  label,
  className,
  children,
}: PieceProps & { label: string }) => (
  <div className={`absolute ${className}`}>
    <span className="absolute -top-[3.2cqi] left-0 text-[1.7cqi] font-medium whitespace-nowrap text-ink-muted">
      {label}
    </span>
    <div className="flex size-full flex-col overflow-hidden rounded-[2cqi] bg-white text-ink shadow-[0_0_0_1px_oklch(1_0_0/0.7),0_4cqi_9cqi_-5cqi_oklch(0.32_0.1_var(--scene-hue)/0.4)]">
      {children}
    </div>
  </div>
);

/** The canvas: two artboards, one element selected, and the styles everything is built from. */
const DesignScene = () => (
  <>
    <span className="absolute inset-0 bg-[radial-gradient(oklch(0.5_0.06_var(--scene-hue)/0.28)_0.32cqi,transparent_0.36cqi)] [background-size:3.2cqi_3.2cqi]" />
    <div
      className={`absolute inset-0 ${DEPTH.window}`}
      data-reveal
      data-reveal-delay={REVEAL_DELAY.window}
    >
      <Artboard
        label="Desktop"
        className="top-[19%] right-[-10%] h-[44%] w-[52%]"
      >
        <span className="flex items-center justify-between px-[3cqi] pt-[2.4cqi] *:h-[1cqi] *:rounded-full *:bg-[oklch(0.92_0.012_var(--scene-hue))]">
          <span className="w-[16%] bg-ink/80!" />
          <span className="w-[30%]" />
        </span>
        <span className="mx-[3cqi] mt-[4cqi] block h-[2.4cqi] w-[58%] rounded-full bg-ink/85" />
        <span className="mx-[3cqi] mt-[1.4cqi] block h-[2.4cqi] w-[40%] rounded-full bg-ink/85" />
        <span className="mx-[3cqi] mt-auto mb-[3cqi] grid grid-cols-3 gap-[1.6cqi] *:h-[7cqi] *:rounded-[1.2cqi] *:bg-[oklch(0.95_0.025_var(--scene-hue))]">
          <span />
          <span />
          <span />
        </span>
      </Artboard>
      <Artboard label="Mobile" className="top-[13%] left-[10%] h-[62%] w-[30%]">
        <span className="mx-[2.4cqi] mt-[3cqi] block h-[1cqi] w-[30%] rounded-full bg-ink/80" />
        <span className="mx-[2.4cqi] mt-[3.4cqi] block h-[2cqi] w-[78%] rounded-full bg-ink/85" />
        <span className="mx-[2.4cqi] mt-[1.2cqi] block h-[2cqi] w-[56%] rounded-full bg-ink/85" />
        <span className="mx-[2.4cqi] mt-[2.6cqi] block h-[14cqi] rounded-[1.4cqi] bg-[oklch(0.95_0.025_var(--scene-hue))]" />
        {/* The selected button: a red outline, four handles and its size, the way a design tool marks it. */}
        <span className="relative mx-[2.4cqi] mt-auto mb-[3.6cqi] flex h-[5cqi] items-center justify-center rounded-full bg-brand text-[1.7cqi] font-semibold text-white outline-[0.3cqi] outline-offset-[0.9cqi] outline-brand outline-solid">
          Book now
          <span className="absolute -inset-[0.9cqi] *:absolute *:size-[1.3cqi] *:border-[0.3cqi] *:border-brand *:bg-white">
            <span className="-top-[0.65cqi] -left-[0.65cqi]" />
            <span className="-top-[0.65cqi] -right-[0.65cqi]" />
            <span className="-bottom-[0.65cqi] -left-[0.65cqi]" />
            <span className="-right-[0.65cqi] -bottom-[0.65cqi]" />
          </span>
        </span>
      </Artboard>
    </div>
    <SceneCard className="right-[5%] bottom-[7%] w-[41%]">
      <span className="block text-[1.7cqi] font-semibold tracking-[0.12em] text-ink-muted uppercase">
        Styles
      </span>
      <span className="mt-[2cqi] flex gap-[1.4cqi]">
        {SWATCHES.map((swatch) => (
          <span
            key={swatch}
            className={`size-[4.4cqi] rounded-full ${swatch}`}
          />
        ))}
      </span>
      <span className="mt-[2.4cqi] flex items-baseline gap-[2cqi] pt-[2cqi] shadow-rule">
        <span className="text-[5cqi] leading-none font-semibold tracking-[-0.05em]">
          Aa
        </span>
        <span className="text-[1.8cqi] text-ink-muted">Geist · Semibold</span>
      </span>
    </SceneCard>
    <SceneTag className="top-[73%] left-[27%]">
      <svg
        viewBox="0 0 16 16"
        className="size-[2.2cqi] fill-current"
        aria-hidden="true"
      >
        <path d="M3 2.5 13 7.4l-4.3 1.3L6.6 13z" />
      </svg>
      You · Looks good
    </SceneTag>
  </>
);

const CARE_LOG = [
  "Updates installed",
  "Backups checked",
  "New page published",
  "Check-in booked",
] as const;

/** Visitors over the last months, oldest first, in the chart's 100 × 40 box. */
const VISITS = "0,34 12,31 24,32 36,26 48,27 60,20 72,21 84,13 100,8";

/** The month after launch: the site kept fast and safe, and growing. */
const CareScene = () => (
  <>
    <SceneWindow
      label="Monthly report · October"
      className="top-[11%] right-[4%] bottom-[22%] left-[9%]"
    >
      <div className="flex flex-1 flex-col px-[4.4cqi] pt-[3.6cqi] pb-[3cqi]">
        <span className="flex items-center justify-between">
          <span className="text-[3.1cqi] font-[620] tracking-[-0.045em]">
            Visitors
          </span>
          <span className="flex gap-[1cqi] text-[1.6cqi] font-semibold *:rounded-full *:px-[1.6cqi] *:py-[0.6cqi]">
            <span className="bg-ink/5 text-ink-muted">Quarter</span>
            <span className="bg-ink text-white">Year</span>
          </span>
        </span>
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="mt-auto h-[58%] w-full overflow-visible"
          aria-hidden="true"
        >
          <polygon points={`${VISITS} 100,40 0,40`} className="fill-brand/9" />
          <polyline
            points={VISITS}
            fill="none"
            className="stroke-brand"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="mt-[2cqi] flex justify-between text-[1.5cqi] text-ink-muted">
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
        </span>
      </div>
    </SceneWindow>
    <SceneCard className="bottom-[6%] left-[4%] w-[47%]">
      <span className="block text-[2.2cqi] font-[620] tracking-[-0.03em]">
        This month
      </span>
      <span className="mt-[1.8cqi] grid gap-[1.5cqi]">
        {CARE_LOG.map((item) => (
          <span
            key={item}
            className="flex items-center gap-[1.6cqi] text-[1.9cqi] font-medium"
          >
            <Tick />
            {item}
          </span>
        ))}
      </span>
    </SceneCard>
    <SceneTag className="top-[4.5%] right-[7%]">
      <span className={LIVE_DOT} />
      All systems normal
    </SceneTag>
  </>
);

/** Each service's drawing and the hue of its ground, within the warm range of the brand red. */
const SCENES: Readonly<
  Record<ServiceSlug, { hue: number; Drawing: () => JSX.Element }>
> = {
  websites: { hue: 25, Drawing: WebsitesScene },
  shops: { hue: 42, Drawing: ShopsScene },
  applications: { hue: 16, Drawing: ApplicationsScene },
  design: { hue: 34, Drawing: DesignScene },
  care: { hue: 22, Drawing: CareScene },
};

type SceneStyle = CSSProperties & Record<"--scene-hue", string>;

/**
 * A service, drawn: it fills its frame, on a warm ground with the home range standing in its
 * lower edge.
 */
export const ServiceScene = ({ slug }: { slug: ServiceSlug }) => {
  const { hue, Drawing } = SCENES[slug];
  const style: SceneStyle = { "--scene-hue": String(hue) };

  return (
    <div
      className="@container absolute inset-0 overflow-hidden [background:radial-gradient(90%_80%_at_15%_0%,oklch(0.99_0.01_var(--scene-hue))_0%,oklch(0.99_0.01_var(--scene-hue)/0)_60%),linear-gradient(160deg,oklch(0.96_0.024_var(--scene-hue))_0%,oklch(0.88_0.07_var(--scene-hue))_100%)]"
      style={style}
    >
      <svg
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[42%] w-[120%]"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points={RIDGE_POLYGONS.mid} className="fill-white/25" />
        <polygon points={RIDGE_POLYGONS.near} className="fill-white/35" />
      </svg>
      <Drawing />
    </div>
  );
};
