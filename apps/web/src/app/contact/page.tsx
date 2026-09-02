import type { Metadata } from "next";

// TODO: lift noindex once the real Contact page ships
export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false, follow: true },
};

// TODO: contact email for display (rejhan@helvetic.studio was discussed, not confirmed)
// TODO: phone number
// TODO: X, Instagram and LinkedIn handles
const ContactPage = () => <h1 className="stub-title">Contact</h1>;

export default ContactPage;
