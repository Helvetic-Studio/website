import type { Handoff } from "@/app/_lib/handoff";
import { createHandoff } from "@/app/_lib/handoff";
import type { SiteRoute } from "@/app/_lib/routes";

/**
 * A flight is a gateway link that has been activated while the URL still points at the old page.
 * The ridge starts flying towards `target` at once; the content fades out, then the route is
 * pushed, then the new content fades in. That keeps the zoom and the hand-off on one clock without
 * the View Transition API, which paints the ridge as a frozen snapshot in Firefox and ignores the
 * crossfade timing in WebKit.
 */
export type Flight = Handoff<SiteRoute>;

const flight = createHandoff<SiteRoute>();

export const startFlight = flight.start;
export const markFlightFaded = flight.markFaded;
export const settleFlight = flight.settle;
export const useFlight = flight.use;
export const peekFlight = flight.peek;
export const usePushWhenFlightFaded = flight.usePushWhenFaded;
export const useSettleFlightOnLanding = flight.useSettleOnLanding;
