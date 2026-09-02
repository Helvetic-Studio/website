import { describe, expect, it } from "vite-plus/test";

import {
  gatewayForPath,
  HOME_FOCUS,
  PEAKS,
  peakTransform,
  pinPosition,
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

describe(peakTransform, () => {
  // The reconciled origin table for layer heights 82 / 78 / 76vh (ticket 10 round 4).
  it.each([
    ["/services", 32.5, 11.25, 45.638, 42.85, 41.346],
    ["/work", 45, 36.25, 42.073, 39.103, 37.5],
    ["/about", 57.5, 61.25, 43.856, 40.976, 39.423],
    ["/contact", 70.625, 87.5, 37.617, 34.418, 32.692],
    ["/", 50, 46.25, 53.659, 51.282, 50],
  ])(
    "pivots every layer about the same screen point for %s",
    (route, originXRidge, originXPins, originYFar, originYMid, originYNear) => {
      const transform = peakTransform(focusFor(route));

      expect({
        originXRidge: round(transform.originXRidge),
        originXPins: round(transform.originXPins),
        originYFar: round(transform.originYFar),
        originYMid: round(transform.originYMid),
        originYNear: round(transform.originYNear),
      }).toStrictEqual({
        originXRidge,
        originXPins,
        originYFar,
        originYMid,
        originYNear,
      });
    }
  );
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
});

describe(zoomFor, () => {
  it("is zoomed inside a gateway and not at the range", () => {
    expect(zoomFor("/work", null).zoomed).toBeTruthy();
    expect(zoomFor("/", "/work").zoomed).toBeFalsy();
  });

  it("is lateral only between two gateways", () => {
    expect(zoomFor("/about", "/work").lateral).toBeTruthy();
    expect(zoomFor("/about", "/").lateral).toBeFalsy();
    expect(zoomFor("/", "/about").lateral).toBeFalsy();
    expect(zoomFor("/about", null).lateral).toBeFalsy();
  });

  it("keeps the home origin set so interpolation back out stays smooth", () => {
    const home = zoomFor("/", "/contact");
    expect(round(home.desktop.originXRidge)).toBe(50);
    expect(round(home.desktop.originYNear)).toBe(50);
    expect(round(home.mobile.originXRidge)).toBe(50);
  });
});
