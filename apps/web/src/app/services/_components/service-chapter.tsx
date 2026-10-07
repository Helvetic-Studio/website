import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { BEZEL, BEZEL_CORE, buttonClass } from "@/app/_components/styles";
import type { Service, ServiceSlug } from "@/app/_lib/services";
import { SERVICES, workRouteFor } from "@/app/_lib/services";
import { ServiceScene } from "@/app/services/_components/service-scenes";
import { numeral } from "@/app/services/_lib/tour";

export interface ServiceChapterProps {
  service: Service;
  /** 0-based position in the catalogue: the chapter's numeral and its key for the stage. */
  index: number;
  /** The chapter being read: its numeral turns red and its rule draws out. */
  active: boolean;
}

/** A chapter's own drawing, for the screens without the stage. */
const ChapterScene = ({ slug }: { slug: ServiceSlug }) => (
  <div className={`${BEZEL} mb-10 max-w-[560px] lg:hidden`} data-reveal>
    <div
      className={`${BEZEL_CORE} relative aspect-[10/9] overflow-hidden`}
      aria-hidden="true"
    >
      <div className="group/scene absolute inset-0" data-state="active">
        <ServiceScene slug={slug} />
      </div>
    </div>
  </div>
);

/** A hairline tick, the mark of every deliverable. */
const TickIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m3 7.4 2.6 2.6L11 4.4" />
  </svg>
);

/**
 * One service, told in the order an owner asks about it: what it is, what it promises, what is
 * in it, who it suits — and the door to the work done in it.
 */
export const ServiceChapter = ({
  service,
  index,
  active,
}: ServiceChapterProps) => {
  const titleId = `${service.slug}-title`;

  return (
    <article
      id={service.slug}
      // The jump links land the chapter under the sticky pill.
      className="scroll-mt-[104px] py-[clamp(56px,8vh,88px)] not-first:shadow-rule first:pt-0 last:pb-0 max-lg:py-16 max-lg:first:pt-0 max-md:scroll-mt-[84px] max-md:py-14"
      aria-labelledby={titleId}
      data-chapter={index}
    >
      <ChapterScene slug={service.slug} />
      <div data-reveal>
        <p
          className="flex items-center gap-3 text-[13px] font-semibold tabular-nums"
          aria-hidden="true"
        >
          <span
            className="text-ink-muted transition-colors duration-300 ease-[ease] data-[active=true]:text-brand-text"
            data-active={active}
          >
            {numeral(index + 1)}
          </span>
          <span className="relative h-px w-14 bg-hairline">
            <span
              className="absolute inset-0 origin-left scale-x-0 bg-brand transition-[scale] duration-[600ms] ease-out data-[active=true]:scale-x-100 motion-reduce:transition-none"
              data-active={active}
            />
          </span>
          <span className="text-ink-muted/70">{numeral(SERVICES.length)}</span>
        </p>
        <h2
          id={titleId}
          className="mt-5 text-[clamp(40px,4.4vw,60px)] leading-[0.98] font-semibold tracking-[-0.055em]"
        >
          {service.title}
        </h2>
        <p className="mt-3.5 max-w-[26ch] text-[clamp(18px,1.6vw,22px)] leading-[1.3] font-medium tracking-[-0.025em] text-balance text-ink-soft">
          {service.promise}
        </p>
        <p className="mt-6 max-w-[54ch] text-[16.5px] leading-[1.7] text-pretty text-ink-muted">
          {service.description}
        </p>
      </div>
      <div className="mt-8" data-reveal>
        <h3 className="text-[11px] font-semibold tracking-[0.12em] text-ink-muted uppercase">
          What you get
        </h3>
        <ul className="mt-3.5 flex flex-wrap gap-2">
          {service.deliverables.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full bg-white/62 py-[7px] pr-3.5 pl-[7px] text-[14px] leading-[1.35] font-[520] tracking-[-0.01em] text-ink shadow-pill"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand/9 text-brand-text">
                <TickIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="mt-8 flex flex-col items-start gap-6 pt-6 shadow-rule"
        data-reveal
      >
        <p className="max-w-[52ch] text-[14.5px] leading-[1.55] text-pretty text-ink-muted">
          <span className="mr-2 font-semibold text-ink">Good for</span>
          {service.goodFor}
        </p>
        <FlightLink
          href={workRouteFor(service.slug)}
          className={buttonClass("quiet", "card")}
        >
          {service.workLinkLabel}
          <ButtonIcon />
        </FlightLink>
      </div>
    </article>
  );
};
