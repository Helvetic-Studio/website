"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { serviceBySlug } from "@/app/_lib/services";

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
 * The heading follows the filter. Keyed by filter so a change swaps the text with a short rise
 * instead of the words teleporting; the layout around it never remounts.
 */
export const WorkHeader = () => {
  const heading = headingFor(useSelectedLayoutSegment());

  return (
    <>
      <p className="page-eyebrow">
        <span className="brand-dot" aria-hidden="true" />
        Work
      </p>
      <h1 key={heading.filter} className="page-title work-title">
        {heading.title}
      </h1>
      <p key={`${heading.filter}-lede`} className="page-lede work-lede">
        {heading.lede}
      </p>
    </>
  );
};
