import Link from "next/link";
import type { CSSProperties } from "react";

import {
  BEZEL_CORE,
  FADE_WHEN_REDUCED,
  FOCUS_RING,
} from "@/app/_components/styles";
import type { Project } from "@/app/_lib/projects";
import { servicesOf } from "@/app/_lib/projects";
import { workRouteFor } from "@/app/_lib/services";
import { ProjectCover } from "@/app/work/_components/project-cover";
import type { TileSize } from "@/app/work/_lib/tiles";

export interface ProjectCardProps {
  project: Project;
  /** Position on the board, for the entrance stagger. */
  order: number;
  size: TileSize;
}

type CardVariables = Record<"--card-order", string>;

/**
 * The card is the shell; its core holds the cover and the words. Each card enters a beat after the
 * one before it. Landed by a flight, the board is dealt from the active chip instead (see CardDeck):
 * the cards fly by the Web Animations API, so the rise stands down (`data-deal` on the board) and
 * the layout is measured plain. In the air a card is lifted above the cards it crosses, solid, and
 * settles back on landing (`data-flying`).
 */
const CARD = `group/tile flex rounded-shell bg-shell p-(--bezel) shadow-shell animate-[cardIn_560ms_var(--rise-ease)_calc(var(--card-order)*60ms)_both] [transition:box-shadow_220ms_var(--rise-ease)] ${FADE_WHEN_REDUCED} in-data-deal:animate-none data-flying:z-[calc(var(--card-order)+1)] data-flying:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.62),0_40px_80px_-36px_oklch(0.25_0.06_28/0.55)] data-flying:will-change-[transform,opacity]`;

const SPAN: Record<TileSize, string> = {
  full: "col-span-12",
  wide: "col-span-7 max-lg:col-span-12",
  narrow: "col-span-5 max-lg:col-span-12",
};

// The lead tile sets its words in two columns beside each other; the pairs stack them.
const WORDS: Record<TileSize, string> = {
  full: "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14 lg:px-6 lg:pt-8",
  wide: "",
  narrow: "",
};

const SUMMARY_GAP: Record<TileSize, string> = {
  full: "max-lg:mt-4",
  wide: "mt-4",
  narrow: "mt-4",
};

const TITLE: Record<TileSize, string> = {
  full: "text-[clamp(34px,4vw,54px)] tracking-[-0.055em]",
  wide: "text-[clamp(28px,2.6vw,36px)] tracking-[-0.05em]",
  narrow: "text-[clamp(28px,2.6vw,36px)] tracking-[-0.05em]",
};

const ServiceTags = ({ project }: { project: Project }) => (
  <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Services">
    {servicesOf(project).map((service) => (
      <li key={service.slug}>
        <Link
          href={workRouteFor(service.slug)}
          className={`inline-flex min-h-9 items-center rounded-full bg-brand/8 px-3.5 text-[14px] font-[560] text-brand-text transition-[background-color] duration-200 ease-[ease] pointer-fine:hover:bg-brand/14 active:bg-brand/16 active:duration-[80ms] ${FOCUS_RING} max-md:min-h-11`}
          prefetch={true}
        >
          {service.title}
        </Link>
      </li>
    ))}
  </ul>
);

export const ProjectCard = ({ project, order, size }: ProjectCardProps) => {
  const style: CSSProperties & CardVariables = {
    "--card-order": String(order),
  };

  return (
    <li
      data-slot="project-card"
      data-size={size}
      className={`${CARD} ${SPAN[size]}`}
      style={style}
    >
      <article
        className={`${BEZEL_CORE} flex min-w-0 flex-1 flex-col px-2 pt-2 pb-7`}
      >
        <ProjectCover project={project} size={size} lead={order === 0} />
        <div className={`flex flex-1 flex-col px-4 pt-6 ${WORDS[size]}`}>
          <div>
            <h2 className={`leading-[1.02] font-semibold ${TITLE[size]}`}>
              {project.url === undefined ? (
                project.title
              ) : (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors duration-200 ease-[ease] pointer-fine:hover:text-brand-text ${FOCUS_RING}`}
                >
                  {project.title}
                </a>
              )}
            </h2>
            <p className="mt-2.5 text-[15px] text-ink-muted">
              {project.sector} in {project.town}
              <span aria-hidden="true"> · </span>
              <span className="tabular-nums">{project.year}</span>
            </p>
          </div>
          <div className={`flex flex-1 flex-col ${SUMMARY_GAP[size]}`}>
            <p className="max-w-[46ch] text-[17px] leading-[1.55] text-pretty text-ink">
              {project.summary}
            </p>
            <ServiceTags project={project} />
          </div>
        </div>
      </article>
    </li>
  );
};
