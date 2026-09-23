import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { SITE_LINKS } from "@/app/_lib/site-links";

export interface SiteFooterProps {
  /** One more door to a conversation — left out on the page that already is one. */
  invite?: boolean;
}

/**
 * The close of every content page (the home page is the range itself and has none): an invitation
 * to talk, the site map, and the studio's place on the map.
 */
export const SiteFooter = ({ invite = true }: SiteFooterProps) => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <FlightLink href="/" className="nav-brand">
            <span className="nav-mark" aria-hidden="true" />
            helvetic.studio
          </FlightLink>
          <p className="footer-tagline">
            Thoughtfully designed. Precisely built. In Switzerland.
          </p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <ul>
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <FlightLink href={link.href} className="footer-link">
                  {link.label}
                </FlightLink>
              </li>
            ))}
          </ul>
        </nav>
        {invite ? (
          <div className="footer-contact">
            <p className="footer-contact-title">Have something in mind?</p>
            <FlightLink href="/contact" className="button button-primary">
              Start a project
              <span className="button-icon">
                <ArrowIcon />
              </span>
            </FlightLink>
          </div>
        ) : null}
      </div>
      <div className="footer-bottom">
        <span>© 2026 Helvetic Studio</span>
        <span className="footer-place">
          <span className="swiss-cross" aria-hidden="true" />
          Wil SG, Switzerland
        </span>
      </div>
    </div>
    <p className="footer-wordmark" aria-hidden="true">
      helvetic
    </p>
  </footer>
);
