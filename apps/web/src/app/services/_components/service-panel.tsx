import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import {
  BEZEL,
  BEZEL_CORE,
  buttonClass,
  FADE_WHEN_REDUCED,
} from "@/app/_components/styles";
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
      // Room for the sticky pill when a jump link lands here. The first panel enters with the
      // header; the rest rise as they scroll into view (Reveal).
      className={`${BEZEL} scroll-mt-[104px] max-md:scroll-mt-[84px] ${reveal ? "" : `animate-[riseIn_800ms_var(--ease-out)_300ms_both] ${FADE_WHEN_REDUCED}`}`}
      aria-labelledby={titleId}
      data-reveal={reveal ? "" : undefined}
    >
      <div
        className={`${BEZEL_CORE} grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-[clamp(40px,6vw,88px)] gap-y-8 p-[clamp(28px,4.4vw,60px)] max-md:grid-cols-1 max-md:gap-0 max-md:px-[22px] max-md:pt-[26px] max-md:pb-6`}
      >
        <div className="flex flex-col items-start max-md:contents">
          <p
            className="mb-[22px] flex gap-1.5 text-[13px] font-semibold tracking-[0.02em] text-brand-text tabular-nums"
            aria-hidden="true"
          >
            <span>{numeral(position)}</span>
            <span className="text-[oklch(0.52_0.005_286/0.55)]">
              / {numeral(SERVICES.length)}
            </span>
          </p>
          <h2
            id={titleId}
            className="text-[clamp(32px,3.8vw,50px)] leading-none font-semibold tracking-[-0.052em]"
          >
            {service.title}
          </h2>
          <p className="mt-3.5 mb-9 max-w-[24ch] text-[clamp(17px,1.45vw,20px)] leading-[1.35] font-medium tracking-[-0.02em] text-balance text-ink-soft max-md:mb-0">
            {service.promise}
          </p>
          <FlightLink
            href={workRouteFor(service.slug)}
            // Pinned to the bottom of the spread so it lines up with the list's end; last on a phone.
            className={`${buttonClass("quiet", "card")} mt-auto max-md:order-1 max-md:mt-7 max-md:justify-self-start`}
          >
            {service.workLinkLabel}
            <ButtonIcon />
          </FlightLink>
        </div>
        <div className="pt-[38px] max-md:pt-5">
          <p className="max-w-[58ch] text-[17px] leading-[1.7] tracking-[-0.005em] text-pretty text-ink-soft">
            {service.description}
          </p>
          <p className="mt-4 text-[14.5px] leading-[1.55] text-pretty text-ink-muted">
            <span className="mr-2 inline-block font-semibold text-ink">
              Good for
            </span>
            {service.goodFor}
          </p>
          <div className="mt-[30px] pt-[26px] shadow-rule">
            <h3 className="mb-4 text-[11px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
              What you get
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-md:grid-cols-1">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[11px] text-[15px] leading-[1.45] font-medium tracking-[-0.01em] text-ink"
                >
                  <span className="-mt-[0.5px] grid size-[21px] shrink-0 place-items-center rounded-full bg-brand/9 text-brand-text">
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
