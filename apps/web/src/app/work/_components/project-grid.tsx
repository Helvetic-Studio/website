import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
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
  <div className="work-empty">
    <h2 className="work-empty-title">
      {service === undefined
        ? "Nothing published yet."
        : `No ${service.title.toLowerCase()} case studies published yet.`}
    </h2>
    <p className="work-empty-text">
      Ask us for references — we&rsquo;ll happily walk you through recent work.
    </p>
    <FlightLink href="/contact" className="page-link">
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
