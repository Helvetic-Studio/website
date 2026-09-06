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
 * header to be mostly in (the stage fades over the first ~630ms). After a shuffle the table is
 * already set, so the new cards follow the gathered ones at once, a little tighter.
 */
export type DealMode = "landing" | "shuffle";

export interface Beat {
  delayMs: number;
  staggerMs: number;
  durationMs: number;
}

export const DEAL: Record<DealMode, Beat> = {
  landing: { delayMs: 300, staggerMs: 60, durationMs: 640 },
  shuffle: { delayMs: 40, staggerMs: 50, durationMs: 560 },
};

/** The gather is the system's response to a click: quicker than the deal, top card first. */
export const GATHER = { staggerMs: 35, durationMs: 380 } as const;

/** The pile at the chip is card-sized when the chip is; never smaller than a thumbnail. */
const PILE_SCALE = { min: 0.12, max: 0.3 } as const;
/** The point in the deal (in eased progress) by which a card is fully opaque. */
const OPAQUE_AT = 0.2;
/** The point in the gather (in eased progress) until which a card is fully opaque. */
const OPAQUE_UNTIL = 0.55;
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
  count: number,
  easing: string
): KeyframeAnimationOptions => ({
  delay: (count - 1 - order) * GATHER.staggerMs,
  duration: GATHER.durationMs,
  easing,
  fill: "forwards",
});
