import type { Metadata } from "next";

// TODO: lift noindex once the real Services page ships
export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: true },
};

const ServicesPage = () => <h1 className="stub-title">Services</h1>;

export default ServicesPage;
