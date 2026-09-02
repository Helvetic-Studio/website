import type { Route } from "next";

/** The ridge silhouette's coordinate space. All three layers share it. */
export const VIEWBOX = { width: 1600, height: 520 } as const;

/** Treatment C: the slice of the viewBox that is visible on screen. */
const RIDGE_WINDOW = { start: 430, end: 1230 } as const;

/**
 * Layer box heights in vh. The +6 / +2 / 0 stagger is what reads as depth. The layer scales
 * (far 1.35×, mid 2×, near 3.2×) live in CSS next to the transitions that use them.
 */
const RIDGE_HEIGHTS = { far: 82, mid: 78, near: 76 } as const;

/** TODO: mobile ridge height — a judge-by-eye start value, never fixed during planning. */
const RIDGE_HEIGHTS_MOBILE = { far: 56, mid: 53, near: 51 } as const;

/**
 * Polygon point lists, `preserveAspectRatio="none"`. The near layer is amended: two minor summits
 * are carved in at x 622 and x 1028 to host the cairns inside the window. They are unnamed.
 */
export const RIDGE_POLYGONS = {
  far: "0,470 110,410 250,455 400,385 560,450 720,395 880,445 1050,390 1220,450 1380,400 1600,455 1600,520 0,520",
  mid: "0,455 120,380 260,430 420,345 580,415 760,330 940,405 1120,340 1300,420 1460,365 1600,425 1600,520 0,520",
  near: "0,430 60,398 150,300 245,362 330,265 425,332 520,215 588,306 622,272 664,308 720,195 822,276 920,205 992,290 1028,258 1068,292 1130,170 1242,266 1350,230 1462,330 1600,298 1600,520 0,520",
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

/** Where the camera looks at 1×. Visually irrelevant, but interpolation to and from it must be smooth. */
export const HOME_FOCUS: Summit = { x: 800, y: 260 };

export interface RidgeHeights {
  far: number;
  mid: number;
  near: number;
}

/** Transform origins as percentages of each element's own box. */
export interface PeakTransform {
  /** 200%-wide ridge layers. */
  originXRidge: number;
  /** 100%-wide pin layer. */
  originXPins: number;
  originYFar: number;
  originYMid: number;
  /** Shared by the near layer and the pin layer, which must always be the same height. */
  originYNear: number;
}

const PERCENT = 100;

/**
 * Every layer pivots about the same screen point — that is what makes a camera zoom rather than a
 * shear. Each bottom-anchored layer therefore needs its own origin-y for its own height.
 */
export const peakTransform = (
  focus: Summit,
  heights: RidgeHeights = RIDGE_HEIGHTS
): PeakTransform => {
  const windowWidth = RIDGE_WINDOW.end - RIDGE_WINDOW.start;
  // The focus point's screen position, in vh from the top of the viewport.
  const screenY =
    PERCENT - heights.near + (focus.y / VIEWBOX.height) * heights.near;
  const originY = (height: number) =>
    ((screenY - PERCENT + height) / height) * PERCENT;

  return {
    originXRidge: (focus.x / VIEWBOX.width) * PERCENT,
    originXPins: ((focus.x - RIDGE_WINDOW.start) / windowWidth) * PERCENT,
    originYFar: originY(heights.far),
    originYMid: originY(heights.mid),
    originYNear: originY(heights.near),
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

export const gatewayForPath = (pathname: string): Gateway | undefined =>
  PEAKS.find(
    (peak): peak is Gateway =>
      peak.kind === "gateway" && peak.route === pathname
  );

export interface ZoomState {
  /** Inside a gateway (true) or looking at the whole range (false). */
  zoomed: boolean;
  /** Gateway to gateway with no stop at the range: the direct flight along the ridge. */
  lateral: boolean;
  desktop: PeakTransform;
  mobile: PeakTransform;
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
  const focus = gateway ?? HOME_FOCUS;

  return {
    zoomed: gateway !== undefined,
    lateral: gateway !== undefined && previousGateway !== undefined,
    desktop: peakTransform(focus),
    mobile: peakTransform(focus, RIDGE_HEIGHTS_MOBILE),
  };
};
