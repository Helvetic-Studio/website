"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { zoomFor } from "@/app/_lib/peaks";

export interface ZoomStageProps {
  children: ReactNode;
}

type ZoomVariables = Record<`--${"focus" | "zoom" | "ease"}-${string}`, string>;

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

  const { zoomed, lateral, focus, scales, easings } = zoomFor(
    pathname,
    visited.previous
  );

  const style: CSSProperties & ZoomVariables = {
    "--focus-x-ridge": percent(focus.xRidge),
    "--focus-x-pins": percent(focus.xPins),
    "--focus-y": percent(focus.y),
    "--zoom-far": String(scales.far),
    "--zoom-mid": String(scales.mid),
    "--zoom-near": String(scales.near),
    "--ease-far": easings.far,
    "--ease-mid": easings.mid,
    "--ease-near": easings.near,
    "--ease-pin": easings.pin,
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
