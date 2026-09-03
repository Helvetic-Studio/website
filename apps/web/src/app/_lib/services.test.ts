import { describe, expect, it } from "vite-plus/test";

import { PROJECTS, projectsFor, servicesOf } from "./projects";
import { SERVICES, serviceBySlug, workRouteFor } from "./services";

describe(serviceBySlug, () => {
  it("resolves every catalogue slug and nothing else", () => {
    for (const service of SERVICES) {
      expect(serviceBySlug(service.slug)).toBe(service);
    }
    expect(serviceBySlug("hosting")).toBeUndefined();
    expect(serviceBySlug("")).toBeUndefined();
  });
});

describe(workRouteFor, () => {
  it("is the Work page beneath /work", () => {
    expect(workRouteFor("websites")).toBe("/work/websites");
  });
});

describe(projectsFor, () => {
  it("keeps only the projects tagged with the service, in catalogue order", () => {
    const websites = projectsFor("websites");

    expect(websites.length).toBeGreaterThan(0);
    for (const project of websites) {
      expect(project.services).toContain("websites");
    }
    expect(websites.map((project) => project.slug)).toStrictEqual(
      PROJECTS.filter((project) => project.services.includes("websites")).map(
        (project) => project.slug
      )
    );
  });
});

describe(servicesOf, () => {
  it("lists a project's services in catalogue order, whatever order it was tagged in", () => {
    const project = PROJECTS.find((candidate) =>
      candidate.services.includes("design")
    );
    if (!project) {
      throw new Error("No project is tagged with design");
    }

    const titles = servicesOf(project).map((service) => service.slug);

    expect(titles).toStrictEqual(
      SERVICES.filter((service) => project.services.includes(service.slug)).map(
        (service) => service.slug
      )
    );
  });

  it("only tags services that exist", () => {
    for (const project of PROJECTS) {
      expect(servicesOf(project)).toHaveLength(project.services.length);
    }
  });
});
