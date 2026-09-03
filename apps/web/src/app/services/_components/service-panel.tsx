import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import type { Service } from "@/app/_lib/services";
import { workRouteFor } from "@/app/_lib/services";

export interface ServicePanelProps {
  service: Service;
  /** 1-based position in the catalogue, for the numeral. */
  position: number;
}

const numeral = (position: number) => String(position).padStart(2, "0");

/** One service: what it is, what the client gets, and the door into the matching work. */
export const ServicePanel = ({ service, position }: ServicePanelProps) => {
  const titleId = `${service.slug}-title`;

  return (
    <section
      id={service.slug}
      className="service-panel"
      aria-labelledby={titleId}
    >
      <div className="service-main">
        <p className="service-number" aria-hidden="true">
          {numeral(position)}
        </p>
        <h2 id={titleId} className="service-title">
          {service.title}
        </h2>
        <p className="service-promise">{service.promise}</p>
        <p className="service-description">{service.description}</p>
        <p className="service-good-for">
          <span className="service-good-for-label">Good for</span>
          {service.goodFor}
        </p>
      </div>
      <div className="service-aside">
        <h3 className="service-aside-title">What you get</h3>
        <ul className="service-deliverables">
          {service.deliverables.map((item) => (
            <li key={item} className="service-deliverable">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="service-actions">
        <FlightLink href={workRouteFor(service.slug)} className="page-link">
          {service.workLinkLabel}
          <ArrowIcon />
        </FlightLink>
      </div>
    </section>
  );
};
