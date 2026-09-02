"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { zoomFor } from "@/app/_lib/peaks";

export interface ZoomStageProps {
  children: ReactNode;
}

type ZoomVariables = Record<`--origin-${string}`, string>;

interface Visited {
  current: string;
  previous: string | null;
}

const percent = (value: number) => `${value.toFixed(4)}%`;

/**
 * The URL is the only source of truth for the zoom: browser back/forward carries no click, so a
 * click-driven ridge would never fly back out. Everything downstream is plain CSS on custom
 * properties, so the ridge, mist, scrim and pins can stay Server Components.
 */
export const ZoomStage = ({ children }: ZoomStageProps) => {
  const pathname = usePathname();
  const [visited, setVisited] = useState<Visited>({
    current: pathname,
    previous: null,
  });

  if (visited.current !== pathname) {
    setVisited({ current: pathname, previous: visited.current });
  }

  const { zoomed, lateral, desktop, mobile } = zoomFor(
    pathname,
    visited.previous
  );

  const style: CSSProperties & ZoomVariables = {
    "--origin-x-ridge": percent(desktop.originXRidge),
    "--origin-x-pins": percent(desktop.originXPins),
    "--origin-y-far": percent(desktop.originYFar),
    "--origin-y-mid": percent(desktop.originYMid),
    "--origin-y-near": percent(desktop.originYNear),
    "--origin-y-far-mobile": percent(mobile.originYFar),
    "--origin-y-mid-mobile": percent(mobile.originYMid),
    "--origin-y-near-mobile": percent(mobile.originYNear),
  };

  return (
    <div
      className="zoom-stage"
      data-zoomed={zoomed}
      data-lateral={lateral}
      style={style}
    >
      {children}
    </div>
  );
};
