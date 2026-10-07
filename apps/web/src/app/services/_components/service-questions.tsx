import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import {
  BEZEL,
  BEZEL_CORE,
  BRAND_DOT,
  EYEBROW,
  FOCUS_RING,
  PAGE_LINK,
  SECTION_TITLE,
} from "@/app/_components/styles";

// TODO: first-draft copy — every answer restates a promise the site already makes (the process,
// the close, the catalogue, About); confirm them together with those.
const QUESTIONS = [
  {
    question: "What will it cost?",
    answer:
      "Every project is scoped to what you need, so there is no price list. After a first conversation you get a price range, and after the Discover workshop a fixed price — before anything is designed or built.",
  },
  {
    question: "Can we update the website ourselves?",
    answer:
      "Yes. Our websites come with a CMS you edit yourself: text, images and new pages, no developer needed. If you’d rather not, content changes are part of Care & growth.",
  },
  {
    question: "Who will we work with?",
    answer:
      "The two of us who founded the studio, from the first call to launch and after. No account managers, and no hand-offs between agencies.",
  },
  {
    question: "We already have a website. Can you help?",
    answer:
      "Yes. Relaunches are part of what we do: we keep what already works and fix what holds the site back, from the structure to the speed.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Your choice. We hand over cleanly to your team, or we stay on with Care & growth: updates, security, monitoring and a monthly check-in.",
  },
] as const;

/**
 * An answer opens by growing to its own height (`interpolate-size` lets `height: auto` animate)
 * and stays rendered while it closes (`allow-discrete`), so it folds away rather than vanishing.
 * Where `::details-content` is unknown it simply opens. One open at a time (`name`).
 */
const QUESTION =
  "group/question relative [interpolate-size:allow-keywords] not-first:before:absolute not-first:before:inset-x-5 not-first:before:top-0 not-first:before:h-px not-first:before:bg-hairline not-first:before:content-[''] details-content:h-0 details-content:overflow-clip details-content:[transition:height_260ms_var(--ease-out),content-visibility_260ms_allow-discrete] open:details-content:h-auto motion-reduce:details-content:transition-none max-md:not-first:before:inset-x-4";

const SUMMARY = `flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 rounded-[18px] px-5 py-4 text-[18px] leading-[1.3] font-[560] tracking-[-0.025em] text-ink [-webkit-tap-highlight-color:transparent] transition-colors duration-200 ease-[ease] pointer-fine:hover:bg-brand/4 [&::-webkit-details-marker]:hidden ${FOCUS_RING} max-md:px-4 max-md:text-[16.5px]`;

/** A plus that turns into a cross as its answer opens. */
const PlusIcon = () => (
  <span
    className="grid size-[34px] shrink-0 place-items-center rounded-full bg-brand/8 text-brand-text transition-[background-color,color] duration-200 ease-[ease] group-open/question:bg-brand group-open/question:text-white"
    aria-hidden="true"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="transition-[rotate] duration-[260ms] ease-out group-open/question:rotate-45 motion-reduce:transition-none"
    >
      <path d="M7 2v10M2 7h10" />
    </svg>
  </span>
);

/** What owners ask before they get in touch, answered in the site's own promises. */
export const ServiceQuestions = () => (
  <section
    className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-[clamp(40px,6vw,88px)] pt-[136px] max-lg:grid-cols-1 max-lg:gap-10 max-md:pt-24"
    aria-labelledby="questions-title"
  >
    <div className="lg:sticky lg:top-[120px]" data-reveal>
      <p className={EYEBROW}>
        <span className={BRAND_DOT} aria-hidden="true" />
        Good to know
      </p>
      <h2 id="questions-title" className={SECTION_TITLE}>
        Questions owners ask us first.
      </h2>
      <p className="mt-5 max-w-[34ch] text-[15.5px] leading-[1.65] text-pretty text-ink-muted">
        Something we haven’t answered? Ask us directly. A short message is
        enough.
      </p>
      <FlightLink href="/contact" className={`${PAGE_LINK} mt-3`}>
        Ask a question
        <ArrowIcon />
      </FlightLink>
    </div>
    <div className={BEZEL} data-reveal data-reveal-delay={90}>
      <div className={`${BEZEL_CORE} p-2 max-md:p-1.5`}>
        {QUESTIONS.map((item, index) => (
          <details
            key={item.question}
            name="service-questions"
            className={QUESTION}
            open={index === 0}
          >
            <summary className={SUMMARY}>
              {item.question}
              <PlusIcon />
            </summary>
            <p className="max-w-[60ch] px-5 pt-0.5 pb-6 text-[15.5px] leading-[1.7] text-pretty text-ink-muted max-md:px-4">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
