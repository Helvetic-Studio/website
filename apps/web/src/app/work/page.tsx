import type { Metadata } from "next";

// TODO: lift noindex once the real Work page ships
export const metadata: Metadata = {
  title: "Work",
  robots: { index: false, follow: true },
};

const WorkPage = () => <h1 className="stub-title">Work</h1>;

export default WorkPage;
