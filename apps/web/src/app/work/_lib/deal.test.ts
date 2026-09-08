import { describe, expect, it } from "vite-plus/test";

import {
  absorbKeyframes,
  absorbTiming,
  CHIP,
  DEAL,
  dealKeyframes,
  dealTilt,
  dealTiming,
  emitKeyframes,
  emitTiming,
  GATHER,
  gatherKeyframes,
  gatherTiming,
  gatherTotalMs,
} from "./deal";

const chip = { x: 176, y: 298, width: 94, height: 41 };
const card = { x: 84, y: 379, width: 547, height: 529 };
// chip centre (223, 318.5) − card centre (357.5, 643.5)
const onPile = "translate(-134.5px, -325px) rotate(-4deg) scale(0.17)";

describe("the keyframes of a dealt card", () => {
  it("starts the card centred on the chip, chip-sized, and ends in place", () => {
    const [start, , end] = dealKeyframes(chip, card, 0);

    expect(start?.transform).toBe(onPile);
    expect(start?.opacity).toBe(0);
    expect(end?.transform).toBe("translate(0px, 0px) rotate(0deg) scale(1)");
    expect(end?.opacity).toBe(1);
  });

  it("is opaque early in the flight, so the card is seen leaving the chip", () => {
    const [, opaque] = dealKeyframes(chip, card, 0);

    expect(opaque).toStrictEqual({ opacity: 1, offset: 0.2 });
  });

  it("never shrinks the pile below a thumbnail", () => {
    const [start] = dealKeyframes(
      { ...chip, width: 20 },
      { ...card, width: 2000 },
      0
    );

    expect(start?.transform).toContain("scale(0.12)");
  });
});

describe("the keyframes of a gathered card", () => {
  it("leaves the start implicit and ends on the pile, faded", () => {
    const [opaque, end] = gatherKeyframes(chip, card, 0);

    expect(opaque).toStrictEqual({ opacity: 1, offset: 0.8 });
    expect(end).toStrictEqual({ transform: onPile, opacity: 0 });
  });
});

describe("the tilt of a dealt card", () => {
  it("alternates the tilt so the pile reads as a fan", () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(dealTilt)).toStrictEqual([
      -4, 6, -8, 4, -6, 8, -4,
    ]);
  });
});

describe("the timing of a dealt card", () => {
  it("deals each card a beat after the one before", () => {
    const first = dealTiming(0, "ease", "landing");
    const third = dealTiming(2, "ease", "landing");

    expect(first.delay).toBe(DEAL.landing.delayMs);
    expect(third.delay).toBe(DEAL.landing.delayMs + 2 * DEAL.landing.staggerMs);
    expect(third).toMatchObject({
      duration: DEAL.landing.durationMs,
      easing: "ease",
      fill: "backwards",
    });
  });

  it("follows a shuffle at once, where a landing waits for the page", () => {
    expect(dealTiming(0, "ease", "shuffle").delay).toBe(DEAL.shuffle.delayMs);
    expect(DEAL.shuffle.delayMs).toBeLessThan(DEAL.landing.delayMs);
  });
});

describe("the timing of a gathered card", () => {
  it("gathers the last dealt card first and keeps the pile until the swap", () => {
    expect(gatherTiming(2, 3).delay).toBe(0);
    expect(gatherTiming(0, 3)).toMatchObject({
      delay: 2 * GATHER.staggerMs,
      duration: GATHER.durationMs,
      easing: GATHER.easing,
      fill: "forwards",
    });
  });
});

describe("the chip answering the deck", () => {
  it("holds still while the cards are in the air, and comes back up at the end", () => {
    const [start, holding, , end] = absorbKeyframes(3);

    expect(start).toStrictEqual({ transform: "scale(1)", offset: 0 });
    expect(holding?.transform).toBe("scale(1)");
    expect(end).toStrictEqual({ transform: "scale(1)", offset: 1 });
  });

  it("gives way at the moment the last card lands", () => {
    const [, holding, dip] = absorbKeyframes(3);
    const total = gatherTotalMs(3) + CHIP.releaseMs;

    expect(dip?.transform).toBe(`scale(${CHIP.dip})`);
    expect(dip?.offset).toBeCloseTo(gatherTotalMs(3) / total, 2);
    expect(holding?.offset).toBeLessThan(dip?.offset ?? 0);
  });

  it("comes back up after the last card is in, so the dip bridges the swap", () => {
    expect(absorbTiming(3).duration).toBe(gatherTotalMs(3) + CHIP.releaseMs);
    expect(gatherTotalMs(3)).toBe(2 * GATHER.staggerMs + GATHER.durationMs);
    expect(gatherTotalMs(0)).toBe(GATHER.durationMs);
  });

  it("lifts as the deal leaves, on the deal's own beat", () => {
    const [, lift] = emitKeyframes();

    expect(lift?.transform).toBe(`scale(${CHIP.lift})`);
    expect(emitTiming("shuffle")).toMatchObject({
      delay: DEAL.shuffle.delayMs,
      duration: CHIP.emitMs,
    });
    expect(emitTiming("landing").delay).toBe(DEAL.landing.delayMs);
  });
});
