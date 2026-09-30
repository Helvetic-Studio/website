import type { Metadata } from "next";

import { SiteFooter } from "@/app/_components/site-footer";
import { AboutStory } from "@/app/about/_components/about-story";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Rejhan Kjerimi and Levin Baenninger, the founders of Helvetic Studio. An independent web design and engineering studio based in Wil SG, Switzerland.",
  alternates: { canonical: "/about" },
};

const AboutPage = () => (
  <>
    <div className="mx-auto box-border w-full max-w-[1160px] px-6 pt-16 pb-32 max-md:px-4 max-md:pt-8 max-md:pb-[88px]">
      <AboutStory />
    </div>
    <SiteFooter />
  </>
);

export default AboutPage;
