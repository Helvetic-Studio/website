import type { Metadata } from "next";
import localFont from "next/font/local";

import { AboutStory } from "@/app/about/_components/about-story";

import "./about.css";

const geist = localFont({
  src: "./_assets/geist-variable.ttf",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Rejhan Kjerimi and Levin Baenninger, the founders of Helvetic Studio. An independent web design and engineering studio based in Wil SG, Switzerland.",
  alternates: { canonical: "/about" },
};

const AboutPage = () => (
  <div className={`about-page ${geist.className}`}>
    <AboutStory />
  </div>
);

export default AboutPage;
