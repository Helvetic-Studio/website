import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { FADE_WHEN_REDUCED, PAGE_LINK } from "@/app/_components/styles";
import type { Project } from "@/app/_lib/projects";
import type { Service } from "@/app/_lib/services";
import { CardDeck } from "@/app/work/_components/card-deck";
import { ProjectCard } from "@/app/work/_components/project-card";

export interface ProjectGridProps {
  projects: readonly Project[];
  /** The active filter, for the empty state's wording. */
  service?: Service;
}

const WorkEmpty = ({ service }: { service: Service | undefined }) => (
  <div
    className={`rounded-shell bg-core px-6 py-12 text-center shadow-[inset_0_1px_0_oklch(1_0_0),inset_0_0_0_1px_oklch(1_0_0/0.85),0_1px_2px_oklch(0.35_0.06_30/0.04),0_28px_70px_-44px_oklch(0.35_0.08_30/0.34)] animate-[cardIn_560ms_var(--rise-ease)_both] ${FADE_WHEN_REDUCED}`}
  >
    <h2 className="text-[24px] font-semibold tracking-[-0.04em]">
      {service === undefined
        ? "Nothing published yet."
        : `No ${service.title.toLowerCase()} case studies published yet.`}
    </h2>
    <p className="mx-auto mt-2 mb-3 max-w-[440px] text-[15px] leading-[1.5] text-ink-muted">
      Ask us for references — we&rsquo;ll happily walk you through recent work.
    </p>
    <FlightLink href="/contact" className={PAGE_LINK}>
      Get in touch
      <ArrowIcon />
    </FlightLink>
  </div>
);

export const ProjectGrid = ({ projects, service }: ProjectGridProps) => {
  if (projects.length === 0) {
    return <WorkEmpty service={service} />;
  }

  return (
    <CardDeck>
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} order={index} />
      ))}
    </CardDeck>
  );
};
