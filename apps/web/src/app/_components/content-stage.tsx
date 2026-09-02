"use client";

import { usePathname, useRouter } from "next/navigation";
import type { AnimationEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

import type { Flight } from "@/app/_lib/flight";
import {
  markFlightFaded,
  markFlightPushed,
  settleFlight,
  useFlight,
} from "@/app/_lib/flight";

export interface ContentStageProps {
  children: ReactNode;
}

/** How the page on screen arrived: by a flight, or by back/forward (which carries no flight). */
type Arrival = "in" | "pop";

interface Landing {
  pathname: string;
  arrival: Arrival | undefined;
}

type Router = ReturnType<typeof useRouter>;

const FADE_OUT_ANIMATION = "contentOut";
/** If the fade-out never reports its end (no animation applied), the route is pushed anyway. */
const FLIGHT_TIMEOUT_MS = 1500;

/** A flight is leaving this page from the click until its target is the URL. */
const isLeaving = (flight: Flight | null, pathname: string): flight is Flight =>
  flight !== null && flight.target !== pathname;

/** The leaving flight whose route still has to be pushed. */
const departingFlight = (flight: Flight | null, pathname: string) =>
  isLeaving(flight, pathname) && flight.phase !== "pushed" ? flight : null;

/** Remembers how the page on screen arrived. The initial document never animates. */
const useArrival = (pathname: string, flight: Flight | null) => {
  const [landing, setLanding] = useState<Landing>({
    pathname,
    arrival: undefined,
  });

  if (landing.pathname !== pathname) {
    setLanding({ pathname, arrival: flight === null ? "pop" : "in" });
  }

  return landing.arrival;
};

/** Pushes the route once the page has faded — or after a timeout, if the fade never reports. */
const usePushWhenFaded = (departing: Flight | null, router: Router) => {
  useEffect(() => {
    const timer =
      departing === null
        ? undefined
        : window.setTimeout(
            () => {
              markFlightPushed();
              router.push(departing.target);
            },
            departing.phase === "faded" ? 0 : FLIGHT_TIMEOUT_MS
          );
    return () => {
      window.clearTimeout(timer);
    };
  }, [departing, router]);
};

/** A flight ends once its target is on screen. */
const useSettleOnLanding = (flight: Flight | null, pathname: string) => {
  useEffect(() => {
    if (flight !== null && flight.target === pathname) {
      settleFlight();
    }
  }, [flight, pathname]);
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
 * late after back/forward (the ridge only starts flying when the URL changes).
 */
export const ContentStage = ({ children }: ContentStageProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const flight = useFlight();
  const arrival = useArrival(pathname, flight);
  usePushWhenFaded(departingFlight(flight, pathname), router);
  useSettleOnLanding(flight, pathname);

  return (
    <main
      key={pathname}
      className="site-content"
      data-flight={isLeaving(flight, pathname) ? "out" : arrival}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </main>
  );
};
