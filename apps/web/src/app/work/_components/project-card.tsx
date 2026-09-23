import Link from "next/link";
import type { CSSProperties } from "react";

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

export const ProjectCard = ({ project, order }: ProjectCardProps) => {
  const style: CSSProperties & CardVariables = {
    "--card-order": String(order),
    "--cover-hue": String(project.coverHue),
  };

  return (
    <li className="project-card" style={style}>
      <div className="project-core">
        <ProjectCover project={project} />
        <div className="project-body">
          <p className="project-meta">
            <span>{project.client}</span>
            <span className="project-year">{project.year}</span>
          </p>
          <h2 className="project-title">
            {project.url === undefined ? (
              project.title
            ) : (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            )}
          </h2>
          <p className="project-summary">{project.summary}</p>
          <ul className="project-tags" aria-label="Services">
            {servicesOf(project).map((service) => (
              <li key={service.slug}>
                <Link
                  href={workRouteFor(service.slug)}
                  className="project-tag"
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
