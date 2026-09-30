import type { Metadata } from "next";

import { Reveal } from "@/app/_components/reveal";
import { SiteFooter } from "@/app/_components/site-footer";
import {
  BRAND_DOT,
  PAGE,
  PAGE_EYEBROW,
  PAGE_HEAD,
  PAGE_LEDE,
  PAGE_TITLE,
} from "@/app/_components/styles";
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
      <div className={PAGE}>
        <header className={PAGE_HEAD}>
          <p className={PAGE_EYEBROW}>
            <span className={BRAND_DOT} aria-hidden="true" />
            Services
          </p>
          <h1 className={PAGE_TITLE}>
            Everything your company needs on the web.
          </h1>
          <p className={PAGE_LEDE}>
            Five services, one team, no hand-offs. Pick the one that fits your
            project, or start with the goal and we&rsquo;ll suggest the route.
          </p>
          <ServiceIndex />
        </header>
        <div className="flex flex-col gap-5">
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
