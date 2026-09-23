"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { prefersReducedMotion, riseEaseOf } from "@/app/_lib/motion";

interface RevealVariant {
  keyframes: Keyframe[];
  duration: number;
}

const RISE: RevealVariant = {
  keyframes: [
    { opacity: 0, transform: "translate3d(0, 24px, 0)" },
    { opacity: 1, transform: "translate3d(0, 0, 0)" },
  ],
  duration: 900,
};

/**
 * How a marked element arrives. `rise` lifts content into place; `draw` wipes a line in from its
 * start (clip-path, so one variant serves a horizontal and a vertical track); `pop` sets a small
 * marker down. The easing is the element's own `--rise-ease`, so CSS can override it per element.
 */
const VARIANTS: Readonly<Record<string, RevealVariant>> = {
  rise: RISE,
  draw: {
    keyframes: [
      { clipPath: "inset(0 100% 100% 0)" },
      { clipPath: "inset(0 0 0 0)" },
    ],
    duration: 1200,
  },
  pop: {
    keyframes: [
      { opacity: 0, transform: "scale(0.6)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    duration: 600,
  },
};

const animateReveal = (element: HTMLElement): Animation => {
  const variant = VARIANTS[element.dataset["reveal"] ?? "rise"] ?? RISE;
  return element.animate(variant.keyframes, {
    duration: variant.duration,
    easing: riseEaseOf(element),
    delay: Number(element.dataset["revealDelay"] ?? 0),
    fill: "backwards",
  });
};

/**
 * One-shot entrances for everything marked `data-reveal` below it, as it first scrolls into view.
 * Progressive enhancement: content is visible without JavaScript, and reduced motion skips it.
 */
export const Reveal = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) {
            continue;
          }
          observer.unobserve(entry.target);
          animations.push(animateReveal(entry.target));
        }
      },
      { threshold: 0.12 }
    );

    if (root && !prefersReducedMotion()) {
      for (const element of root.querySelectorAll("[data-reveal]")) {
        observer.observe(element);
      }
    }

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopMotion = () => {
      if (preference.matches) {
        observer.disconnect();
        for (const animation of animations) {
          animation.cancel();
        }
      }
    };
    preference.addEventListener("change", stopMotion);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
      for (const animation of animations) {
        animation.cancel();
      }
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};
