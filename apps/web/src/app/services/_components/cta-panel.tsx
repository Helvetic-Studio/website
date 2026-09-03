import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";

/** The close: for the visitor who read everything and still does not know which door to take. */
export const CtaPanel = () => (
  <section className="cta-panel" aria-labelledby="cta-title">
    <h2 id="cta-title" className="cta-title">
      Not sure which service you need?
    </h2>
    <p className="cta-text">
      Tell us what you want to achieve. We&rsquo;ll suggest the right approach
      and give you a price range before you commit to anything.
    </p>
    <div className="cta-actions">
      <FlightLink
        href="/contact"
        className={cn(buttonVariants(), "cta-button")}
      >
        Start a project
      </FlightLink>
      <FlightLink href="/work" className="cta-link">
        See all our work
        <ArrowIcon />
      </FlightLink>
    </div>
  </section>
);
