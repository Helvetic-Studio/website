import type { ReactNode } from "react";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { ClosingPanel } from "@/app/_components/closing-panel";
import { FlightLink } from "@/app/_components/flight-link";
import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import { Reveal } from "@/app/_components/reveal";
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

const principles = [
  {
    number: "01",
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

const AboutHero = () => (
  <header className="about-hero">
    <div className="about-intro">
      <p className="eyebrow about-enter">
        <span className="brand-dot" aria-hidden="true" />
        About Helvetic Studio
      </p>
      <MaskedTitle lines={TITLE} className="about-title" />
      <p className="about-lede about-enter">
        We’re two young entrepreneurs turning a shared passion for design and
        technology into websites that move businesses forward.
      </p>
      <div className="about-intro-actions about-enter">
        <a href="#the-story" className="button button-ghost about-story-link">
          Get to know us
          <span className="button-icon">
            <DownIcon />
          </span>
        </a>
        <p className="about-intro-note">
          Independent studio.
          <br />
          Based in Wil SG, Switzerland.
        </p>
      </div>
    </div>
    <div className="about-map-enter">
      <StudioMap />
    </div>
  </header>
);

/** The why, as one statement that inks in as it is read, then the rest in plain text. */
const AboutStatement = () => (
  <section
    id="the-story"
    className="about-statement"
    aria-labelledby="about-story-title"
  >
    <div className="about-statement-head" data-reveal>
      <p className="eyebrow">
        <span className="brand-dot" aria-hidden="true" />
        Why we started
      </p>
      <h2 id="about-story-title" className="about-statement-title">
        For us, this is personal.
      </h2>
    </div>
    <p className="about-statement-text">
      <InkWords text="Helvetic Studio grew out of a simple shared instinct:" />
      <strong>
        <InkWords text="we love making things that work as well as they look." />
      </strong>
    </p>
    <div className="about-statement-body" data-reveal>
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
  <section className="about-team" aria-labelledby="about-team-title">
    <div className="about-section-head" data-reveal>
      <div>
        <p className="eyebrow">
          <span className="brand-dot" aria-hidden="true" />
          The people behind the studio
        </p>
        <h2 id="about-team-title" className="section-title">
          Two founders.
          <br />
          One shared standard.
        </h2>
      </div>
      <p className="about-section-aside">
        Different strengths, the same drive: to make something we’re proud to
        put our names on.
      </p>
    </div>
    <div className="about-founders">
      {founders.map((founder, index) => (
        <article
          className="about-founder bezel"
          key={founder.name}
          data-reveal
          data-reveal-delay={index * 90}
        >
          <div className="about-founder-core bezel-core">
            <div
              className={`about-founder-art about-founder-art-${founder.tone}`}
              aria-hidden="true"
            >
              <span className="about-micro">{founder.focus}</span>
              <span className="about-founder-initials">{founder.initials}</span>
              <span className="about-founder-art-caption">
                <span>Helvetic Studio</span>
                <span>Wil, CH</span>
              </span>
            </div>
            <div className="about-founder-bio">
              <p className="about-founder-role">{founder.role}</p>
              <h3>{founder.name}</h3>
              <p className="about-body">{founder.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const Principles = () => (
  <section
    className="about-principles"
    aria-labelledby="about-principles-title"
  >
    <div className="about-section-head" data-reveal>
      <div>
        <p className="eyebrow">
          <span className="brand-dot" aria-hidden="true" />
          What that means for you
        </p>
        <h2 id="about-principles-title" className="section-title">
          Your business.
          <br />
          Our full attention.
        </h2>
      </div>
      <p className="about-section-aside">
        A small team makes room for a closer partnership. Here’s how that shows
        up in the work.
      </p>
    </div>
    <ol className="about-principle-grid">
      {principles.map((principle, index) => (
        <li
          key={principle.number}
          className="about-principle bezel"
          data-reveal
          data-reveal-delay={index * 90}
        >
          <div className="about-principle-core bezel-core">
            <div className="about-principle-top">
              <span className="about-principle-icon">{principle.icon}</span>
              <span className="about-principle-number" aria-hidden="true">
                {principle.number}
              </span>
            </div>
            <div className="about-principle-words">
              <h3>{principle.title}</h3>
              <p className="about-body">{principle.text}</p>
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
    >
      <FlightLink href="/contact" className="button button-light">
        Meet your studio
        <span className="button-icon">
          <ArrowIcon />
        </span>
      </FlightLink>
      <FlightLink href="/work" className="button button-on-red">
        See our work
      </FlightLink>
    </ClosingPanel>
  </Reveal>
);
