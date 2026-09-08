"use client";

import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import type { RefObject } from "react";
import { useLayoutEffect, useRef } from "react";

import { prefersReducedMotion, riseEaseOf } from "@/app/_lib/motion";
import { serviceBySlug } from "@/app/_lib/services";
import { glideKeyframes, HEADING_GLIDE_MS } from "@/app/work/_lib/heading";
import { useShuffle } from "@/app/work/_lib/shuffle";

interface Heading {
  /** Keys the text so a filter change swaps it with a short rise. */
  filter: string;
  title: string;
  lede: string;
}

const ALL_WORK: Heading = {
  filter: "all",
  title: "Work we're proud of.",
  lede: "Websites, shops, applications and design for companies across Switzerland. Filter by service, or browse the lot.",
};

/** The heading for the filter in the URL; the whole catalogue when there is none, or an unknown one. */
const headingFor = (segment: string | null): Heading => {
  const service = segment === null ? undefined : serviceBySlug(segment);
  if (service === undefined) {
    return ALL_WORK;
  }
  return {
    filter: service.slug,
    title: service.workTitle,
    lede: service.workLede,
  };
};

/** Plays the block from the height it had to the height it has, and remembers the new one. */
const glideTo = (
  element: HTMLDivElement,
  height: RefObject<number | null>
): Animation | null => {
  const after = element.offsetHeight;
  const keyframes = prefersReducedMotion()
    ? null
    : glideKeyframes(height.current, after);
  height.current = after;
  return keyframes === null
    ? null
    : element.animate(keyframes, {
        duration: HEADING_GLIDE_MS,
        easing: riseEaseOf(element),
      });
};

/**
 * The words of one filter rarely take the same lines as the next: a lede wraps, a title breaks.
 * Rather than let the chips and the grid jump, the block glides from the old height to the new
 * one while the new words rise. The cards are dealt relative to the chip, so they follow it.
 */
const useGlidingHeight = (
  block: RefObject<HTMLDivElement | null>,
  filter: string
) => {
  const height = useRef<number | null>(null);

  // The height at rest follows the viewport, so a glide starts from where the block really is.
  useLayoutEffect(() => {
    const element = block.current;
    const observer = new ResizeObserver(() => {
      height.current = element?.offsetHeight ?? null;
    });
    if (element !== null) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, [block]);

  useLayoutEffect(() => {
    const element = block.current;
    const glide = element === null ? null : glideTo(element, height);
    return () => {
      glide?.cancel();
    };
  }, [block, filter]);
};

/**
 * The heading follows the filter. Keyed by filter so a change swaps the text: the old words go
 * while the cards are gathered (a shuffle is leaving), the new ones rise as the cards are dealt.
 * The layout around it never remounts.
 */
export const WorkHeader = () => {
  const heading = headingFor(useSelectedLayoutSegment());
  const pathname = usePathname();
  const shuffle = useShuffle();
  // Out from the click until the new words are on screen: the push comes some frames before the
  // swap, and the old words must not come back in between.
  const leaving = shuffle !== null && shuffle.target !== pathname;
  const shuffleState = leaving ? "out" : undefined;
  const block = useRef<HTMLDivElement>(null);
  useGlidingHeight(block, heading.filter);

  return (
    <>
      <p className="page-eyebrow">
        <span className="brand-dot" aria-hidden="true" />
        Work
      </p>
      <div ref={block} className="work-heading">
        <h1
          key={heading.filter}
          className="page-title work-title"
          data-shuffle={shuffleState}
        >
          {heading.title}
        </h1>
        <p
          key={`${heading.filter}-lede`}
          className="page-lede work-lede"
          data-shuffle={shuffleState}
        >
          {heading.lede}
        </p>
      </div>
    </>
  );
};
