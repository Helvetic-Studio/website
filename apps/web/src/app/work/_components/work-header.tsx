"use client";

import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { serviceBySlug } from "@/app/_lib/services";
import { departingShuffle, useShuffle } from "@/app/work/_lib/shuffle";

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

/**
 * The heading follows the filter. Keyed by filter so a change swaps the text: the old words go
 * while the cards are gathered (a shuffle is leaving), the new ones rise as the cards are dealt.
 * The layout around it never remounts.
 */
export const WorkHeader = () => {
  const heading = headingFor(useSelectedLayoutSegment());
  const pathname = usePathname();
  const leaving = departingShuffle(useShuffle(), pathname) !== null;
  const shuffleState = leaving ? "out" : undefined;

  return (
    <>
      <p className="page-eyebrow">
        <span className="brand-dot" aria-hidden="true" />
        Work
      </p>
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
    </>
  );
};
