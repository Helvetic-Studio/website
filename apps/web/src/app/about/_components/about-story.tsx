import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";
import { Reveal } from "@/app/_components/reveal";
import { StudioMap } from "@/app/about/_components/studio-map";

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

const principles = [
  {
    number: "01",
    title: "A direct line to the people building it.",
    text: "You work with us, from the first conversation to the final details. Your ideas reach the people who can act on them.",
  },
  {
    number: "02",
    title: "Care you can see. Quality you can feel.",
    text: "The right words. A considered interaction. A page that loads quickly. We care about the small things because your customers notice them.",
  },
  {
    number: "03",
    title: "Built with your next chapter in mind.",
    text: "A website should earn its place in your business. We bring design and engineering together to make it useful today and ready to evolve tomorrow.",
  },
] as const;

const FounderProfiles = () => (
  <section className="about-team" aria-labelledby="about-team-title">
    <div className="about-section-heading" data-reveal>
      <div>
        <p className="eyebrow about-eyebrow">The people behind the studio</p>
        <h2 id="about-team-title">
          Two founders.
          <br />
          One shared standard.
        </h2>
      </div>
      <p>
        Different strengths, the same drive:
        <br />
        to make something we’re proud to put our names on.
      </p>
    </div>
    <div className="about-founders">
      {founders.map((founder) => (
        <article
          className="about-founder-shell"
          key={founder.name}
          data-reveal
          data-reveal-delay={founder.tone === "charcoal" ? 60 : 0}
        >
          <div className={`about-founder-core about-founder-${founder.tone}`}>
            <div
              className={`about-founder-art about-founder-art-${founder.tone}`}
              aria-hidden="true"
            >
              <span className="about-micro">{founder.focus}</span>
              <span className="about-founder-initials">{founder.initials}</span>
              <span className="about-founder-mark">+</span>
              <span className="about-founder-art-caption">
                Helvetic Studio <span>Wil, CH</span>
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

export const AboutStory = () => (
  <Reveal>
    <header className="about-hero">
      <div className="about-intro">
        <p className="eyebrow about-eyebrow about-hero-enter">
          <span className="brand-dot" aria-hidden="true" /> About Helvetic
          Studio
        </p>
        <h1 className="about-hero-enter">
          Small studio.
          <br />
          Big on <span className="about-title-accent">craft.</span>
        </h1>
        <p className="about-intro-copy about-hero-enter">
          We’re two young entrepreneurs turning a shared passion for design and
          technology into websites that move businesses forward.
        </p>
        <div className="about-intro-footer about-hero-enter">
          <a href="#the-story" className="about-story-link">
            Get to know us <span aria-hidden="true">↓</span>
          </a>
          <span className="about-intro-note">
            Independent studio.
            <br />
            Based in Wil SG, Switzerland.
          </span>
        </div>
      </div>
      <div className="about-map-enter">
        <StudioMap />
      </div>
    </header>

    <section
      id="the-story"
      className="about-story"
      aria-labelledby="about-story-title"
      data-reveal
    >
      <p className="eyebrow about-eyebrow">Why we started</p>
      <div>
        <h2 id="about-story-title">For us, this is personal.</h2>
        <p className="about-story-copy">
          Helvetic Studio grew out of a simple shared instinct:{" "}
          <strong>we love making things that work as well as they look.</strong>{" "}
          Design draws us in. Solving the challenge behind it keeps us going.
        </p>
        <p className="about-story-copy">
          From our base in Wil, St. Gallen, we bring that energy to companies
          ready for their next step. We take the time to understand your
          business, ask the right questions and build something that feels
          unmistakably yours.
        </p>
      </div>
    </section>

    <FounderProfiles />

    <section
      className="about-principles"
      aria-labelledby="about-principles-title"
    >
      <div data-reveal>
        <p className="eyebrow about-eyebrow">What that means for you</p>
        <h2 id="about-principles-title">
          Your business.
          <br />
          Our full attention.
        </h2>
        <p className="about-body about-principles-copy">
          A small team makes room for a closer partnership. Here’s how that
          shows up in the work.
        </p>
      </div>
      <ol className="about-principle-list">
        {principles.map((principle) => (
          <li key={principle.number} data-reveal>
            <span className="about-principle-number" aria-hidden="true">
              {principle.number}
            </span>
            <div>
              <h3>{principle.title}</h3>
              <p className="about-body">{principle.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section
      className="about-cta-shell"
      aria-labelledby="about-cta-title"
      data-reveal
    >
      <div className="about-cta-core">
        <div>
          <p className="eyebrow about-eyebrow">
            Good things start with a conversation
          </p>
          <h2 id="about-cta-title">
            Let’s build something
            <br />
            you believe in.
          </h2>
          <p>
            Tell us what you have in mind. We’ll bring the curiosity, the craft
            and a clear way forward.
          </p>
        </div>
        <FlightLink href="/contact" className="about-cta-button">
          Meet your studio{" "}
          <span>
            <ArrowIcon />
          </span>
        </FlightLink>
      </div>
    </section>
  </Reveal>
);
