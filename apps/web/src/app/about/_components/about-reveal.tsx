"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { prefersReducedMotion, riseEaseOf } from "@/app/_lib/motion";

const animateReveal = (element: HTMLElement): Animation =>
  element.animate(
    [
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 800,
      easing: riseEaseOf(element),
      delay: Number(element.dataset["aboutDelay"] ?? 0),
      fill: "backwards",
    }
  );

/** Progressive enhancement: content stays visible without JavaScript or animation support. */
export const AboutReveal = ({ children }: { children: ReactNode }) => {
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
          const animation = animateReveal(entry.target);
          animations.push(animation);
        }
      },
      { threshold: 0.12 }
    );

    if (root && !prefersReducedMotion()) {
      for (const element of root.querySelectorAll("[data-about-reveal]")) {
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
