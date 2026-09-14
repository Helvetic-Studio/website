"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
}

const CHIPS: readonly Chip[] = [
  { href: "/work", label: "All work" },
  ...SERVICES.map((service) => ({
    href: workRouteFor(service.slug),
    label: service.title,
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
    <nav className="work-filter" aria-label="Filter by service">
      {CHIPS.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          className="filter-chip"
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
        </Link>
      ))}
    </nav>
  );
};
