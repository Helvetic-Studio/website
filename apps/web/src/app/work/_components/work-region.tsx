import Image from "next/image";

import {
  BEZEL,
  BEZEL_CORE,
  FOCUS_RING,
  SECTION_TITLE,
  SWISS_CROSS,
} from "@/app/_components/styles";
import { PROJECTS } from "@/app/_lib/projects";
import { CREDITS, PLACES } from "@/app/work/_lib/places";

// TODO: first-draft copy — confirm the promise of a first meeting at the client's place.
const STATEMENT =
  "We work from Wil SG, between Lake Constance and Lake Zurich. The first meeting happens at your place, so we see how the business really runs before we design anything.";

const ROW = "py-4 shadow-[0_-1px_0_var(--color-hairline)]";
const TOWN =
  "flex items-center gap-3 text-[20px] font-semibold tracking-[-0.03em]";
const WHO = "mt-1 block text-[15px] text-ink-muted";

/** The towns the work on this page was made for, with the studio's own at the head. */
const Towns = () => (
  <ul
    aria-label="Where the work is"
    className="grid grid-cols-2 gap-x-8 self-start max-sm:grid-cols-1"
    data-reveal
    data-reveal-delay="120"
  >
    <li className={ROW}>
      <span className={TOWN}>
        <span className={SWISS_CROSS} aria-hidden="true" />
        Wil SG
      </span>
      <span className={WHO}>The studio</span>
    </li>
    {PROJECTS.map((project) => (
      <li key={project.slug} className={ROW}>
        <span className={TOWN}>{project.town}</span>
        <span className={WHO}>{project.title}</span>
      </li>
    ))}
  </ul>
);

/** Every photograph on the page, credited where it is used: under the work it stands behind. */
const Credits = () => (
  <p className="mt-16 max-w-[110ch] text-[13.5px] leading-[1.7] text-ink-soft max-md:mt-12">
    Photographs of the places, via Wikimedia Commons:{" "}
    {CREDITS.map((credit, index) => (
      <span key={credit.source}>
        <a
          href={credit.source}
          className={`underline decoration-hairline underline-offset-[3px] pointer-fine:hover:text-brand-text ${FOCUS_RING}`}
        >
          {credit.title}
        </a>{" "}
        by {credit.author},{" "}
        <a
          href={credit.licenceUrl}
          className={`underline decoration-hairline underline-offset-[3px] pointer-fine:hover:text-brand-text ${FOCUS_RING}`}
        >
          {credit.licence}
        </a>
        {index === CREDITS.length - 1 ? "." : "; "}
      </span>
    ))}{" "}
    The interfaces in front of them are drawings of our work, not screenshots.
  </p>
);

/**
 * Where the work happens: the range every client on this page can see from their window, then the
 * towns themselves. Sits beneath the board in the layout, so it stays put while the filters swap.
 */
export const WorkRegion = () => {
  const panorama = PLACES.alpstein;

  return (
    <section
      aria-labelledby="work-region-title"
      className="mt-[168px] max-md:mt-24"
    >
      <div className={BEZEL} data-reveal>
        <div
          className={`${BEZEL_CORE} relative h-[clamp(220px,30vw,400px)] overflow-hidden`}
        >
          <Image
            src={panorama.photo}
            alt={panorama.alt}
            fill
            sizes="(min-width: 1160px) 1120px, 100vw"
            placeholder="blur"
            className="object-cover object-[50%_40%]"
          />
          <p className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-[7px] text-[13px] leading-none font-medium text-ink">
            {panorama.caption}
          </p>
        </div>
      </div>
      <div className="mt-14 grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-x-20 gap-y-10 max-lg:grid-cols-1 max-md:mt-10">
        <div>
          <h2 id="work-region-title" className={SECTION_TITLE} data-reveal>
            Made close to home.
          </h2>
          <p
            className="mt-6 max-w-[42ch] text-[clamp(18px,1.6vw,21px)] leading-[1.55] tracking-[-0.01em] text-pretty text-ink"
            data-reveal
            data-reveal-delay="80"
          >
            {STATEMENT}
          </p>
        </div>
        <Towns />
      </div>
      <Credits />
    </section>
  );
};
