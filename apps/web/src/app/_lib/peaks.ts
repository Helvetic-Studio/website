import type { Route } from "next";

import { isWithinRoute } from "@/app/_lib/routes";

/** The ridge silhouette's coordinate space. All three layers share it. */
export const VIEWBOX = { width: 1600, height: 520 } as const;

/** Treatment C: the slice of the viewBox that is visible on screen. */
const RIDGE_WINDOW = { start: 430, end: 1230 } as const;

/**
 * How far each layer flies when a gateway is entered. The spread (far 1.35×, near 3.2×) is the
 * parallax that reads as depth. The layer box heights live in CSS (`--ridge-height`) because the
 * transform below is expressed in percentages of each layer's own box, so it never needs them.
 */
export const ZOOM_SCALES = { far: 1.35, mid: 2, near: 3.2 } as const;

/**
 * Polygon point lists, `preserveAspectRatio="none"`. All three layers share one box height; the
 * depth stagger that used to live in taller far/mid boxes is folded into their y-coordinates. The
 * near layer is amended: two minor summits are carved in at x 622 and x 1028 to host the cairns
 * inside the window. They are unnamed.
 */
export const RIDGE_POLYGONS = {
  far: "0,466 110,401 250,450 400,374 560,444 720,385 880,439 1050,380 1220,444 1380,391 1600,450 1600,520 0,520",
  mid: "0,453 120,376 260,428 420,340 580,412 760,325 940,402 1120,335 1300,417 1460,361 1600,423 1600,520 0,520",
  near: "0,430 60,398 150,300 245,362 330,265 425,332 520,215 588,306 622,272 664,308 720,195 822,276 920,205 992,290 1028,258 1068,292 1130,170 1242,266 1350,230 1462,330 1600,298 1600,520 0,520",
} as const;

/** Every polygon closes along the ground with these two points; the crest is what precedes them. */
const GROUND_EDGE = ` ${VIEWBOX.width},${VIEWBOX.height} 0,${VIEWBOX.height}`;

/** The skyline of a ridge polygon, without its ground edge: the line the light catches. */
export const crestOf = (polygon: string): string =>
  polygon.endsWith(GROUND_EDGE)
    ? polygon.slice(0, -GROUND_EDGE.length)
    : polygon;

export const RIDGE_CRESTS = {
  far: crestOf(RIDGE_POLYGONS.far),
  mid: crestOf(RIDGE_POLYGONS.mid),
  near: crestOf(RIDGE_POLYGONS.near),
} as const;

export interface Summit {
  x: number;
  y: number;
}

export interface Gateway extends Summit {
  kind: "gateway";
  route: Route;
  label: string;
}

export interface Cairn extends Summit {
  kind: "cairn";
}

export type Peak = Gateway | Cairn;

/** Six markers: four gateways and two cairns, so the gateways read as chosen. */
export const PEAKS: readonly Peak[] = [
  { kind: "gateway", route: "/services", label: "Services", x: 520, y: 215 },
  { kind: "cairn", x: 622, y: 272 },
  { kind: "gateway", route: "/work", label: "Work", x: 720, y: 195 },
  { kind: "gateway", route: "/about", label: "About", x: 920, y: 205 },
  { kind: "cairn", x: 1028, y: 258 },
  { kind: "gateway", route: "/contact", label: "Contact", x: 1130, y: 170 },
];

/** Where the camera looks at 1×. Visually irrelevant: at scale 1 the pivot cancels out. */
export const HOME_FOCUS: Summit = { x: 800, y: 260 };

/** The camera's pivot as percentages of each layer's own box. */
export interface PeakFocus {
  /** 200%-wide ridge layers. */
  xRidge: number;
  /** 100%-wide pin layer. */
  xPins: number;
  /** Shared by every layer: they are all the same height, bottom-anchored. */
  y: number;
}

const PERCENT = 100;

/**
 * Every layer pivots about the same screen point — that is what makes a camera zoom rather than a
 * shear. Because all layers share one box height, one y-percentage serves them all.
 */
export const peakFocus = (focus: Summit): PeakFocus => {
  const windowWidth = RIDGE_WINDOW.end - RIDGE_WINDOW.start;

  return {
    xRidge: (focus.x / VIEWBOX.width) * PERCENT,
    xPins: ((focus.x - RIDGE_WINDOW.start) / windowWidth) * PERCENT,
    y: (focus.y / VIEWBOX.height) * PERCENT,
  };
};

/** A marker's position as percentages of the pin layer, which matches the near layer's box. */
export const pinPosition = (summit: Summit) => {
  const windowWidth = RIDGE_WINDOW.end - RIDGE_WINDOW.start;
  return {
    left: ((summit.x - RIDGE_WINDOW.start) / windowWidth) * PERCENT,
    top: (summit.y / VIEWBOX.height) * PERCENT,
  };
};

/** The gateway a page belongs to. Pages beneath a gateway (the Work filters) belong to it. */
export const gatewayForPath = (pathname: string): Gateway | undefined =>
  PEAKS.find(
    (peak): peak is Gateway =>
      peak.kind === "gateway" && isWithinRoute(pathname, peak.route)
  );

/**
 * The summit a page is seen from: its gateway's route, or the page itself outside the gateways.
 * Pages of one summit share a camera position and a content stage, so moving between them is
 * neither a flight nor a fade.
 */
export const summitFor = (pathname: string): string =>
  gatewayForPath(pathname)?.route ?? pathname;

/* ---------------------------------------------------------------------------
   Easing — the zoom is perceptually logarithmic
   --------------------------------------------------------------------------- */

/**
 * A CSS transition interpolates `scale()` linearly, but a camera zoom is perceived on a log scale:
 * 1 → 2 feels as big as 2 → 4. Interpolated linearly, 1 → 3.2 spends half the flight on the first
 * ~3× of a 3.2× journey and crawls through the end. So each layer gets a `linear()` easing that
 * maps a normal ease-in-out onto the log curve; every layer, and the pins' counter-scale, then
 * follow the same eased progress and stay a rigid camera.
 */
const ZOOM_CURVE = { x1: 0.5, y1: 0, x2: 0.15, y2: 1 } as const;
const EASING_SAMPLES = 48;
const NEWTON_ITERATIONS = 8;
const BEZIER_EPSILON = 1e-6;
const DECIMALS = 4;

const bezierAxis = (a: number, b: number, t: number) => {
  // Cubic Bézier from 0 to 1 with control points a and b, evaluated at parameter t.
  const oneMinus = 1 - t;
  return 3 * oneMinus * oneMinus * t * a + 3 * oneMinus * t * t * b + t * t * t;
};

const bezierAxisSlope = (a: number, b: number, t: number) => {
  const oneMinus = 1 - t;
  return (
    3 * oneMinus * oneMinus * a +
    6 * oneMinus * t * (b - a) +
    3 * t * t * (1 - b)
  );
};

/** `cubic-bezier(x1, y1, x2, y2)` solved for progress at time `x`, like the browser does. */
const cubicBezier = (x: number): number => {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }
  let t = x;
  for (let i = 0; i < NEWTON_ITERATIONS; i += 1) {
    const error = bezierAxis(ZOOM_CURVE.x1, ZOOM_CURVE.x2, t) - x;
    if (Math.abs(error) < BEZIER_EPSILON) {
      break;
    }
    const slope = bezierAxisSlope(ZOOM_CURVE.x1, ZOOM_CURVE.x2, t);
    if (slope === 0) {
      break;
    }
    t -= error / slope;
  }
  return bezierAxis(ZOOM_CURVE.y1, ZOOM_CURVE.y2, Math.min(1, Math.max(0, t)));
};

export type ZoomDirection = "in" | "out";

/**
 * The `linear()` easing that makes a transition from `from` to `to` follow `from · (to/from)^f(t)`
 * — geometric, not arithmetic — where f is the ease-in-out above.
 */
export const logScaleEasing = (
  from: number,
  to: number,
  direction: ZoomDirection
): string => {
  const [start, end] = direction === "in" ? [from, to] : [to, from];
  const stops: string[] = [];
  for (let i = 0; i <= EASING_SAMPLES; i += 1) {
    const progress = cubicBezier(i / EASING_SAMPLES);
    const value = start * (end / start) ** progress;
    const eased = (value - start) / (end - start);
    stops.push(Number(eased.toFixed(DECIMALS)).toString());
  }
  return `linear(${stops.join(", ")})`;
};

export interface ZoomEasings {
  far: string;
  mid: string;
  near: string;
  /** The pins' counter-scale: 1 → 1/near, so it exactly cancels the near layer at every frame. */
  pin: string;
}

const easingsFor = (direction: ZoomDirection): ZoomEasings => ({
  far: logScaleEasing(1, ZOOM_SCALES.far, direction),
  mid: logScaleEasing(1, ZOOM_SCALES.mid, direction),
  near: logScaleEasing(1, ZOOM_SCALES.near, direction),
  pin: logScaleEasing(1, 1 / ZOOM_SCALES.near, direction),
});

/** A lateral flight only pans (scale is constant), so a plain ease-in-out is already right. */
const PAN_EASING = `cubic-bezier(${ZOOM_CURVE.x1}, ${ZOOM_CURVE.y1}, ${ZOOM_CURVE.x2}, ${ZOOM_CURVE.y2})`;

export const ZOOM_EASINGS: Record<ZoomDirection | "lateral", ZoomEasings> = {
  in: easingsFor("in"),
  out: easingsFor("out"),
  lateral: {
    far: PAN_EASING,
    mid: PAN_EASING,
    near: PAN_EASING,
    pin: PAN_EASING,
  },
};

export interface ZoomScales {
  far: number;
  mid: number;
  near: number;
}

const RANGE_SCALES: ZoomScales = { far: 1, mid: 1, near: 1 };

export interface ZoomState {
  /** Inside a gateway (true) or looking at the whole range (false). */
  zoomed: boolean;
  /** Gateway to gateway with no stop at the range: the direct flight along the ridge. */
  lateral: boolean;
  focus: PeakFocus;
  scales: ZoomScales;
  easings: ZoomEasings;
}

/**
 * The zoom, derived from the URL alone. Browser back/forward carries no click, so this is the
 * only source that makes the return flight, deep links and lateral moves fall out for free.
 */
export const zoomFor = (
  pathname: string,
  previousPathname: string | null
): ZoomState => {
  const gateway = gatewayForPath(pathname);
  const previousGateway =
    previousPathname === null ? undefined : gatewayForPath(previousPathname);
  const zoomed = gateway !== undefined;
  const lateral = zoomed && previousGateway !== undefined;

  // The pivot is never animated. Each layer's transform is translate(focus · (1 − scale))
  // scale(scale): at 1× that is translate(0) whatever the focus, so a flight in pivots about its
  // destination and a flight out keeps pivoting about the gateway it leaves, for free.
  const focus = gateway ?? HOME_FOCUS;
  let direction: keyof typeof ZOOM_EASINGS = "out";
  if (lateral) {
    direction = "lateral";
  } else if (zoomed) {
    direction = "in";
  }

  return {
    zoomed,
    lateral,
    focus: peakFocus(focus),
    scales: zoomed ? ZOOM_SCALES : RANGE_SCALES,
    easings: ZOOM_EASINGS[direction],
  };
};
