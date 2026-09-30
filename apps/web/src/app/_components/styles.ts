/**
 * The site's shared Tailwind recipes: class lists for the primitives every page is built from, so a
 * surface, a heading or a button reads the same wherever it appears. Page-specific styling stays in
 * the component that renders it.
 */

/** Focus on glass: white halo + 2px red ring, never the browser outline. */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:shadow-focus";

/**
 * Entrances keep their fade and lose their travel when motion is reduced: the same fill mode and
 * easing, a short fade instead of the keyframes, and no stagger.
 */
export const FADE_WHEN_REDUCED =
  "motion-reduce:[animation-name:fadeIn] motion-reduce:[animation-duration:160ms] motion-reduce:[animation-delay:0ms]";

/** The double bezel's translucent shell; its child is a `BEZEL_CORE`. */
export const BEZEL = "rounded-shell bg-shell p-(--bezel) shadow-shell";

/** The solid core set in a bezel. Its radius stays concentric with the shell's. */
export const BEZEL_CORE = "rounded-core bg-core shadow-core";

/** The small pill above a heading, without its colours. */
export const EYEBROW_SHAPE =
  "mb-[22px] inline-flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2.5 text-[11px] leading-[1.4] font-semibold tracking-[0.12em] uppercase";

/** The small pill above a heading. */
export const EYEBROW = `${EYEBROW_SHAPE} bg-white/62 text-brand-text shadow-pill`;

/** The eyebrow as it opens a page: it rises in with the title. */
export const PAGE_EYEBROW = `${EYEBROW} animate-[riseIn_700ms_var(--ease-out)_60ms_both] ${FADE_WHEN_REDUCED}`;

/** The red dot with a halo that marks the brand's voice in an eyebrow. */
export const BRAND_DOT =
  "block size-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_0_3px_oklch(0.5684_0.2129_25.98/0.14)]";

/** Available: a dot that breathes, slowly, with a ring that leaves it. */
export const LIVE_DOT =
  "relative block size-[7px] shrink-0 rounded-full bg-brand after:absolute after:inset-0 after:rounded-full after:bg-brand after:content-[''] after:animate-[livePulse_2.4s_var(--ease-out)_1.2s_infinite] motion-reduce:after:animate-none";

/** The Swiss flag, drawn: a red tile with a white cross. */
export const SWISS_CROSS =
  "relative inline-block size-[18px] shrink-0 rounded-[5px] bg-brand before:absolute before:inset-x-[3.5px] before:inset-y-[7.5px] before:bg-white before:content-[''] after:absolute after:inset-x-[7.5px] after:inset-y-[3.5px] after:bg-white after:content-['']";

/** A content page's column. */
export const PAGE =
  "mx-auto box-border w-full max-w-[1160px] px-6 pt-[72px] pb-32 max-md:px-4 max-md:pt-9 max-md:pb-[88px]";

export const PAGE_HEAD = "mb-14 max-w-[940px] max-md:mb-9";

/** A page's display heading, set; `PAGE_TITLE` adds its entrance. */
export const PAGE_TITLE_TYPE =
  "m-0 text-[clamp(40px,6vw,76px)] leading-none font-semibold tracking-[-0.056em] text-balance";

export const PAGE_TITLE = `${PAGE_TITLE_TYPE} animate-[riseIn_800ms_var(--ease-out)_110ms_both] ${FADE_WHEN_REDUCED}`;

/** The paragraph under a page's title, set; `PAGE_LEDE` adds its entrance. */
export const PAGE_LEDE_TYPE =
  "mt-[22px] max-w-[600px] text-[clamp(17px,1.45vw,20px)] leading-[1.55] tracking-[-0.01em] text-ink-muted text-pretty";

export const PAGE_LEDE = `${PAGE_LEDE_TYPE} animate-[riseIn_800ms_var(--ease-out)_170ms_both] ${FADE_WHEN_REDUCED}`;

export const SECTION_HEAD = "mb-14 max-w-[760px] max-md:mb-9";

export const SECTION_TITLE =
  "m-0 text-[clamp(32px,4vw,52px)] leading-[1.02] font-semibold tracking-[-0.05em] text-balance";

/** A text link with a trailing arrow that nudges on hover, only where hover is real. */
export const PAGE_LINK = `inline-flex items-center gap-1.5 rounded-[8px] py-2 text-[15px] font-[560] text-ink transition-colors duration-200 ease-[ease] pointer-fine:hover:text-brand-text ${FOCUS_RING} [&>svg]:transition-transform [&>svg]:duration-[220ms] [&>svg]:ease-out motion-safe:pointer-fine:hover:[&>svg]:translate-x-[3px] motion-reduce:[&>svg]:duration-0`;

/** The site's brand lockup: the mark and the name. */
export const NAV_BRAND = `flex items-center gap-2.5 rounded-full text-[17px] font-[650] tracking-[-0.04em] text-ink ${FOCUS_RING}`;

/** TODO: placeholder mark — the real Helvetic Studio mark does not exist yet. Two summits. */
export const NAV_MARK =
  "relative size-7 overflow-hidden rounded-[9px] bg-brand shadow-[inset_0_1px_0_oklch(1_0_0/0.3),0_6px_14px_-7px_oklch(0.5684_0.2129_25.98/0.9)] before:absolute before:inset-x-1 before:top-2 before:bottom-0 before:bg-white/95 before:content-[''] before:[clip-path:polygon(0%_100%,34%_28%,50%_58%,70%_0%,100%_100%)]";

export type ButtonVariant = "primary" | "ghost" | "quiet" | "light" | "onRed";
export type ButtonSize = "default" | "card" | "compact";

// A child icon is `ButtonIcon`, found by its slot: the pill tightens around it and tints it.
const BUTTON_BASE =
  "group/button inline-flex cursor-pointer items-center justify-center rounded-full border-0 leading-none font-[560] tracking-[-0.01em] whitespace-nowrap [-webkit-tap-highlight-color:transparent] [transition:scale_160ms_var(--ease-out),background-color_200ms_ease,box-shadow_200ms_ease,color_200ms_ease] motion-safe:active:scale-[0.97] active:duration-100 motion-reduce:duration-0";

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default:
    "min-h-[50px] gap-3.5 px-[22px] py-1.5 text-[15px] has-[>[data-slot=button-icon]]:pr-1.5",
  // Inside a card: a smaller pill that doesn't compete with the page's one red button.
  card: "min-h-[46px] gap-3.5 px-[22px] py-1.5 text-[14px] has-[>[data-slot=button-icon]]:pr-1.5 *:data-[slot=button-icon]:size-[34px]",
  // In the navigation pill.
  compact:
    "min-h-11 gap-3 px-[22px] py-1.5 text-[14px] has-[>[data-slot=button-icon]]:py-[5px] has-[>[data-slot=button-icon]]:pr-[5px] has-[>[data-slot=button-icon]]:pl-[18px] *:data-[slot=button-icon]:size-[34px]",
};

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.24),0_12px_26px_-14px_oklch(0.5684_0.2129_25.98/0.85)] pointer-fine:hover:bg-brand-hover focus-visible:outline-none focus-visible:shadow-focus *:data-[slot=button-icon]:bg-white/16 *:data-[slot=button-icon]:shadow-[inset_0_1px_0_oklch(1_0_0/0.22)]",
  ghost:
    "bg-white/64 text-ink shadow-[inset_0_0_0_1px_oklch(1_0_0/0.95),0_10px_24px_-18px_oklch(0.35_0.08_30/0.45)] pointer-fine:hover:bg-white/92 focus-visible:outline-none focus-visible:shadow-focus",
  quiet:
    "bg-brand/7 text-ink pointer-fine:hover:bg-brand/12 focus-visible:outline-none focus-visible:shadow-focus *:data-[slot=button-icon]:bg-white *:data-[slot=button-icon]:text-brand-text *:data-[slot=button-icon]:shadow-[0_4px_12px_-6px_oklch(0.35_0.08_30/0.35)]",
  // On the red and ink panels.
  light:
    "bg-white text-brand-text shadow-[0_14px_30px_-16px_oklch(0.25_0.08_25/0.6)] focus-visible:outline-none focus-visible:shadow-focus-inverse *:data-[slot=button-icon]:bg-brand/10",
  onRed:
    "bg-white/10 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0/0.28)] pointer-fine:hover:bg-white/18 focus-visible:outline-none focus-visible:shadow-focus-inverse",
};

/**
 * A pill button (or a link styled as one). The press is felt on pointer-down; a trailing arrow
 * never sits naked, it rides in a `ButtonIcon` disc flush with the pill's inner edge.
 */
export const buttonClass = (
  variant: ButtonVariant,
  size: ButtonSize = "default"
): string => `${BUTTON_BASE} ${BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]}`;
