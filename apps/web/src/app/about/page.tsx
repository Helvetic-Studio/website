import type { Metadata } from "next";

import { SiteFooter } from "@/app/_components/site-footer";
import { AboutStory } from "@/app/about/_components/about-story";

import "./about.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Rejhan Kjerimi and Levin Baenninger, the founders of Helvetic Studio. An independent web design and engineering studio based in Wil SG, Switzerland.",
  alternates: { canonical: "/about" },
};

const AboutPage = () => (
  <>
    <div className="about-page">
      <AboutStory />
    </div>
    <SiteFooter />
  </>
);

export default AboutPage;
