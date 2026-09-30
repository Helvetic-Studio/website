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

export interface ProjectCardProps {
  project: Project;
  /** Position in the grid, for the entrance stagger. */
  order: number;
}

type CardVariables = Record<"--card-order" | "--cover-hue", string>;

/**
 * The card is the shell; its core holds the cover and the words. Each card enters a beat after the
 * one before it. Landed by a flight, the grid is dealt from the active chip instead (see CardDeck):
 * the cards fly by the Web Animations API, so the rise stands down (`data-deal` on the grid) and the
 * layout is measured plain. In the air a card is lifted above the cards it crosses, solid, and
 * settles back on landing (`data-flying`).
 */
const CARD = `flex rounded-shell bg-shell p-(--bezel) shadow-shell animate-[cardIn_560ms_var(--rise-ease)_calc(var(--card-order)*60ms)_both] [transition:box-shadow_220ms_var(--rise-ease)] ${FADE_WHEN_REDUCED} in-data-deal:animate-none data-flying:z-[calc(var(--card-order)+1)] data-flying:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.62),0_40px_80px_-36px_oklch(0.25_0.06_28/0.55)] data-flying:will-change-[transform,opacity]`;

export const ProjectCard = ({ project, order }: ProjectCardProps) => {
  const style: CSSProperties & CardVariables = {
    "--card-order": String(order),
    "--cover-hue": String(project.coverHue),
  };

  return (
    <li data-slot="project-card" className={CARD} style={style}>
      <div
        className={`${BEZEL_CORE} flex min-w-0 flex-1 flex-col px-2 pt-2 pb-[26px]`}
      >
        <ProjectCover project={project} />
        <div className="flex flex-1 flex-col px-4 pt-[22px]">
          <p className="flex items-baseline justify-between gap-4 text-[13px] font-medium text-ink-muted">
            <span>{project.client}</span>
            <span className="shrink-0 tabular-nums">{project.year}</span>
          </p>
          <h2 className="mt-2 text-[25px] leading-[1.1] font-semibold tracking-[-0.045em]">
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
          <p className="mt-2 text-[15px] leading-[1.55] text-pretty text-ink-muted">
            {project.summary}
          </p>
          <ul
            className="mt-auto flex flex-wrap gap-1.5 pt-5"
            aria-label="Services"
          >
            {servicesOf(project).map((service) => (
              <li key={service.slug}>
                <Link
                  href={workRouteFor(service.slug)}
                  className={`inline-block rounded-full bg-brand/8 px-3 py-[7px] text-[13px] font-[560] text-brand-text transition-[background-color] duration-200 ease-[ease] pointer-fine:hover:bg-brand/14 active:bg-brand/16 active:duration-[80ms] ${FOCUS_RING} max-md:inline-flex max-md:min-h-11 max-md:items-center`}
                  prefetch={true}
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
};
