import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import {
  buttonClass,
  FOCUS_RING,
  NAV_BRAND,
  NAV_MARK,
  SWISS_CROSS,
} from "@/app/_components/styles";
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
  <footer className="relative mt-auto overflow-hidden px-6">
    <div className="mx-auto max-w-[1160px] pt-14 pb-7 shadow-rule max-md:pt-11">
      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_auto] items-start gap-12 max-md:grid-cols-1 max-md:gap-9 md:max-lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <FlightLink href="/" className={NAV_BRAND}>
            <span className={NAV_MARK} aria-hidden="true" />
            helvetic.studio
          </FlightLink>
          <p className="mt-4 max-w-[28ch] text-[14.5px] leading-[1.55] text-ink-muted">
            {/* Non-breaking spaces keep each phrase whole: never "… In / Switzerland." */}
            Thoughtfully designed. Precisely&nbsp;built. In&nbsp;Switzerland.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-0.5">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <FlightLink
                  href={link.href}
                  className={`inline-block rounded-[6px] py-[5px] text-[15px] font-medium tracking-[-0.01em] text-ink-soft transition-colors duration-200 ease-[ease] pointer-fine:hover:text-brand-text ${FOCUS_RING}`}
                >
                  {link.label}
                </FlightLink>
              </li>
            ))}
          </ul>
        </nav>
        {invite ? (
          <div className="md:max-lg:col-span-full">
            <p className="mb-[18px] text-[22px] font-[580] tracking-[-0.04em]">
              Have something in mind?
            </p>
            <FlightLink href="/contact" className={buttonClass("primary")}>
              Start a project
              <ButtonIcon />
            </FlightLink>
          </div>
        ) : null}
      </div>
      <div className="mt-16 flex flex-wrap justify-between gap-x-6 gap-y-3 text-[13px] text-ink-muted max-md:mt-11">
        <span>© 2026 Helvetic Studio</span>
        <span className="inline-flex items-center gap-2.5">
          <span className={SWISS_CROSS} aria-hidden="true" />
          Wil SG, Switzerland
        </span>
      </div>
    </div>
    {/* The name, set large and faint, sinking into the page's lower edge. */}
    <p
      className="mx-auto -mb-[0.2em] max-w-[1160px] text-center text-[clamp(96px,23vw,330px)] leading-none font-[650] tracking-[-0.075em] whitespace-nowrap text-brand/7 select-none"
      aria-hidden="true"
    >
      helvetic
    </p>
  </footer>
);
