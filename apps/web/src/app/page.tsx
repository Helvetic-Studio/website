import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import Link from "next/link";

const Page = () => (
  <div className="hero">
    <p className="hero-badge">
      <span className="hero-badge-dot" aria-hidden="true" />
      {/* TODO: "Swiss web studio" or "Swiss software studio"; add the season once booking is confirmed */}
      Swiss web studio · Now taking on new projects
    </p>
    <h1 className="hero-title">Build a website. Get noticed. Grow.</h1>
    <p className="hero-lede">
      Sharp, fast websites that turn visitors into customers.
    </p>
    <div className="hero-actions">
      <Link href="/contact" className={cn(buttonVariants(), "hero-cta")}>
        Start a project
      </Link>
      <Link href="/work" className="hero-link">
        See our work
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  </div>
);

export default Page;
