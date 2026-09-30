import { FADE_WHEN_REDUCED, FOCUS_RING } from "@/app/_components/styles";
import { SERVICES } from "@/app/_lib/services";

const numeral = (position: number) => String(position).padStart(2, "0");

/** Jump links to the panels below. Plain anchors: the page scrolls, nothing flies. */
export const ServiceIndex = () => (
  <nav
    className={`mt-8 flex flex-wrap gap-2 animate-[riseIn_800ms_var(--ease-out)_230ms_both] ${FADE_WHEN_REDUCED}`}
    aria-label="Jump to a service"
  >
    {SERVICES.map((service, index) => (
      <a
        key={service.slug}
        href={`#${service.slug}`}
        className={`inline-flex min-h-11 items-center gap-[9px] rounded-full bg-white/60 py-2 pr-4 pl-3 text-[14px] font-[540] tracking-[-0.01em] text-ink shadow-[inset_0_0_0_1px_oklch(1_0_0/0.95),0_8px_20px_-16px_oklch(0.35_0.08_30/0.45)] [-webkit-tap-highlight-color:transparent] [transition:background-color_200ms_ease,scale_160ms_var(--ease-out)] pointer-fine:hover:bg-white/95 motion-safe:active:scale-[0.97] ${FOCUS_RING} motion-reduce:duration-0`}
      >
        <span
          className="text-[11px] font-semibold text-brand-text tabular-nums"
          aria-hidden="true"
        >
          {numeral(index + 1)}
        </span>
        {service.title}
      </a>
    ))}
  </nav>
);
