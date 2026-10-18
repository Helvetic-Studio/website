import type { Metadata } from "next";

import { ButtonIcon } from "@/app/_components/button-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";
import { Reveal } from "@/app/_components/reveal";
import { SiteFooter } from "@/app/_components/site-footer";
import { buttonClass, FADE_WHEN_REDUCED, PAGE } from "@/app/_components/styles";
import { WorkFilter } from "@/app/work/_components/work-filter";
import { WorkHeader } from "@/app/work/_components/work-header";
import { WorkRegion } from "@/app/work/_components/work-region";

// TODO: lift noindex once the placeholder projects are replaced by real case studies
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

/**
 * The header, the filter and everything below the board live in the layout, so they stay put
 * while the board beneath the filter swaps. The page answers in order: what we have built (the
 * board), where we build it (the region), and the door.
 */
const WorkLayout = ({ children }: LayoutProps<"/work">) => (
  <>
    <div data-slot="work-page" className={PAGE}>
      {/* The block enters once; the words inside swap with the filter. It paints above the board,
          so the cards are dealt from under the chips rather than over them. */}
      <header
        className={`relative z-20 mb-16 animate-[riseIn_700ms_var(--rise-ease)_60ms_both] ${FADE_WHEN_REDUCED} max-md:mb-10`}
      >
        <WorkHeader />
        <WorkFilter />
      </header>
      {children}
      <Reveal>
        <WorkRegion />
        <ClosingPanel
          tone="red"
          id="work-cta-title"
          title="Your company could be next."
          text="Tell us what you want to build. You get a clear plan and a price range before you commit to anything."
        >
          <FlightLink href="/contact" className={buttonClass("light")}>
            Start a project
            <ButtonIcon />
          </FlightLink>
          <FlightLink href="/services" className={buttonClass("onRed")}>
            See our services
          </FlightLink>
        </ClosingPanel>
      </Reveal>
    </div>
    <SiteFooter />
  </>
);

export default WorkLayout;
