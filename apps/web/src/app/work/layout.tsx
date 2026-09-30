import type { Metadata } from "next";

import { SiteFooter } from "@/app/_components/site-footer";
import { FADE_WHEN_REDUCED, PAGE, PAGE_HEAD } from "@/app/_components/styles";
import { WorkFilter } from "@/app/work/_components/work-filter";
import { WorkHeader } from "@/app/work/_components/work-header";

// TODO: lift noindex once the placeholder projects are replaced by real case studies
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

// The header and the filter live in the layout so they stay put while the grid beneath them swaps.
const WorkLayout = ({ children }: LayoutProps<"/work">) => (
  <>
    <div data-slot="work-page" className={PAGE}>
      {/* The block enters once; the words inside swap with the filter. It paints above the grid, so
          the cards are dealt from under the chips rather than over them. */}
      <header
        className={`${PAGE_HEAD} relative z-20 animate-[riseIn_700ms_var(--rise-ease)_60ms_both] ${FADE_WHEN_REDUCED}`}
      >
        <WorkHeader />
        <WorkFilter />
      </header>
      {children}
    </div>
    <SiteFooter />
  </>
);

export default WorkLayout;
