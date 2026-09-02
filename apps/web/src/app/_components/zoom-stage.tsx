"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { useFlight } from "@/app/_lib/flight";
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
 * The camera looks at the flight's target while one is in progress, otherwise at the URL — the
 * URL alone would start the zoom only after the content had faded out, and browser back/forward
 * carries no click, so a click-driven ridge would never fly back out. Everything downstream is
 * plain CSS on custom properties, so the ridge, mist, scrim and pins can stay Server Components.
 */
export const ZoomStage = ({ children }: ZoomStageProps) => {
  const pathname = usePathname();
  const flight = useFlight();
  const target = flight?.target ?? pathname;
  const [visited, setVisited] = useState<Visited>({
    current: target,
    previous: null,
  });

  if (visited.current !== target) {
    setVisited({ current: target, previous: visited.current });
  }

  const { zoomed, lateral, focus, scales, easings } = zoomFor(
    target,
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
