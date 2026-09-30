import { ButtonIcon } from "@/app/_components/button-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";
import { buttonClass } from "@/app/_components/styles";

/** The close: for the visitor who read everything and still does not know which door to take. */
export const CtaPanel = () => (
  <ClosingPanel
    tone="red"
    id="cta-title"
    title="Not sure which service you need?"
    text="Tell us what you want to achieve. We’ll suggest the right approach and give you a price range before you commit to anything."
  >
    <FlightLink href="/contact" className={buttonClass("light")}>
      Start a project
      <ButtonIcon />
    </FlightLink>
    <FlightLink href="/work" className={buttonClass("onRed")}>
      See all our work
    </FlightLink>
  </ClosingPanel>
);
