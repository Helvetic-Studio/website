"use client";

import { usePathname } from "next/navigation";
import type { ReactNode, RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Flight } from "@/app/_lib/flight";
import { peekFlight, useFlight } from "@/app/_lib/flight";
import { isLandingOf } from "@/app/_lib/handoff";
import { prefersReducedMotion, riseEaseOf } from "@/app/_lib/motion";
import type { Box, DealMode } from "@/app/work/_lib/deal";
import {
  absorbKeyframes,
  absorbTiming,
  dealKeyframes,
  dealTiming,
  emitKeyframes,
  emitTiming,
  gatherKeyframes,
  gatherTiming,
} from "@/app/work/_lib/deal";
import type { Shuffle } from "@/app/work/_lib/shuffle";
import {
  departingShuffle,
  markShuffleGathered,
  peekShuffle,
  useShuffle,
} from "@/app/work/_lib/shuffle";

export interface CardDeckProps {
  children: ReactNode;
}

/** What a shown grid has been through: gathered into its chip, or dealt to the end. */
interface History {
  gathered: boolean;
  dealt: boolean;
}

/**
 * The hand-off that brought `pathname` on screen, if any: a flight from another summit, or a
 * shuffle from another filter. Pure, so the mount can decide from the rendered values and a
 * re-shown grid from the stores.
 */
const handoffFor = (
  pathname: string,
  flight: Flight | null,
  shuffle: Shuffle | null
): DealMode | null => {
  if (isLandingOf(shuffle, pathname)) {
    return "shuffle";
  }
  if (isLandingOf(flight, pathname)) {
    return "landing";
  }
  return null;
};

/** The chip of a Work page: the filter link whose href is that page. */
const chipFor = (grid: HTMLElement, pathname: string): Element | null =>
  grid.closest(".page")?.querySelector(`.work-filter a[href="${pathname}"]`) ??
  null;

/**
 * The element's box as laid out. At mount the header is still at the start of its rise, so the
 * translation of every ancestor is taken back out; the ancestors only ever translate.
 */
const layoutBox = (element: Element): Box => {
  const rect = element.getBoundingClientRect();
  let { x, y } = rect;
  for (
    let node = element.parentElement;
    node !== null && node !== document.body;
    node = node.parentElement
  ) {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
    x -= matrix.e;
    y -= matrix.f;
  }
  return { x, y, width: rect.width, height: rect.height };
};

/**
 * Plays one card's flight. In the air the card is solid and lifted (see `.is-flying`): the glass
 * would show the cards it crosses, and a blurred backdrop is dear to move every frame. Only the
 * card's own latest flight settles it, so a deal turned back mid-way stays in the air until the
 * gather that superseded it is over.
 */
const FLYING = "is-flying";

const latestFlight = new WeakMap<HTMLElement, Animation>();

const fly = (
  card: HTMLElement,
  keyframes: Keyframe[],
  timing: KeyframeAnimationOptions
): Animation => {
  card.classList.add(FLYING);
  const animation = card.animate(keyframes, timing);
  latestFlight.set(card, animation);
  const landed = () => {
    if (latestFlight.get(card) === animation) {
      card.classList.remove(FLYING);
    }
  };
  animation.addEventListener("finish", landed);
  animation.addEventListener("cancel", landed);
  return animation;
};

const cardsOf = (grid: HTMLElement): HTMLElement[] =>
  [...grid.children].filter((card) => card instanceof HTMLElement);

/** Whatever the cards were still playing — a gather's pile, a paused deal — is over. */
const clearFlights = (grid: HTMLElement) => {
  for (const animation of grid.getAnimations({ subtree: true })) {
    animation.cancel();
  }
};

/** Every box is read before any animation starts, so the layout is resolved once. */
const deal = (
  grid: HTMLElement,
  pathname: string,
  mode: DealMode
): Animation[] => {
  const chip = chipFor(grid, pathname);
  if (chip === null) {
    return [];
  }
  clearFlights(grid);
  const easing = riseEaseOf(grid);
  const from = layoutBox(chip);
  const cards = cardsOf(grid);
  const boxes = cards.map(layoutBox);
  // The chip's own lift is not a card: it runs to its end whatever becomes of the deal.
  chip.animate(emitKeyframes(), emitTiming(mode));

  return cards.map((card, order) =>
    fly(
      card,
      dealKeyframes(from, boxes[order] ?? from, order),
      dealTiming(order, easing, mode)
    )
  );
};

/**
 * Back into the chip of the page being left. A deal still in progress is frozen, not cancelled:
 * the gather's first keyframe is implicit, so each card turns back from wherever it is.
 */
const gather = (grid: HTMLElement, pathname: string): Animation[] => {
  const chip = chipFor(grid, pathname);
  if (chip === null || prefersReducedMotion()) {
    return [];
  }
  for (const animation of grid.getAnimations({ subtree: true })) {
    animation.pause();
  }
  const to = layoutBox(chip);
  const cards = cardsOf(grid);
  const boxes = cards.map(layoutBox);
  // The dip outlives this page: it is still coming back up as the next filter is dealt.
  chip.animate(absorbKeyframes(cards.length), absorbTiming(cards.length));

  return cards.map((card, order) =>
    fly(
      card,
      gatherKeyframes(to, boxes[order] ?? to, order),
      gatherTiming(order, cards.length)
    )
  );
};

const allFinished = async (animations: Animation[]) => {
  const finished: Promise<Animation>[] = [];
  for (const animation of animations) {
    finished.push(animation.finished);
  }
  return await Promise.all(finished);
};

/** A cancelled deal (the grid was hidden or unmounted mid-way) is not a dealt one. */
const markDealt = async (
  animations: Animation[],
  history: RefObject<History>
) => {
  try {
    await allFinished(animations);
    history.current.dealt = true;
  } catch {
    // Cancelled: the grid will be dealt when it next lands.
  }
};

/** The route is pushed once the last card is on the pile; with nothing to gather, at once. */
const markGathered = async (animations: Animation[]) => {
  try {
    await allFinished(animations);
    markShuffleGathered();
  } catch {
    // Cancelled: retargeted, or the grid went away.
  }
};

const cancelAll = (animations: Animation[]) => {
  for (const animation of animations) {
    animation.cancel();
  }
};

/**
 * A shown grid lands: dealt for the hand-off that brought it, or, with motion reduced, it drops
 * the deal and rises like the others.
 */
const land = (
  grid: HTMLElement | null,
  pathname: string,
  mode: DealMode | null,
  history: RefObject<History>,
  undeal: () => void
): Animation[] => {
  if (grid === null || mode === null) {
    return [];
  }
  if (prefersReducedMotion()) {
    undeal();
    return [];
  }
  const animations = deal(grid, pathname, mode);
  void markDealt(animations, history);
  return animations;
};

/**
 * Which deal a shown grid plays. Next keeps a swapped-out grid mounted and shows it again on the
 * way back. Cards that were gathered into the chip come back out of it, however the grid returns
 * (a chip, or back/forward); a grid that was dealt to the end and left some other way starts
 * over: dealt again for a new hand-off, or rising like the others after back/forward. A deal
 * decided at mount is never withdrawn — the stores may already be settled when the effect runs
 * again (StrictMode) — only upgraded to the hand-off of a later show.
 */
const nextDeal = (
  dealing: DealMode | null,
  history: RefObject<History>,
  pathname: string
): DealMode | null => {
  const { gathered, dealt } = history.current;
  history.current = { gathered: false, dealt: false };
  if (gathered) {
    return "shuffle";
  }
  const handoff = handoffFor(pathname, peekFlight(), peekShuffle());
  return dealt ? handoff : (handoff ?? dealing);
};

/**
 * The project grid, dealt from its chip when it lands by a flight or a shuffle, and gathered back
 * into the chip when a shuffle leaves. Back/forward carries no hand-off, so the cards rise as
 * usual (see `.project-card`).
 */
export const CardDeck = ({ children }: CardDeckProps) => {
  const pathname = usePathname();
  const flight = useFlight();
  const shuffle = useShuffle();
  const departing = departingShuffle(shuffle, pathname);
  // Decided at mount: the hand-off is settled by the time the deck re-renders.
  const [dealing, setDealing] = useState(() =>
    handoffFor(pathname, flight, shuffle)
  );
  const grid = useRef<HTMLUListElement>(null);
  const history = useRef<History>({ gathered: false, dealt: false });

  useLayoutEffect(() => {
    const mode = nextDeal(dealing, history, pathname);
    if (mode !== dealing) {
      setDealing(mode);
    }
    // The re-render above lands the upgraded deal; this run only plays the settled one.
    const animations =
      mode === dealing
        ? land(grid.current, pathname, mode, history, () => {
            setDealing(null);
          })
        : [];
    return () => {
      cancelAll(animations);
    };
  }, [dealing, pathname]);

  // The cards go into the chip of the page being left, whatever the target: one gather per
  // departure, untouched by a retarget or by the store's phases. The pile outlives the effect —
  // the push ends the departure some frames before the grid is swapped out, and the cards must
  // not reappear in between — and is cleared by the next deal.
  const leaving = departing !== null;
  useLayoutEffect(() => {
    if (!leaving) {
      return;
    }
    // Even cut short, the cards were on their way into the chip: they come back out of it.
    history.current.gathered = true;
    void markGathered(
      grid.current === null ? [] : gather(grid.current, pathname)
    );
  }, [leaving, pathname]);

  return (
    <ul ref={grid} className="project-grid" data-deal={dealing ?? undefined}>
      {children}
    </ul>
  );
};
