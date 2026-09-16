import Image from "next/image";

export const StudioMap = () => (
  <figure className="about-map-shell">
    <div className="about-map-core">
      <div className="about-map-topline">
        <span className="about-micro">Our corner of Switzerland</span>
        <span className="about-swiss-cross" aria-hidden="true" />
      </div>
      <div className="about-map-art">
        <Image
          src="/about/switzerland.svg"
          alt="Map of Switzerland. Our studio is based in Wil, in the northeastern canton of St. Gallen."
          width={480}
          height={300}
          preload
        />
        <div className="about-map-pin" aria-hidden="true">
          <span className="about-map-pin-label">
            Wil SG <span>We’re here</span>
          </span>
          <span className="about-map-pin-stem" />
          <span className="about-map-pin-dot" />
        </div>
        <span className="about-map-country" aria-hidden="true">
          Switzerland
        </span>
      </div>
      <figcaption className="about-map-caption">
        <div>
          <span className="about-micro">Local roots. Open horizons.</span>
          <p>Wil SG, Switzerland</p>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Wil+SG+Switzerland"
          target="_blank"
          rel="noopener noreferrer"
          className="about-map-link"
          aria-label="Explore Wil SG on Google Maps (opens in a new tab)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M6 18 18 6M6 6h12v12" />
          </svg>
        </a>
      </figcaption>
    </div>
  </figure>
);
