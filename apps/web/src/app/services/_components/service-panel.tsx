import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import type { Service } from "@/app/_lib/services";
import { SERVICES, workRouteFor } from "@/app/_lib/services";

export interface ServicePanelProps {
  service: Service;
  /** 1-based position in the catalogue, for the numeral. */
  position: number;
  /** Rise into view on scroll; off for a panel that is already on screen with the header. */
  reveal: boolean;
}

const numeral = (position: number) => String(position).padStart(2, "0");

/** A hairline tick, the list mark shared by every deliverable. */
const TickIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m3 7.4 2.6 2.6L11 4.4" />
  </svg>
);

/**
 * One service as an editorial spread: the name and its promise on the left, what it is and what
 * the client gets on the right, and the door into the matching work beneath the name.
 */
export const ServicePanel = ({
  service,
  position,
  reveal,
}: ServicePanelProps) => {
  const titleId = `${service.slug}-title`;

  return (
    <section
      id={service.slug}
      className="service-panel bezel"
      aria-labelledby={titleId}
      data-reveal={reveal ? "" : undefined}
    >
      <div className="service-core bezel-core">
        <div className="service-head">
          <p className="service-number" aria-hidden="true">
            <span>{numeral(position)}</span>
            <span className="service-number-total">
              / {numeral(SERVICES.length)}
            </span>
          </p>
          <h2 id={titleId} className="service-title">
            {service.title}
          </h2>
          <p className="service-promise">{service.promise}</p>
          <FlightLink
            href={workRouteFor(service.slug)}
            className="button button-quiet service-link"
          >
            {service.workLinkLabel}
            <span className="button-icon">
              <ArrowIcon />
            </span>
          </FlightLink>
        </div>
        <div className="service-body">
          <p className="service-description">{service.description}</p>
          <p className="service-good-for">
            <span className="service-good-for-label">Good for</span>
            {service.goodFor}
          </p>
          <div className="service-aside">
            <h3 className="service-aside-title">What you get</h3>
            <ul className="service-deliverables">
              {service.deliverables.map((item) => (
                <li key={item} className="service-deliverable">
                  <span className="service-tick">
                    <TickIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
