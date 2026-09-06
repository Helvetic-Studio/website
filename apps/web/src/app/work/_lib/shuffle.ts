import type { Handoff } from "@/app/_lib/handoff";
import { createHandoff } from "@/app/_lib/handoff";
import type { WorkRoute } from "@/app/_lib/services";

/** A page of the Work summit: the whole catalogue, or one filter. */
export type WorkPath = "/work" | WorkRoute;

/**
 * A shuffle is a filter chip that has been activated while the URL still points at the old
 * filter. The cards on the table are gathered back into the old chip, then the route is pushed,
 * then the new filter's cards are dealt from the new chip. The camera never moves: this is the
 * Work summit's own hand-off, separate from the flight so the content stage does not fade.
 */
export type Shuffle = Handoff<WorkPath>;

const store = createHandoff<WorkPath>();

export const startShuffle = store.start;
export const markShuffleGathered = store.markFaded;
export const useShuffle = store.use;
export const peekShuffle = store.peek;
export const usePushWhenGathered = store.usePushWhenFaded;
export const useSettleShuffleOnLanding = store.useSettleOnLanding;

/** The shuffle leaving `pathname`: from the chip click until its route is pushed. */
export const departingShuffle = (
  shuffle: Shuffle | null,
  pathname: string
): Shuffle | null =>
  shuffle !== null && shuffle.target !== pathname && shuffle.phase !== "pushed"
    ? shuffle
    : null;
