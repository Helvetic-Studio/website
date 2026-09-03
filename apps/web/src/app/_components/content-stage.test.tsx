import { act, render, screen } from "@testing-library/react";
import type { useRouter } from "next/navigation";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vite-plus/test";

import { settleFlight, startFlight, useFlight } from "@/app/_lib/flight";

import { ContentStage } from "./content-stage";

type Router = ReturnType<typeof useRouter>;

const navigation = vi.hoisted(() => {
  const push = vi.fn<(href: string) => void>();
  const router: Router = {
    bfcacheId: "test",
    back: vi.fn<() => void>(),
    forward: vi.fn<() => void>(),
    refresh: vi.fn<() => void>(),
    push,
    replace: vi.fn<() => void>(),
    prefetch: vi.fn<() => void>(),
  };
  return { pathname: "/", push, router };
});

vi.mock(import("next/navigation"), () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => navigation.router,
}));

const FlightPhase = () => <output>{useFlight()?.phase ?? "none"}</output>;

const renderStage = (pathname: string, page: string) => {
  navigation.pathname = pathname;
  const view = render(
    <>
      <ContentStage>{page}</ContentStage>
      <FlightPhase />
    </>
  );
  const land = (nextPathname: string, nextPage: string) => {
    navigation.pathname = nextPathname;
    view.rerender(
      <>
        <ContentStage>{nextPage}</ContentStage>
        <FlightPhase />
      </>
    );
  };
  return { land };
};

const fly = (target: "/services" | "/work" | "/work/websites" | "/about") => {
  act(() => {
    startFlight(target);
  });
};

const endFadeOut = () => {
  const event = new AnimationEvent("animationend", {
    animationName: "contentOut",
    bubbles: true,
  });
  act(() => {
    screen.getByRole("main").dispatchEvent(event);
  });
};

/** The push is scheduled, never synchronous with the fade. */
const flushPush = () => {
  act(() => {
    vi.advanceTimersByTime(0);
  });
};

describe(ContentStage, () => {
  beforeEach(() => {
    vi.useFakeTimers();
    settleFlight();
    navigation.push.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("never animates the initial document", () => {
    renderStage("/", "home");

    expect(screen.getByRole("main")).not.toHaveAttribute("data-flight");
  });

  it("fades out and pushes the route once the fade has ended", () => {
    renderStage("/", "home");

    fly("/services");
    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "out");
    expect(navigation.push).not.toHaveBeenCalled();

    endFadeOut();
    flushPush();
    expect(navigation.push).toHaveBeenCalledWith("/services");
    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "out");
  });

  it("fades the landed page in and settles the flight", () => {
    const { land } = renderStage("/", "home");
    fly("/services");
    endFadeOut();
    flushPush();

    land("/services", "services");

    expect(screen.getByRole("main")).toHaveTextContent("services");
    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "in");
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });

  it("pushes anyway when the fade never reports its end", () => {
    renderStage("/", "home");

    fly("/work");
    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(navigation.push).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(navigation.push).toHaveBeenCalledWith("/work");
  });

  it("retargets a faded flight without fading again", () => {
    renderStage("/", "home");
    fly("/services");
    endFadeOut();
    flushPush();

    fly("/about");
    flushPush();

    expect(navigation.push).toHaveBeenLastCalledWith("/about");
    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "out");
  });

  it("fades a back/forward arrival in late", () => {
    const { land } = renderStage("/services", "services");

    land("/", "home");

    expect(screen.getByRole("main")).toHaveTextContent("home");
    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "pop");
  });

  it("neither fades nor remounts between pages of one summit", () => {
    const { land } = renderStage("/work", "all work");
    const stage = screen.getByRole("main");

    land("/work/websites", "websites");

    expect(screen.getByRole("main")).toBe(stage);
    expect(screen.getByRole("main")).toHaveTextContent("websites");
    expect(screen.getByRole("main")).not.toHaveAttribute("data-flight");
  });

  it("lands a flight on a Work filter", () => {
    const { land } = renderStage("/services", "services");
    fly("/work/websites");
    endFadeOut();
    flushPush();
    expect(navigation.push).toHaveBeenCalledWith("/work/websites");

    land("/work/websites", "websites");

    expect(screen.getByRole("main")).toHaveAttribute("data-flight", "in");
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });
});
