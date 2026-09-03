import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { projectsFor } from "@/app/_lib/projects";
import { SERVICES, serviceBySlug } from "@/app/_lib/services";
import { ProjectGrid } from "@/app/work/_components/project-grid";

/** One static page per service in the catalogue. Anything else in the segment is a 404. */
export const generateStaticParams = () =>
  SERVICES.map((service) => ({ service: service.slug }));

/**
 * The filter is read from `params` before the grid renders, so the page is "allowed to block":
 * a Suspense boundary would turn an unknown slug into a soft 404 and flash a placeholder grid
 * on every filter change. The pages are static, and the filter chips prefetch them (see
 * WorkFilter), so nothing blocks in practice.
 */
// fallow-ignore-next-line unused-export
export const instant = false;

export const generateMetadata = async ({
  params,
}: PageProps<"/work/[service]">): Promise<Metadata> => {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  return service === undefined
    ? {}
    : { title: service.workTitle, description: service.workLede };
};

const WorkServicePage = async ({ params }: PageProps<"/work/[service]">) => {
  const { service: slug } = await params;
  const service = serviceBySlug(slug);
  if (service === undefined) {
    notFound();
  }

  return <ProjectGrid projects={projectsFor(service.slug)} service={service} />;
};

export default WorkServicePage;
