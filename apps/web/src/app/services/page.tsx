import type { Metadata } from "next";

import { Reveal } from "@/app/_components/reveal";
import { SiteFooter } from "@/app/_components/site-footer";
import { SERVICES } from "@/app/_lib/services";
import { CtaPanel } from "@/app/services/_components/cta-panel";
import { ProcessSteps } from "@/app/services/_components/process-steps";
import { ServiceIndex } from "@/app/services/_components/service-index";
import { ServicePanel } from "@/app/services/_components/service-panel";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, online shops, web applications, design and ongoing care — one Swiss team from the first sketch to launch and beyond.",
};

// One panel per service, in the order they are sold; each links into its own slice of the Work page.
const ServicesPage = () => (
  <>
    <Reveal>
      <div className="page">
        <header className="page-head">
          <p className="eyebrow page-eyebrow">
            <span className="brand-dot" aria-hidden="true" />
            Services
          </p>
          <h1 className="page-title">
            Everything your company needs on the web.
          </h1>
          <p className="page-lede">
            Five services, one team, no hand-offs. Pick the one that fits your
            project, or start with the goal and we&rsquo;ll suggest the route.
          </p>
          <ServiceIndex />
        </header>
        <div className="service-list">
          {SERVICES.map((service, index) => (
            <ServicePanel
              key={service.slug}
              service={service}
              position={index + 1}
              reveal={index > 0}
            />
          ))}
        </div>
        <ProcessSteps />
        <CtaPanel />
      </div>
    </Reveal>
    <SiteFooter />
  </>
);

export default ServicesPage;
