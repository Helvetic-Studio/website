import type { Metadata } from "next";
import localFont from "next/font/local";

import "../index.css";
import { ContentStage } from "@/app/_components/content-stage";
import { PeakPins } from "@/app/_components/peak-pins";
import { RidgeBackground } from "@/app/_components/ridge-background";
import { SiteNav } from "@/app/_components/site-nav";
import { ZoomStage } from "@/app/_components/zoom-stage";
import { Providers } from "@/app/providers";

// Geist, self-hosted: one variable face for the whole site, so display and text share one voice
// and every weight between them is available to the type scale.
const geist = localFont({
  src: "../_assets/geist-variable.ttf",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

// Hardcoded so preview deploys advertise the production URL, not a *.workers.dev host.
export const metadata: Metadata = {
  metadataBase: new URL("https://helvetic.studio"),
  title: { default: "Helvetic Studio", template: "%s — Helvetic Studio" },
  description:
    "Helvetic Studio builds fast, sharp-looking websites for Swiss businesses — sites that load quickly, read clearly, and turn visitors into enquiries.",
  openGraph: { siteName: "Helvetic Studio", locale: "en_GB", type: "website" },
  twitter: { card: "summary_large_image" },
};

// Landmark order: navbar, main (hero only), then the summit markers last so tab order matches
// visual order. The ridge and the navbar are siblings: the navbar must stay sharp at 3.2×.
const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={geist.variable}
    data-scroll-behavior="smooth"
    suppressHydrationWarning
  >
    <body className="antialiased">
      <Providers>
        <SiteNav />
        <ContentStage>{children}</ContentStage>
        <ZoomStage>
          <RidgeBackground />
          <PeakPins />
        </ZoomStage>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
