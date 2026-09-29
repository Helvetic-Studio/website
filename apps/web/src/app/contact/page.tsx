import type { Metadata } from "next";

import type { TitleWord } from "@/app/_components/masked-title";
import { MaskedTitle } from "@/app/_components/masked-title";
import { SiteFooter } from "@/app/_components/site-footer";
import { ContactArrow } from "@/app/contact/_components/contact-arrow";
import { ProjectEnquiry } from "@/app/contact/_components/project-enquiry";
import { CONTACT } from "@/app/contact/_lib/contact";

import "./contact.css";

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

const NextSteps = () => (
  <section className="contact-next contact-enter" aria-labelledby="next-title">
    <h2 id="next-title" className="contact-small-title">
      What happens next
    </h2>
    <ol className="contact-next-list">
      {NEXT_STEPS.map((step, index) => (
        <li key={step.title} className="contact-next-step">
          <span className="contact-next-node" aria-hidden="true">
            {numeral(index + 1)}
          </span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const DirectContact = () => (
  <section
    className="contact-direct bezel contact-enter"
    aria-labelledby="direct-title"
  >
    <div className="contact-direct-core bezel-core">
      <h2 id="direct-title" className="contact-small-title">
        More of a conversation person?
      </h2>
      <p className="contact-direct-text">Skip the form. Reach us directly.</p>
      <ul className="contact-links">
        {directLinks.map(({ label, value, href, note }) => (
          <li className="contact-link-item" key={label}>
            {href === null ? (
              <div className="contact-link">
                <span className="contact-link-label">{label}</span>
                <span className="contact-link-detail">{note}</span>
                <span className="contact-coming-soon">Soon</span>
              </div>
            ) : (
              <a className="contact-link" href={href}>
                <span className="contact-link-label">{label}</span>
                <span className="contact-link-detail">{value}</span>
                <span className="contact-link-arrow">
                  <ContactArrow />
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="contact-location">
        <span className="swiss-cross" aria-hidden="true" />
        Based in Switzerland. Built around you.
      </p>
    </div>
  </section>
);

const ContactPage = () => (
  <>
    <div className="contact-page">
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="eyebrow contact-enter">
            <span className="brand-dot" aria-hidden="true" />A good place to
            begin
          </p>
          <MaskedTitle lines={TITLE} className="contact-title" />
          <p className="contact-lede contact-enter">
            Every good project starts with a conversation. Tell us what you have
            in mind. We’ll figure out the next step together.
          </p>
          <NextSteps />
          <DirectContact />
        </div>
        <div className="contact-form-column">
          <div className="contact-form-shell bezel">
            <ProjectEnquiry email={CONTACT.email} />
          </div>
        </div>
      </div>
    </div>
    <SiteFooter invite={false} />
  </>
);

export default ContactPage;
