import type { Metadata } from "next";

import { WorkFilter } from "@/app/work/_components/work-filter";
import { WorkHeader } from "@/app/work/_components/work-header";

// TODO: lift noindex once the placeholder projects are replaced by real case studies
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

// The header and the filter live in the layout so they stay put while the grid beneath them swaps.
const WorkLayout = ({ children }: LayoutProps<"/work">) => (
  <div className="page">
    <header className="page-head work-head">
      <WorkHeader />
      <WorkFilter />
    </header>
    {children}
  </div>
);

export default WorkLayout;
