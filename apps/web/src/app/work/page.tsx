import type { Metadata } from "next";

import { PROJECTS } from "@/app/_lib/projects";
import { ProjectGrid } from "@/app/work/_components/project-grid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Websites, shops, applications and design Helvetic Studio has built for companies across Switzerland.",
};

const WorkPage = () => <ProjectGrid projects={PROJECTS} />;

export default WorkPage;
