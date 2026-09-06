"use client";

import { usePathname } from "next/navigation";
import type { ReactNode, RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import type { Flight } from "@/app/_lib/flight";
import { peekFlight, useFlight } from "@/app/_lib/flight";
import { isLandingOf } from "@/app/_lib/handoff";
import type { Box, DealMode } from "@/app/work/_lib/deal";
import {
  dealKeyframes,
  dealTiming,
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

/** The page's rise easing (`--rise-ease` in index.css); the literal is the fallback only. */
const RISE_EASE_FALLBACK = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/** What a shown grid has been through: gathered into its chip, or dealt to the end. */
interface History {
  gathered: boolean;
  dealt: boolean;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const easingOf = (grid: HTMLElement) =>
  getComputedStyle(grid).getPropertyValue("--rise-ease").trim() ||
  RISE_EASE_FALLBACK;

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
  const easing = easingOf(grid);
  const from = layoutBox(chip);
  const cards = [...grid.children];
  const boxes = cards.map(layoutBox);

  return cards.map((card, order) =>
    card.animate(
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
  const easing = easingOf(grid);
  const to = layoutBox(chip);
  const cards = [...grid.children];
  const boxes = cards.map(layoutBox);

  return cards.map((card, order) =>
    card.animate(
      gatherKeyframes(to, boxes[order] ?? to, order),
      gatherTiming(order, cards.length, easing)
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

  useLayoutEffect(() => {
    const animations =
      departing !== null && grid.current !== null
        ? gather(grid.current, pathname)
        : [];
    if (departing !== null) {
      // Even cut short, the cards were on their way into the chip: they come back out of it.
      history.current.gathered = true;
      void markGathered(animations);
    }
    return () => {
      cancelAll(animations);
    };
  }, [departing, pathname]);

  return (
    <ul ref={grid} className="project-grid" data-deal={dealing ?? undefined}>
      {children}
    </ul>
  );
};
