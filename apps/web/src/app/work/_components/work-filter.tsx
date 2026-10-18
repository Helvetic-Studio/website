"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { FOCUS_RING } from "@/app/_components/styles";
import { PROJECTS, projectsFor } from "@/app/_lib/projects";
import { SERVICES, workRouteFor } from "@/app/_lib/services";
import type { WorkPath } from "@/app/work/_lib/shuffle";
import {
  departingShuffle,
  startShuffle,
  usePushWhenGathered,
  useSettleShuffleOnLanding,
  useShuffle,
} from "@/app/work/_lib/shuffle";

interface Chip {
  href: WorkPath;
  label: string;
  /** How many projects the filter shows, so a visitor knows before the click. */
  count: number;
}

const CHIPS: readonly Chip[] = [
  { href: "/work", label: "All work", count: PROJECTS.length },
  ...SERVICES.map((service) => ({
    href: workRouteFor(service.slug),
    label: service.title,
    count: projectsFor(service.slug).length,
  })),
];

/**
 * One chip per service plus the whole. Every filter is a page of the Work summit, so the camera
 * stays; a chip click is a shuffle instead (see CardDeck): the cards on the table are gathered into
 * the current chip, then the route is pushed, then the new cards are dealt from the clicked chip.
 * The clicked chip reads as current from the click, not from the push. `prefetch` resolves each
 * filter's page ahead of the click; `scroll={false}` because the chips sit at the top and a jump
 * would read as a reload.
 */
export const WorkFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const shuffle = useShuffle();
  const departing = departingShuffle(shuffle, pathname);
  const current = departing?.target ?? pathname;
  usePushWhenGathered(departing, router, false);
  useSettleShuffleOnLanding(shuffle, pathname);

  return (
    // A segmented tray: the chips sit in one recessed track, the current one raised out of it. The
    // track is opaque — the deck deals its cards from under it, and they must not show through.
    <nav
      data-slot="work-filter"
      className="mt-8 inline-flex flex-wrap gap-0.5 rounded-[28px] bg-[oklch(0.962_0.014_28)] p-[5px] shadow-[inset_0_1px_2px_oklch(0.35_0.08_30/0.08),0_1px_0_oklch(1_0_0/0.9)]"
      aria-label="Filter by service"
    >
      {CHIPS.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          className={`inline-flex min-h-11 items-center justify-center rounded-full px-[17px] py-[9px] text-[14px] font-medium tracking-[-0.01em] text-ink-muted [-webkit-tap-highlight-color:transparent] [transition:color_200ms_ease,background-color_220ms_ease,box-shadow_220ms_ease] pointer-fine:data-[active=false]:hover:bg-white/50 pointer-fine:data-[active=false]:hover:text-ink data-[active=true]:font-[560] data-[active=true]:text-ink data-[active=true]:shadow-[0_1px_2px_oklch(0.2393_0_0/0.06),0_8px_18px_-10px_oklch(0.35_0.08_30/0.4)] data-[active=true]:not-active:bg-white active:bg-brand/16 active:duration-[80ms] ${FOCUS_RING} max-md:px-[13px] max-md:text-[13px]`}
          data-active={chip.href === current}
          aria-current={chip.href === pathname ? "page" : undefined}
          prefetch={true}
          scroll={false}
          onNavigate={(event) => {
            if (chip.href === pathname) {
              return;
            }
            event.preventDefault();
            startShuffle(chip.href);
          }}
        >
          {chip.label}
          <span
            className="ml-2 text-[13px] text-ink-muted tabular-nums"
            aria-hidden="true"
          >
            {chip.count}
          </span>
        </Link>
      ))}
    </nav>
  );
};
