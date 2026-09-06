import type { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import type { SiteRoute } from "@/app/_lib/routes";

/**
 * A hand-off is a link that has been activated while the URL still points at the old page: the old
 * content plays its exit, then the route is pushed, then the new content plays its entrance. The
 * flight between summits and the shuffle between Work filters are both hand-offs; each owns one
 * store made here, so their phases never mix.
 */
export interface Handoff<Target extends SiteRoute> {
  target: Target;
  /** `leaving` while the exit plays, `faded` once it has, `pushed` once the route was pushed. */
  phase: "leaving" | "faded" | "pushed";
}

export type Router = ReturnType<typeof useRouter>;

/** Whether `pathname` is the page a hand-off is bringing on screen. */
export const isLandingOf = (
  handoff: Handoff<SiteRoute> | null,
  pathname: string
): boolean => handoff !== null && handoff.target === pathname;

/** If the exit never reports its end (no animation applied), the route is pushed anyway. */
const PUSH_TIMEOUT_MS = 1500;

const getServerSnapshot = () => null;

export interface HandoffStore<Target extends SiteRoute> {
  /** Retargets a hand-off in progress; a page that has already faded does not fade again. */
  start: (target: Target) => void;
  markFaded: () => void;
  markPushed: () => void;
  settle: () => void;
  use: () => Handoff<Target> | null;
  /** The hand-off right now, outside React's render. */
  peek: () => Handoff<Target> | null;
  /** Pushes the route once the page has faded, or after a timeout if the fade never reports. */
  usePushWhenFaded: (
    departing: Handoff<Target> | null,
    router: Router,
    scroll: boolean
  ) => void;
  /** A hand-off ends once its target is on screen. */
  useSettleOnLanding: (
    handoff: Handoff<Target> | null,
    pathname: string
  ) => void;
}

export const createHandoff = <
  Target extends SiteRoute,
>(): HandoffStore<Target> => {
  let current: Handoff<Target> | null = null;
  const listeners = new Set<() => void>();

  const publish = (next: Handoff<Target> | null) => {
    current = next;
    for (const listener of listeners) {
      listener();
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = () => current;

  const markPushed = () => {
    if (current === null || current.phase === "pushed") {
      return;
    }
    publish({ ...current, phase: "pushed" });
  };

  const settle = () => {
    if (current !== null) {
      publish(null);
    }
  };

  return {
    start: (target) => {
      if (current?.target === target) {
        return;
      }
      const phase =
        current === null || current.phase === "leaving" ? "leaving" : "faded";
      publish({ target, phase });
    },
    markFaded: () => {
      if (current === null || current.phase !== "leaving") {
        return;
      }
      publish({ ...current, phase: "faded" });
    },
    markPushed,
    settle,
    use: () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
    peek: () => current,
    usePushWhenFaded: (departing, router, scroll) => {
      useEffect(() => {
        const timer =
          departing === null
            ? undefined
            : window.setTimeout(
                () => {
                  markPushed();
                  // Widened: the typed router cannot resolve a route that is still generic.
                  const target: SiteRoute = departing.target;
                  router.push(target, { scroll });
                },
                departing.phase === "faded" ? 0 : PUSH_TIMEOUT_MS
              );
        return () => {
          window.clearTimeout(timer);
        };
      }, [departing, router, scroll]);
    },
    useSettleOnLanding: (handoff, pathname) => {
      useEffect(() => {
        if (isLandingOf(handoff, pathname)) {
          settle();
        }
      }, [handoff, pathname]);
    },
  };
};
