import { describe, expect, it } from "vite-plus/test";

import {
  gatewayForPath,
  HOME_FOCUS,
  logScaleEasing,
  PEAKS,
  peakFocus,
  pinPosition,
  summitFor,
  ZOOM_EASINGS,
  ZOOM_SCALES,
  zoomFor,
} from "./peaks";

const round = (value: number) => Number(value.toFixed(3));

const focusFor = (route: string) => {
  const focus = route === "/" ? HOME_FOCUS : gatewayForPath(route);
  if (!focus) {
    throw new Error(`No gateway for ${route}`);
  }
  return focus;
};

const stopsOf = (easing: string) =>
  easing.slice("linear(".length, -1).split(", ").map(Number);

describe(peakFocus, () => {
  // One y for every layer: they share a box height, so the same percentage is the same screen point.
  it.each([
    ["/services", 32.5, 11.25, 41.346],
    ["/work", 45, 36.25, 37.5],
    ["/about", 57.5, 61.25, 39.423],
    ["/contact", 70.625, 87.5, 32.692],
    ["/", 50, 46.25, 50],
  ])(
    "pivots every layer about the same screen point for %s",
    (route, xRidge, xPins, y) => {
      const focus = peakFocus(focusFor(route));

      expect({
        xRidge: round(focus.xRidge),
        xPins: round(focus.xPins),
        y: round(focus.y),
      }).toStrictEqual({ xRidge, xPins, y });
    }
  );

  it("puts each gateway pin exactly on its own pivot", () => {
    for (const peak of PEAKS) {
      if (peak.kind !== "gateway") {
        continue;
      }
      const focus = peakFocus(peak);
      const position = pinPosition(peak);
      expect(round(position.left)).toBe(round(focus.xPins));
      expect(round(position.top)).toBe(round(focus.y));
    }
  });
});

describe(pinPosition, () => {
  it("places each marker as a percentage of the windowed near layer", () => {
    const positions = PEAKS.map((peak) => {
      const { left, top } = pinPosition(peak);
      return [round(left), round(top)];
    });

    expect(positions).toStrictEqual([
      [11.25, 41.346],
      [24, 52.308],
      [36.25, 37.5],
      [61.25, 39.423],
      [74.75, 49.615],
      [87.5, 32.692],
    ]);
  });
});

describe(gatewayForPath, () => {
  it("resolves the four inner routes and nothing else", () => {
    expect(gatewayForPath("/services")?.label).toBe("Services");
    expect(gatewayForPath("/contact")?.x).toBe(1130);
    expect(gatewayForPath("/")).toBeUndefined();
    expect(gatewayForPath("/nowhere")).toBeUndefined();
  });

  it("puts the Work filters on the Work summit", () => {
    expect(gatewayForPath("/work/websites")?.label).toBe("Work");
    expect(gatewayForPath("/workshop")).toBeUndefined();
  });
});

describe(summitFor, () => {
  it("is the gateway for its pages and the page itself elsewhere", () => {
    expect(summitFor("/work/design")).toBe("/work");
    expect(summitFor("/about")).toBe("/about");
    expect(summitFor("/")).toBe("/");
  });
});

describe(logScaleEasing, () => {
  it("is a well-formed linear() that starts at 0 and ends at 1", () => {
    const stops = stopsOf(logScaleEasing(1, ZOOM_SCALES.near, "in"));
    expect(stops).toHaveLength(49);
    expect(stops[0]).toBe(0);
    expect(stops.at(-1)).toBe(1);
    for (let i = 1; i < stops.length; i += 1) {
      expect(stops[i]).toBeGreaterThanOrEqual(stops[i - 1] ?? 0);
    }
  });

  it("moves every layer with one shared progress, so the camera stays rigid", () => {
    // For each stop the near layer's scale implies a progress p; far and mid must sit at their own
    // scale^p, otherwise the parallax would slip mid-flight.
    for (const direction of ["in", "out"] as const) {
      const layers = (["far", "mid", "near"] as const).map((depth) => ({
        depth,
        stops: stopsOf(logScaleEasing(1, ZOOM_SCALES[depth], direction)),
      }));
      const near = layers[2]?.stops ?? [];
      for (const [index, stop] of near.entries()) {
        const scaleNear =
          direction === "in"
            ? 1 + stop * (ZOOM_SCALES.near - 1)
            : ZOOM_SCALES.near - stop * (ZOOM_SCALES.near - 1);
        const progress = Math.log(scaleNear) / Math.log(ZOOM_SCALES.near);
        for (const { depth, stops } of layers) {
          const eased = stops[index] ?? Number.NaN;
          const scale =
            direction === "in"
              ? 1 + eased * (ZOOM_SCALES[depth] - 1)
              : ZOOM_SCALES[depth] - eased * (ZOOM_SCALES[depth] - 1);
          expect(Math.abs(scale - ZOOM_SCALES[depth] ** progress)).toBeLessThan(
            0.003
          );
        }
      }
    }
  });

  it("keeps the pins' counter-scale the exact inverse of the near layer at every stop", () => {
    for (const direction of ["in", "out"] as const) {
      const near = stopsOf(logScaleEasing(1, ZOOM_SCALES.near, direction));
      const pin = stopsOf(logScaleEasing(1, 1 / ZOOM_SCALES.near, direction));
      const [nearStart, nearEnd] =
        direction === "in" ? [1, ZOOM_SCALES.near] : [ZOOM_SCALES.near, 1];
      const [pinStart, pinEnd] =
        direction === "in"
          ? [1, 1 / ZOOM_SCALES.near]
          : [1 / ZOOM_SCALES.near, 1];
      for (const [index, stop] of near.entries()) {
        const layerScale = nearStart + stop * (nearEnd - nearStart);
        const counterScale = pinStart + (pin[index] ?? 0) * (pinEnd - pinStart);
        expect(Math.abs(layerScale * counterScale - 1)).toBeLessThan(0.003);
      }
    }
  });

  it("decelerates into the destination in both directions", () => {
    // The long ease-out tail is the point: the last quarter of the flight covers little of the
    // perceptual (log-scale) zoom, and the first quarter does not lurch.
    for (const direction of ["in", "out"] as const) {
      const stops = stopsOf(logScaleEasing(1, ZOOM_SCALES.near, direction));
      const progressAt = (index: number) => {
        const eased = stops[index] ?? Number.NaN;
        const scale =
          direction === "in"
            ? 1 + eased * (ZOOM_SCALES.near - 1)
            : ZOOM_SCALES.near - eased * (ZOOM_SCALES.near - 1);
        const p = Math.log(scale) / Math.log(ZOOM_SCALES.near);
        return direction === "in" ? p : 1 - p;
      };
      expect(progressAt(12)).toBeLessThan(0.2);
      expect(1 - progressAt(36)).toBeLessThan(0.08);
    }
  });
});

describe(zoomFor, () => {
  it("is zoomed inside a gateway and not at the range", () => {
    expect(zoomFor("/work", null).zoomed).toBeTruthy();
    expect(zoomFor("/", "/work").zoomed).toBeFalsy();
  });

  it("is lateral only between two gateways", () => {
    expect(zoomFor("/about", "/work").lateral).toBeTruthy();
    expect(zoomFor("/work/websites", "/services").lateral).toBeTruthy();
    expect(zoomFor("/about", "/").lateral).toBeFalsy();
    expect(zoomFor("/", "/about").lateral).toBeFalsy();
    expect(zoomFor("/about", null).lateral).toBeFalsy();
  });

  it("picks the easing for the flight's direction", () => {
    expect(zoomFor("/work", "/").easings).toBe(ZOOM_EASINGS.in);
    expect(zoomFor("/work", null).easings).toBe(ZOOM_EASINGS.in);
    expect(zoomFor("/", "/work").easings).toBe(ZOOM_EASINGS.out);
    expect(zoomFor("/about", "/work").easings).toBe(ZOOM_EASINGS.lateral);
  });

  it("scales the layers only inside a gateway", () => {
    expect(zoomFor("/work", "/").scales).toStrictEqual(ZOOM_SCALES);
    expect(zoomFor("/", "/work").scales).toStrictEqual({
      far: 1,
      mid: 1,
      near: 1,
    });
  });

  it("focuses the destination gateway, and the home focus at the range", () => {
    expect(round(zoomFor("/contact", "/").focus.xPins)).toBe(87.5);
    expect(round(zoomFor("/", "/contact").focus.xRidge)).toBe(50);
  });
});
