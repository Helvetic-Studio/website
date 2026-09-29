import { ArrowIcon } from "@/app/_components/arrow-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";

/** The close: for the visitor who read everything and still does not know which door to take. */
export const CtaPanel = () => (
  <ClosingPanel
    tone="red"
    id="cta-title"
    title="Not sure which service you need?"
    text="Tell us what you want to achieve. We’ll suggest the right approach and give you a price range before you commit to anything."
  >
    <FlightLink href="/contact" className="button button-light">
      Start a project
      <span className="button-icon">
        <ArrowIcon />
      </span>
    </FlightLink>
    <FlightLink href="/work" className="button button-on-red">
      See all our work
    </FlightLink>
  </ClosingPanel>
);
