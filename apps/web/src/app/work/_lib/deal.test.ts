import { describe, expect, it } from "vite-plus/test";

import {
  DEAL,
  dealKeyframes,
  dealTilt,
  dealTiming,
  GATHER,
  gatherKeyframes,
  gatherTiming,
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

    expect(opaque).toStrictEqual({ opacity: 1, offset: 0.55 });
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
    expect(gatherTiming(2, 3, "ease").delay).toBe(0);
    expect(gatherTiming(0, 3, "ease")).toMatchObject({
      delay: 2 * GATHER.staggerMs,
      duration: GATHER.durationMs,
      fill: "forwards",
    });
  });
});
