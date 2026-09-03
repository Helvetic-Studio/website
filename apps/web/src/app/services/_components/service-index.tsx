import { SERVICES } from "@/app/_lib/services";

const numeral = (position: number) => String(position).padStart(2, "0");

/** Jump links to the panels below. Plain anchors: the page scrolls, nothing flies. */
export const ServiceIndex = () => (
  <nav className="service-index" aria-label="Jump to a service">
    {SERVICES.map((service, index) => (
      <a
        key={service.slug}
        href={`#${service.slug}`}
        className="service-index-link"
      >
        <span className="service-index-number" aria-hidden="true">
          {numeral(index + 1)}
        </span>
        {service.title}
      </a>
    ))}
  </nav>
);
