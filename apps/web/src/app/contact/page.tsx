import type { Metadata } from "next";

import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import { SiteFooter } from "@/app/_components/site-footer";
import {
  BEZEL,
  BEZEL_CORE,
  BRAND_DOT,
  EYEBROW,
  FOCUS_RING,
  SWISS_CROSS,
} from "@/app/_components/styles";
import { ContactArrow } from "@/app/contact/_components/contact-arrow";
import { ProjectEnquiry } from "@/app/contact/_components/project-enquiry";
import { CONTACT } from "@/app/contact/_lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "A new website, an online shop, or something entirely your own. Tell Helvetic Studio what you have in mind and let’s start a conversation.",
  alternates: { canonical: "/contact" },
  // Keep the page out of search until the studio's contact details are confirmed.
  robots: { index: Boolean(CONTACT.email), follow: true },
};

const TITLE: readonly (readonly TitleWord[])[] = [
  [{ text: "Small" }, { text: "hello." }],
  // Three lines, not two: "possibilities." wants a line of its own beside the form.
  [{ text: "Big", accent: true }],
  [{ text: "possibilities.", accent: true }],
];

// Each step restates a promise the site already makes (Services: the Discover step and the close).
const NEXT_STEPS = [
  {
    title: "You tell us what you have in mind.",
    text: "Through the form, or directly. The rough version is more than enough.",
  },
  {
    title: "We talk it through.",
    text: "A call about your goals, your audience and your content.",
  },
  {
    title: "You get a clear way forward.",
    text: "The right approach and a price range, before you commit to anything.",
  },
] as const;

const directLinks = [
  {
    label: "Email",
    value: CONTACT.email,
    href: CONTACT.email === null ? null : `mailto:${CONTACT.email}`,
    note: "A good place to start",
  },
  {
    label: "Phone",
    value: CONTACT.phone,
    href:
      CONTACT.phone === null
        ? null
        : `tel:${CONTACT.phone.replaceAll(/[^+\d]/gu, "")}`,
    note: "Let’s talk it through",
  },
  {
    label: "Instagram",
    value: CONTACT.instagram === null ? null : `@${CONTACT.instagram}`,
    href:
      CONTACT.instagram === null
        ? null
        : `https://www.instagram.com/${CONTACT.instagram}/`,
    note: "A simple hello works, too",
  },
];

const numeral = (position: number) => String(position).padStart(2, "0");

/** A first-visit entrance; interaction never waits for the stagger to finish. */
const ENTER = "motion-reduce:animate-[fadeIn_200ms_ease_both]";

const SMALL_TITLE =
  "text-[12px] font-semibold tracking-[0.12em] text-ink-muted uppercase";

/**
 * What happens next: three waypoints on a hairline. Each step draws the line down to the next node
 * (its centre sits the list gap plus half a node below this step), so the line ends at the last
 * waypoint instead of running on past its text.
 */
const STEP =
  "relative grid grid-cols-[36px_minmax(0,1fr)] items-start gap-[18px] not-last:before:absolute not-last:before:top-[18px] not-last:before:-bottom-10 not-last:before:left-[17.5px] not-last:before:w-px not-last:before:bg-[linear-gradient(180deg,oklch(0.5684_0.2129_25.98/0.5),oklch(0.5684_0.2129_25.98/0.2))] not-last:before:content-['']";

const CONTACT_LINK =
  "grid min-h-[58px] grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] max-md:grid-cols-[72px_minmax(0,1fr)_auto]";
const LINK_LABEL = "text-[13px] text-ink-muted";
const LINK_DETAIL = "text-[15px] font-medium tracking-[-0.015em] wrap-anywhere";

const NextSteps = () => (
  <section
    className={`mt-14 animate-[riseIn_800ms_var(--ease-out)_500ms_both] ${ENTER} max-md:order-2 max-md:mt-4`}
    aria-labelledby="next-title"
  >
    <h2 id="next-title" className={SMALL_TITLE}>
      What happens next
    </h2>
    <ol className="relative mt-[22px] grid gap-[22px]">
      {NEXT_STEPS.map((step, index) => (
        <li key={step.title} className={STEP}>
          <span
            className="relative z-1 grid size-9 place-items-center rounded-full bg-core text-[11px] font-semibold text-brand-text tabular-nums shadow-[0_0_0_5px_oklch(1_0_0/0.5),inset_0_0_0_1px_oklch(0.5684_0.2129_25.98/0.22)]"
            aria-hidden="true"
          >
            {numeral(index + 1)}
          </span>
          <div>
            <h3 className="pt-[7px] text-[17px] font-semibold tracking-[-0.025em]">
              {step.title}
            </h3>
            <p className="mt-1 max-w-[38ch] text-[14.5px] leading-[1.55] text-ink-muted">
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const DirectContact = () => (
  <section
    className={`${BEZEL} mt-12 animate-[riseIn_800ms_var(--ease-out)_580ms_both] ${ENTER} max-md:order-3 max-md:mt-0`}
    aria-labelledby="direct-title"
  >
    <div
      className={`${BEZEL_CORE} px-[26px] pt-[26px] pb-[22px] max-md:px-5 max-md:pt-[22px] max-md:pb-[18px]`}
    >
      <h2 id="direct-title" className={SMALL_TITLE}>
        More of a conversation person?
      </h2>
      <p className="mt-1.5 text-[15px] text-ink-soft">
        Skip the form. Reach us directly.
      </p>
      <ul className="mt-4">
        {directLinks.map(({ label, value, href, note }) => (
          <li className="not-first:shadow-rule" key={label}>
            {href === null ? (
              <div className={CONTACT_LINK}>
                <span className={LINK_LABEL}>{label}</span>
                <span className={LINK_DETAIL}>{note}</span>
                <span className="rounded-full bg-ink/5 px-[9px] py-1 text-[11px] font-medium text-ink-muted">
                  Soon
                </span>
              </div>
            ) : (
              <a
                className={`group/link ${CONTACT_LINK} ${FOCUS_RING}`}
                href={href}
              >
                <span className={LINK_LABEL}>{label}</span>
                <span className={LINK_DETAIL}>{value}</span>
                <span className="grid size-[34px] place-items-center rounded-full bg-brand/8 text-brand-text transition-transform duration-[220ms] ease-out motion-safe:pointer-fine:group-hover/link:translate-x-0.5 motion-safe:pointer-fine:group-hover/link:-translate-y-0.5 motion-reduce:transition-none">
                  <ContactArrow />
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-[18px] flex items-center gap-2.5 pt-[18px] text-[13px] text-ink-muted shadow-rule">
        <span className={SWISS_CROSS} aria-hidden="true" />
        Based in Switzerland. Built around you.
      </p>
    </div>
  </section>
);

const ContactPage = () => (
  <>
    <div className="mx-auto box-border w-full max-w-[1200px] px-6 pt-16 pb-32 max-md:px-4 max-md:pt-8 max-md:pb-[88px]">
      {/* Intro on the left, reading down; the form on the right, staying in view while it is read.
          One column on a phone: the words, then the form, then the ways around it. */}
      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(40px,6vw,88px)] max-md:flex max-md:flex-col max-md:gap-10 md:max-[1051px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:max-[1051px]:gap-9">
        <div className="pt-4 max-md:contents">
          <p
            className={`${EYEBROW} animate-[riseIn_800ms_var(--ease-out)_40ms_both] ${ENTER} max-md:-mb-4 max-md:self-start`}
          >
            <span className={BRAND_DOT} aria-hidden="true" />A good place to
            begin
          </p>
          <MaskedTitle
            lines={TITLE}
            className="m-0 text-[clamp(52px,6vw,84px)] leading-[0.98] font-semibold tracking-[-0.06em] [--words-delay:120ms] max-md:text-[clamp(48px,14vw,72px)]"
          />
          <p
            className={`mt-[26px] max-w-[34ch] text-[clamp(17px,1.4vw,19px)] leading-[1.65] tracking-[-0.01em] text-pretty text-ink-muted animate-[riseIn_800ms_var(--ease-out)_420ms_both] ${ENTER} max-md:-mt-4`}
          >
            Every good project starts with a conversation. Tell us what you have
            in mind. We’ll figure out the next step together.
          </p>
          <NextSteps />
          <DirectContact />
        </div>
        <div
          className={`sticky top-[104px] animate-[riseIn_1000ms_var(--ease-out)_260ms_both] ${ENTER} max-md:static max-md:order-1`}
        >
          <div className={BEZEL}>
            <ProjectEnquiry email={CONTACT.email} />
          </div>
        </div>
      </div>
    </div>
    <SiteFooter invite={false} />
  </>
);

export default ContactPage;
