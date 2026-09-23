import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { RIDGE_POLYGONS, VIEWBOX } from "@/app/_lib/peaks";

/** The close: for the visitor who read everything and still does not know which door to take. */
export const CtaPanel = () => (
  <section className="cta-panel bezel" aria-labelledby="cta-title" data-reveal>
    <div className="cta-core">
      {/* The home range, in silhouette: the way back to every door. */}
      <svg
        className="cta-ridge"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points={RIDGE_POLYGONS.mid} className="cta-ridge-back" />
        <polygon points={RIDGE_POLYGONS.near} className="cta-ridge-front" />
      </svg>
      <h2 id="cta-title" className="cta-title">
        Not sure which service you need?
      </h2>
      <p className="cta-text">
        Tell us what you want to achieve. We&rsquo;ll suggest the right approach
        and give you a price range before you commit to anything.
      </p>
      <div className="cta-actions">
        <FlightLink href="/contact" className="button button-light">
          Start a project
          <span className="button-icon">
            <ArrowIcon />
          </span>
        </FlightLink>
        <FlightLink href="/work" className="button button-on-red">
          See all our work
        </FlightLink>
      </div>
    </div>
  </section>
);
