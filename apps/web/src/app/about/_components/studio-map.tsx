import { cn } from "@website/ui/lib/utils";
import Image from "next/image";

import {
  BEZEL,
  BEZEL_CORE,
  FOCUS_RING,
  LIVE_DOT,
  SWISS_CROSS,
} from "@/app/_components/styles";
import { ABOUT_MICRO } from "@/app/about/_components/about-type";

export const StudioMap = () => (
  <figure className={`${BEZEL} max-[901px]:max-w-[560px]`}>
    <div className={`${BEZEL_CORE} overflow-hidden`}>
      <div className="flex items-center justify-between px-7 pt-[26px] pb-2 text-warm-muted">
        <span className={ABOUT_MICRO}>Our corner of Switzerland</span>
        <span className={SWISS_CROSS} aria-hidden="true" />
      </div>
      <div className="relative mx-4 mt-[30px] bg-[radial-gradient(oklch(0.7_0.04_40/0.22)_0.7px,transparent_0.7px)] [background-size:18px_18px] [&>img]:block [&>img]:h-auto [&>img]:w-full">
        <Image
          src="/about/switzerland.svg"
          alt="Map of Switzerland. Our studio is based in Wil, in the northeastern canton of St. Gallen."
          width={480}
          height={300}
          preload
        />
        {/* Wil's town centre, projected with the same transform as switzerland.svg. */}
        <div
          className="absolute top-[20.6816%] left-[65.6308%] size-0"
          aria-hidden="true"
        >
          <span className="absolute bottom-[31px] left-0 flex w-max -translate-x-1/2 items-center gap-2 rounded-[12px] bg-ink px-[13px] py-[9px] text-[12px] font-semibold text-white shadow-[0_10px_24px_-10px_oklch(0.25_0.04_30/0.5)]">
            Wil SG{" "}
            <span className="text-[11px] font-[450] text-[oklch(0.86_0.01_40)]">
              We’re here
            </span>
          </span>
          <span className="absolute bottom-0 h-[31px] w-px bg-brand" />
          <span
            className={cn(
              LIVE_DOT,
              "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_0_4px_oklch(1_0_0/0.7)]"
            )}
          />
        </div>
        <span
          className="absolute top-[55%] left-[34%] text-[11px] font-semibold tracking-[0.16em] text-[oklch(0.52_0.05_35)] uppercase"
          aria-hidden="true"
        >
          Switzerland
        </span>
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-7 pt-[18px] pb-[26px]">
        <div>
          <span className={`${ABOUT_MICRO} text-warm-muted`}>
            Local roots. Open horizons.
          </span>
          <p className="mt-[5px] text-[22px] font-[580] tracking-[-0.045em]">
            Wil SG, Switzerland
          </p>
        </div>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Wil+SG+Switzerland"
          target="_blank"
          rel="noopener noreferrer"
          className={`grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_6px_16px_-10px_oklch(0.35_0.08_30/0.5)] transition-transform duration-[220ms] ease-out motion-safe:pointer-fine:hover:translate-x-0.5 motion-safe:pointer-fine:hover:-translate-y-0.5 ${FOCUS_RING}`}
          aria-label="Explore Wil SG on Google Maps (opens in a new tab)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M6 18 18 6M6 6h12v12" />
          </svg>
        </a>
      </figcaption>
    </div>
  </figure>
);
