import { cn } from "@website/ui/lib/utils";
import type { ReactNode } from "react";

import { ButtonIcon } from "@/app/_components/button-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";
import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import { Reveal } from "@/app/_components/reveal";
import {
  BEZEL,
  BEZEL_CORE,
  BRAND_DOT,
  buttonClass,
  EYEBROW,
  SECTION_TITLE,
} from "@/app/_components/styles";
import { ABOUT_BODY, ABOUT_MICRO } from "@/app/about/_components/about-type";
import { InkWords } from "@/app/about/_components/ink-words";
import { StudioMap } from "@/app/about/_components/studio-map";

const TITLE: readonly (readonly TitleWord[])[] = [
  [{ text: "Small" }, { text: "studio." }],
  [{ text: "Big" }, { text: "on" }, { text: "craft.", accent: true }],
];

const founders = [
  {
    name: "Rejhan Kjerimi",
    initials: "RK",
    role: "Founder & CEO",
    focus: "Vision, direction & detail",
    description:
      "Turning your ambition into a clear direction. Rejhan connects your business goals with a digital presence that feels right for your brand and the people you want to reach.",
    tone: "red",
  },
  {
    name: "Levin Baenninger",
    initials: "LB",
    role: "Cofounder & CTO",
    focus: "Logic, systems & craft",
    description:
      "Making every good idea work beautifully. Levin brings the technical thinking behind the experience, with a focus on performance, reliability and a foundation you can grow on.",
    tone: "charcoal",
  },
] as const;

/** Hairline marks, drawn for this page: a direct line, a spark of care, a range with a way up. */
const PrincipleIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/**
 * An asymmetric bento: two cards, then one across whose words sit beside its icon. One column on
 * narrow screens.
 */
const PRINCIPLE_LAYOUT = {
  wide: { item: "col-span-7 max-[901px]:col-span-full", core: "", top: "" },
  narrow: { item: "col-span-5 max-[901px]:col-span-full", core: "", top: "" },
  across: {
    item: "col-span-full",
    core: "flex-row items-end justify-between max-[901px]:flex-col max-[901px]:items-stretch",
    top: "flex-col gap-12 max-[901px]:flex-row",
  },
} as const;

const principles = [
  {
    number: "01",
    layout: PRINCIPLE_LAYOUT.wide,
    title: "A direct line to the people building it.",
    text: "You work with us, from the first conversation to the final details. Your ideas reach the people who can act on them.",
    icon: (
      <PrincipleIcon>
        <circle cx="5" cy="12" r="2.5" />
        <circle cx="19" cy="12" r="2.5" />
        <path d="M7.5 12h9" />
      </PrincipleIcon>
    ),
  },
  {
    number: "02",
    layout: PRINCIPLE_LAYOUT.narrow,
    title: "Care you can see. Quality you can feel.",
    text: "The right words. A considered interaction. A page that loads quickly. We care about the small things because your customers notice them.",
    icon: (
      <PrincipleIcon>
        <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4 18 18M18 6l-2.6 2.6M8.6 15.4 6 18" />
      </PrincipleIcon>
    ),
  },
  {
    number: "03",
    layout: PRINCIPLE_LAYOUT.across,
    title: "Built with your next chapter in mind.",
    text: "A website should earn its place in your business. We bring design and engineering together to make it useful today and ready to evolve tomorrow.",
    icon: (
      <PrincipleIcon>
        <path d="m3 19 6-8 4 5 3-3 5 6" />
        <path d="M15 4.5h5v5M20 4.5l-5.5 5.5" />
      </PrincipleIcon>
    ),
  },
] as const;

const DownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 3v10M4 9l4 4 4-4" />
  </svg>
);

/** A section's heading beside a short aside; stacked on narrow screens. */
const SPLIT_HEAD =
  "mb-12 flex items-end justify-between gap-x-12 gap-y-6 max-[901px]:flex-col max-[901px]:items-start";
const SPLIT_ASIDE =
  "max-w-[32ch] text-[15.5px] leading-[1.65] text-pretty text-ink-muted";

/** A summit outline in each portrait, the studio's one recurring shape. */
const PORTRAIT =
  "relative flex min-h-[300px] flex-col overflow-hidden px-[30px] pt-[26px] pb-[22px] text-[oklch(0.98_0.01_40)] after:pointer-events-none after:absolute after:right-[-8%] after:bottom-0 after:h-[58%] after:w-[70%] after:bg-white/8 after:[clip-path:polygon(0_100%,34%_30%,50%_58%,72%_0,100%_100%)] after:content-[''] max-md:min-h-[260px]";

const PORTRAIT_TONES = {
  red: "[background:radial-gradient(80%_90%_at_100%_0%,oklch(0.62_0.2_30)_0%,oklch(0.62_0.2_30/0)_60%),var(--color-brand)]",
  charcoal:
    "[background:radial-gradient(80%_90%_at_100%_0%,var(--color-night-glow)_0%,oklch(0.36_0.02_30/0)_60%),var(--color-night)]",
} as const;

/** A first-visit entrance; with reduced motion, a short fade. */
const ENTER = "motion-reduce:animate-[fadeIn_200ms_ease_both]";

const AboutHero = () => (
  <header className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-[clamp(40px,6vw,88px)] pt-6 pb-[120px] max-[901px]:grid-cols-1 max-[901px]:pb-[88px]">
    <div>
      <p
        className={`${EYEBROW} animate-[riseIn_800ms_var(--ease-out)_40ms_both] ${ENTER}`}
      >
        <span className={BRAND_DOT} aria-hidden="true" />
        About Helvetic Studio
      </p>
      <MaskedTitle
        lines={TITLE}
        className="m-0 text-[clamp(56px,7vw,96px)] leading-[0.98] font-semibold tracking-[-0.06em] [--words-delay:120ms] max-md:text-[clamp(52px,15vw,76px)]"
      />
      <p
        className={`mt-7 max-w-[34ch] text-[clamp(17px,1.45vw,20px)] leading-[1.6] tracking-[-0.01em] text-pretty text-ink-muted animate-[riseIn_800ms_var(--ease-out)_420ms_both] ${ENTER}`}
      >
        We’re two young entrepreneurs turning a shared passion for design and
        technology into websites that move businesses forward.
      </p>
      <div
        className={`mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 animate-[riseIn_800ms_var(--ease-out)_500ms_both] ${ENTER}`}
      >
        <a href="#the-story" className={buttonClass("ghost")}>
          Get to know us
          <ButtonIcon nudge="down">
            <DownIcon />
          </ButtonIcon>
        </a>
        <p className="text-[12.5px] leading-[1.6] text-ink-muted">
          Independent studio.
          <br />
          Based in Wil SG, Switzerland.
        </p>
      </div>
    </div>
    <div
      className={`animate-[riseIn_1000ms_var(--ease-out)_300ms_both] ${ENTER}`}
    >
      <StudioMap />
    </div>
  </header>
);

/** The why, as one statement that inks in as it is read, then the rest in plain text. */
const AboutStatement = () => (
  <section
    id="the-story"
    className="scroll-mt-[104px] pt-[120px] pb-32 shadow-rule max-md:py-[88px]"
    aria-labelledby="about-story-title"
  >
    <div
      className="mb-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3"
      data-reveal
    >
      <p className={cn(EYEBROW, "mb-0")}>
        <span className={BRAND_DOT} aria-hidden="true" />
        Why we started
      </p>
      <h2
        id="about-story-title"
        className="text-[15px] font-[560] tracking-[-0.01em] text-ink-muted"
      >
        For us, this is personal.
      </h2>
    </div>
    <p className="max-w-[22ch] text-[clamp(38px,6vw,84px)] leading-[1.02] font-[580] tracking-[-0.055em] text-balance text-ink">
      <InkWords text="Helvetic Studio grew out of a simple shared instinct:" />
      <strong className="[font-weight:inherit] text-brand-text">
        <InkWords text="we love making things that work as well as they look." />
      </strong>
    </p>
    <div
      className="mt-14 ml-auto grid max-w-[880px] grid-cols-2 gap-x-12 gap-y-6 *:text-[17px] *:leading-[1.7] *:text-pretty *:text-ink-soft max-[901px]:ml-0 max-[901px]:grid-cols-1"
      data-reveal
    >
      <p>Design draws us in. Solving the challenge behind it keeps us going.</p>
      <p>
        From our base in Wil, St. Gallen, we bring that energy to companies
        ready for their next step. We take the time to understand your business,
        ask the right questions and build something that feels unmistakably
        yours.
      </p>
    </div>
  </section>
);

const FounderProfiles = () => (
  <section className="pt-6" aria-labelledby="about-team-title">
    <div className={SPLIT_HEAD} data-reveal>
      <div>
        <p className={EYEBROW}>
          <span className={BRAND_DOT} aria-hidden="true" />
          The people behind the studio
        </p>
        <h2 id="about-team-title" className={SECTION_TITLE}>
          Two founders.
          <br />
          One shared standard.
        </h2>
      </div>
      <p className={SPLIT_ASIDE}>
        Different strengths, the same drive: to make something we’re proud to
        put our names on.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-6 max-[901px]:grid-cols-1">
      {founders.map((founder, index) => (
        <article
          className={BEZEL}
          key={founder.name}
          data-reveal
          data-reveal-delay={index * 90}
        >
          <div className={`${BEZEL_CORE} h-full overflow-hidden`}>
            <div
              className={`${PORTRAIT} ${PORTRAIT_TONES[founder.tone]}`}
              aria-hidden="true"
            >
              <span className={ABOUT_MICRO}>{founder.focus}</span>
              <span className="relative mt-4 text-[clamp(108px,13vw,168px)] leading-none font-[560] tracking-[-0.085em]">
                {founder.initials}
              </span>
              <span className="relative mt-auto flex justify-between pt-[18px] text-[11px] tracking-[0.02em] text-white/62">
                <span>Helvetic Studio</span>
                <span>Wil, CH</span>
              </span>
            </div>
            <div className="px-[30px] pt-[30px] pb-[34px] max-md:px-[22px] max-md:pt-6 max-md:pb-7">
              <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] text-brand-text uppercase">
                {founder.role}
              </p>
              <h3 className="text-[clamp(26px,3vw,34px)] leading-[1.1] font-semibold tracking-[-0.05em]">
                {founder.name}
              </h3>
              <p className={`${ABOUT_BODY} mt-3.5 max-w-[42ch]`}>
                {founder.description}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const Principles = () => (
  <section
    className="pt-[136px] max-md:pt-24"
    aria-labelledby="about-principles-title"
  >
    <div className={SPLIT_HEAD} data-reveal>
      <div>
        <p className={EYEBROW}>
          <span className={BRAND_DOT} aria-hidden="true" />
          What that means for you
        </p>
        <h2 id="about-principles-title" className={SECTION_TITLE}>
          Your business.
          <br />
          Our full attention.
        </h2>
      </div>
      <p className={SPLIT_ASIDE}>
        A small team makes room for a closer partnership. Here’s how that shows
        up in the work.
      </p>
    </div>
    <ol className="grid grid-cols-12 gap-5">
      {principles.map((principle, index) => (
        <li
          key={principle.number}
          className={`${BEZEL} ${principle.layout.item}`}
          data-reveal
          data-reveal-delay={index * 90}
        >
          <div
            className={`${BEZEL_CORE} box-border flex h-full flex-col gap-12 px-8 pt-[30px] pb-[34px] max-md:px-[22px] max-md:pt-6 max-md:pb-7 ${principle.layout.core}`}
          >
            <div
              className={`flex items-start justify-between gap-4 ${principle.layout.top}`}
            >
              <span className="grid size-14 place-items-center rounded-[18px] bg-brand/8 text-brand-text">
                {principle.icon}
              </span>
              <span
                className="text-[13px] font-semibold text-ink-muted tabular-nums"
                aria-hidden="true"
              >
                {principle.number}
              </span>
            </div>
            <div className="max-w-[46ch]">
              <h3 className="mb-2.5 text-[clamp(22px,2.2vw,28px)] leading-[1.15] font-semibold tracking-[-0.045em] text-balance">
                {principle.title}
              </h3>
              <p className={ABOUT_BODY}>{principle.text}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export const AboutStory = () => (
  <Reveal>
    <AboutHero />
    <AboutStatement />
    <FounderProfiles />
    <Principles />
    <ClosingPanel
      tone="ink"
      id="about-cta-title"
      eyebrow="Good things start with a conversation"
      title="Let’s build something you believe in."
      text="Tell us what you have in mind. We’ll bring the curiosity, the craft and a clear way forward."
      className="max-md:mt-24"
    >
      <FlightLink href="/contact" className={buttonClass("light")}>
        Meet your studio
        <ButtonIcon />
      </FlightLink>
      <FlightLink href="/work" className={buttonClass("onRed")}>
        See our work
      </FlightLink>
    </ClosingPanel>
  </Reveal>
);
