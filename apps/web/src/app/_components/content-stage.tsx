"use client";

import { usePathname, useRouter } from "next/navigation";
import type { AnimationEvent, ReactNode } from "react";
import { useState } from "react";

import type { Flight } from "@/app/_lib/flight";
import {
  markFlightFaded,
  useFlight,
  usePushWhenFlightFaded,
  useSettleFlightOnLanding,
} from "@/app/_lib/flight";
import { summitFor } from "@/app/_lib/peaks";

export interface ContentStageProps {
  children: ReactNode;
}

/** How the page on screen arrived: by a flight, or by back/forward (which carries no flight). */
type Arrival = "in" | "pop";

interface Landing {
  summit: string;
  arrival: Arrival | undefined;
}

const FADE_OUT_ANIMATION = "contentOut";

/** A flight is leaving this page from the click until its target is the URL. */
const isLeaving = (flight: Flight | null, pathname: string): flight is Flight =>
  flight !== null && flight.target !== pathname;

/** The leaving flight whose route still has to be pushed. */
const departingFlight = (flight: Flight | null, pathname: string) =>
  isLeaving(flight, pathname) && flight.phase !== "pushed" ? flight : null;

/**
 * Remembers how the summit on screen was reached. The initial document never animates, and a page
 * of the same summit (another Work filter) is not an arrival at all.
 */
const useArrival = (summit: string, flight: Flight | null) => {
  const [landing, setLanding] = useState<Landing>({
    summit,
    arrival: undefined,
  });

  if (landing.summit !== summit) {
    setLanding({ summit, arrival: flight === null ? "pop" : "in" });
  }

  return landing.arrival;
};

// Children run their own entrance animations; only the stage's fade-out counts.
const onAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
  if (
    event.target === event.currentTarget &&
    event.animationName === FADE_OUT_ANIMATION
  ) {
    markFlightFaded();
  }
};

/**
 * The content hand-off. Leaving: the page fades out, and the route is pushed the moment that fade
 * ends. Arriving: the new page fades in, early after a flight (the ridge is already half way) or
 * late after back/forward (the ridge only starts flying when the URL changes). The stage is keyed
 * by summit, not by URL: the Work filters swap their grid inside a stage that stays put.
 */
export const ContentStage = ({ children }: ContentStageProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const flight = useFlight();
  const summit = summitFor(pathname);
  const arrival = useArrival(summit, flight);
  usePushWhenFlightFaded(departingFlight(flight, pathname), router, true);
  useSettleFlightOnLanding(flight, pathname);

  return (
    <main
      key={summit}
      id="main-content"
      tabIndex={-1}
      data-slot="site-content"
      // A constant box across routes, so the content hand-off never morphs its group. The hand-off
      // is driven here, not by the View Transition API: Firefox paints the ridge as a frozen
      // snapshot for the whole flight and WebKit ignores the crossfade timing. The short exit hands
      // navigation over early; a flight lands after a short beat (the ridge is already moving),
      // back/forward waits for the ridge, which only starts flying with the URL.
      className="relative z-20 flex flex-auto scroll-mt-[104px] flex-col outline-none data-[flight=in]:animate-[contentIn_calc(var(--zoom-duration)*0.5)_ease-out_calc(var(--zoom-duration)*0.08)_both] data-[flight=out]:pointer-events-none data-[flight=out]:animate-[contentOut_calc(var(--zoom-duration)*0.28)_ease-out_both] data-[flight=pop]:animate-[contentIn_calc(var(--zoom-duration)*0.5)_ease-out_calc(var(--zoom-duration)*0.28)_both]"
      data-flight={isLeaving(flight, pathname) ? "out" : arrival}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </main>
  );
};
