/**
 * The deal: the project cards are dealt from a filter chip into their grid slots, like a deck
 * spread on a table, and gathered back into the chip when the filter changes. This module is the
 * geometry — where each card starts, how it is tilted, when it goes — so the component only
 * measures and plays.
 */

/** A box in viewport pixels, as laid out (no entrance transform applied). */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A keyframe of the deal: the two properties that composite, and where in the flight it sits. */
export interface DealKeyframe extends Keyframe {
  transform?: string;
  opacity?: number;
  offset?: number;
}

/**
 * Why the cards are being dealt. Landing by a flight, the first card waits for the page and its
 * header to begin settling. After a shuffle the table is
 * already set, so the new cards follow the gathered ones at once, a little tighter.
 */
export type DealMode = "landing" | "shuffle";

export interface Beat {
  delayMs: number;
  staggerMs: number;
  durationMs: number;
}

export const DEAL: Record<DealMode, Beat> = {
  landing: { delayMs: 200, staggerMs: 40, durationMs: 520 },
  shuffle: { delayMs: 0, staggerMs: 30, durationMs: 420 },
};

/**
 * The gather is the system's response to a click: quicker than the deal, top card first, and
 * pulled in rather than eased out — a card accelerates into the chip.
 */
export const GATHER = {
  staggerMs: 12,
  durationMs: 240,
  easing: "cubic-bezier(0.32, 0, 0.2, 1)",
} as const;

/**
 * The chip is the deck's home, so it answers the deck: it gives way as the cards land in it and
 * lifts as they leave. The dip also carries the hand-off across the moment between the last card
 * landing and the new page's first card leaving, where the table would otherwise read as empty.
 */
export const CHIP = {
  dip: 0.97,
  lift: 1.025,
  /** How long the chip takes to come back up once the last card is in. */
  releaseMs: 220,
  emitMs: 260,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** The pile at the chip is card-sized when the chip is; never smaller than a thumbnail. */
const PILE_SCALE = { min: 0.12, max: 0.3 } as const;
/** The point in the deal (in eased progress) by which a card is fully opaque. */
const OPAQUE_AT = 0.2;
/** The point in the gather (in eased progress) until which a card is fully opaque. */
const OPAQUE_UNTIL = 0.8;
const TILT = { base: 4, step: 2, cycle: 3 } as const;
const DECIMALS = 2;

const round = (value: number) => Number(value.toFixed(DECIMALS));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Alternating tilt so the pile reads as a fanned deck: −4°, 6°, −8°, 4°, −6°, 8°, −4° … */
export const dealTilt = (order: number): number =>
  (order % 2 === 0 ? -1 : 1) * (TILT.base + (order % TILT.cycle) * TILT.step);

/** The card centred on the chip, chip-sized and tilted. */
const onPile = (source: Box, card: Box, order: number): string => {
  const dx = round(source.x + source.width / 2 - (card.x + card.width / 2));
  const dy = round(source.y + source.height / 2 - (card.y + card.height / 2));
  const scale = round(
    clamp(source.width / card.width, PILE_SCALE.min, PILE_SCALE.max)
  );
  return `translate(${dx}px, ${dy}px) rotate(${dealTilt(order)}deg) scale(${scale})`;
};

const IN_PLACE = "translate(0px, 0px) rotate(0deg) scale(1)";

/**
 * Keyframes for one dealt card: from the pile straight to its slot. Opacity is keyed in progress
 * space, so the card is opaque once it has left the chip.
 */
export const dealKeyframes = (
  source: Box,
  card: Box,
  order: number
): DealKeyframe[] => [
  { transform: onPile(source, card, order), opacity: 0 },
  { opacity: 1, offset: OPAQUE_AT },
  { transform: IN_PLACE, opacity: 1 },
];

/**
 * Keyframes for one gathered card: from wherever it is — the first keyframe is implicit, so a
 * card caught mid-deal turns back from there — to the pile, fading as it arrives.
 */
export const gatherKeyframes = (
  source: Box,
  card: Box,
  order: number
): DealKeyframe[] => [
  { opacity: 1, offset: OPAQUE_UNTIL },
  { transform: onPile(source, card, order), opacity: 0 },
];

/** Timing for one dealt card: the same throw for every card, each a beat after the one before. */
export const dealTiming = (
  order: number,
  easing: string,
  mode: DealMode
): KeyframeAnimationOptions => {
  const beat = DEAL[mode];
  return {
    delay: beat.delayMs + order * beat.staggerMs,
    duration: beat.durationMs,
    easing,
    // The pile is visible during the delay; nothing lingers once a card has landed.
    fill: "backwards",
  };
};

/** Timing for one gathered card: the last dealt goes first, and the pile stays until the swap. */
export const gatherTiming = (
  order: number,
  count: number
): KeyframeAnimationOptions => ({
  delay: (count - 1 - order) * GATHER.staggerMs,
  duration: GATHER.durationMs,
  easing: GATHER.easing,
  fill: "forwards",
});

/** The whole gather: the last card starts a beat after the first and throws for just as long. */
export const gatherTotalMs = (count: number): number =>
  Math.max(count - 1, 0) * GATHER.staggerMs + GATHER.durationMs;

/**
 * The chip taking the deck in. It holds still while the cards are in the air, gives way as they
 * arrive — the first at one throw, the last at the end of the gather — then comes back up.
 */
export const absorbKeyframes = (count: number): DealKeyframe[] => {
  const arriving = gatherTotalMs(count);
  const total = arriving + CHIP.releaseMs;
  return [
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1)", offset: round(GATHER.durationMs / total) },
    { transform: `scale(${CHIP.dip})`, offset: round(arriving / total) },
    { transform: "scale(1)", offset: 1 },
  ];
};

export const absorbTiming = (count: number): KeyframeAnimationOptions => ({
  duration: gatherTotalMs(count) + CHIP.releaseMs,
  easing: CHIP.easing,
});

/** The chip letting the deck out: a short lift as the first cards leave it. */
export const emitKeyframes = (): DealKeyframe[] => [
  { transform: "scale(1)", offset: 0 },
  { transform: `scale(${CHIP.lift})`, offset: 0.35 },
  { transform: "scale(1)", offset: 1 },
];

export const emitTiming = (mode: DealMode): KeyframeAnimationOptions => ({
  delay: DEAL[mode].delayMs,
  duration: CHIP.emitMs,
  easing: CHIP.easing,
});
