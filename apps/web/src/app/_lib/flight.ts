import { useSyncExternalStore } from "react";

import type { SiteRoute } from "@/app/_lib/routes";

/**
 * A flight is a gateway link that has been activated while the URL still points at the old page.
 * The ridge starts flying towards `target` at once; the content fades out, then the route is
 * pushed, then the new content fades in. That keeps the zoom and the hand-off on one clock without
 * the View Transition API, which paints the ridge as a frozen snapshot in Firefox and ignores the
 * crossfade timing in WebKit.
 */
export interface Flight {
  target: SiteRoute;
  /** `leaving` while the content fades, `faded` once it has, `pushed` once the route was pushed. */
  phase: "leaving" | "faded" | "pushed";
}

let flight: Flight | null = null;
const listeners = new Set<() => void>();

const publish = (next: Flight | null) => {
  flight = next;
  for (const listener of listeners) {
    listener();
  }
};

/** Retargets a flight in progress; a page that has already faded does not fade again. */
export const startFlight = (target: SiteRoute) => {
  if (flight?.target === target) {
    return;
  }
  const phase =
    flight === null || flight.phase === "leaving" ? "leaving" : "faded";
  publish({ target, phase });
};

export const markFlightFaded = () => {
  if (flight === null || flight.phase !== "leaving") {
    return;
  }
  publish({ ...flight, phase: "faded" });
};

export const markFlightPushed = () => {
  if (flight === null || flight.phase === "pushed") {
    return;
  }
  publish({ ...flight, phase: "pushed" });
};

export const settleFlight = () => {
  if (flight === null) {
    return;
  }
  publish(null);
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => flight;
const getServerSnapshot = () => null;

export const useFlight = (): Flight | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
