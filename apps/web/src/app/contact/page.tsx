import type { Metadata } from "next";

import { SiteFooter } from "@/app/_components/site-footer";
import { ContactArrow } from "@/app/contact/_components/contact-arrow";
import { ProjectEnquiry } from "@/app/contact/_components/project-enquiry";
import { CONTACT } from "@/app/contact/_lib/contact";

import "./contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "A new website, an online shop, or something entirely your own. Tell Helvetic Studio what you have in mind and let's start a conversation.",
  alternates: { canonical: "/contact" },
  // Keep the page out of search until the studio's contact details are confirmed.
  robots: { index: Boolean(CONTACT.email), follow: true },
};

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
    note: "Let's talk it through",
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

const ContactPage = () => (
  <>
    <div className="contact-page">
      <div className="contact-layout">
        <div className="contact-intro">
          <p className="contact-eyebrow">
            <span aria-hidden="true" className="contact-spark">
              ✳
            </span>
            A good place to begin
          </p>
          <h1>
            Small hello.
            <br />{" "}
            <span className="contact-title-accent">Big possibilities.</span>
          </h1>
          <p className="contact-lede">
            Every good project starts with a conversation. Tell us what you have
            in mind. We’ll figure out the next step together.
          </p>
        </div>
        <div className="contact-form-shell">
          <ProjectEnquiry email={CONTACT.email} />
        </div>
        <div className="contact-direct">
          <h2>More of a conversation person?</h2>
          <p>Skip the form. Reach us directly.</p>
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
            <span className="contact-cross" aria-hidden="true" />
            Based in Switzerland. Built around you.
          </p>
        </div>
      </div>
    </div>
    <SiteFooter invite={false} />
  </>
);

export default ContactPage;
