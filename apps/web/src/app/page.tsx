import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";

const Page = () => (
  <div className="hero">
    <p className="hero-badge">
      <span className="brand-dot" aria-hidden="true" />
      {/* TODO: "Swiss web studio" or "Swiss software studio"; add the season once booking is confirmed */}
      Swiss web studio · Now taking on new projects
    </p>
    <h1 className="hero-title">Build a website. Get noticed. Grow.</h1>
    <p className="hero-lede">
      Sharp, fast websites that turn visitors into customers.
    </p>
    <div className="hero-actions">
      <FlightLink href="/contact" className={cn(buttonVariants(), "hero-cta")}>
        Start a project
      </FlightLink>
      <FlightLink href="/work" className="hero-link">
        See our work
        <ArrowIcon />
      </FlightLink>
    </div>
  </div>
);

export default Page;
