import type { Metadata } from "next";

import { ButtonIcon } from "@/app/_components/button-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";
import { Reveal } from "@/app/_components/reveal";
import { SiteFooter } from "@/app/_components/site-footer";
import { buttonClass, PAGE } from "@/app/_components/styles";
import { ProcessClimb } from "@/app/services/_components/process-climb";
import { ServiceQuestions } from "@/app/services/_components/service-questions";
import { ServiceTour } from "@/app/services/_components/service-tour";
import { ServicesHero } from "@/app/services/_components/services-hero";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, online shops, web applications, design and ongoing care — one Swiss team from the first sketch to launch and beyond.",
  alternates: { canonical: "/services" },
};

/**
 * The page answers an owner's questions in the order they come: which service fits my situation
 * (the hero), what exactly is in it (the tour, each service linking to its own work), how does a
 * project run (the climb), what about cost and after launch (the questions) — then the door.
 */
const ServicesPage = () => (
  <>
    <Reveal>
      <div className={PAGE}>
        <ServicesHero />
        <ServiceTour />
        <ProcessClimb />
        <ServiceQuestions />
        <ClosingPanel
          tone="red"
          id="services-cta-title"
          eyebrow="Not sure which service fits?"
          title="Tell us the goal. We’ll find the route."
          text="Describe what you want to achieve. We’ll suggest the right approach and give you a price range before you commit to anything."
        >
          <FlightLink href="/contact" className={buttonClass("light")}>
            Start a project
            <ButtonIcon />
          </FlightLink>
          <FlightLink href="/work" className={buttonClass("onRed")}>
            See all our work
          </FlightLink>
        </ClosingPanel>
      </div>
    </Reveal>
    <SiteFooter />
  </>
);

export default ServicesPage;
