import type { Metadata } from "next";

// TODO: lift noindex once the real About page ships
export const metadata: Metadata = {
  title: "About",
  robots: { index: false, follow: true },
};

const AboutPage = () => <h1 className="stub-title">About</h1>;

export default AboutPage;
