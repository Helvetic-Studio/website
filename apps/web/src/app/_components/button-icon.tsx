import type { ReactNode } from "react";

import { ArrowIcon } from "@/app/_components/arrow-icon";

export interface ButtonIconProps {
  /** Which way the arrow leans on hover: towards where the button goes. */
  nudge?: "right" | "down";
  /** The glyph; the trailing arrow by default. */
  children?: ReactNode;
}

const NUDGE = {
  right:
    "motion-safe:pointer-fine:group-hover/button:translate-x-[3px] motion-safe:pointer-fine:group-hover/button:scale-105",
  down: "motion-safe:pointer-fine:group-hover/button:translate-y-[3px] motion-safe:pointer-fine:group-hover/button:scale-105",
} as const;

const ARROW = <ArrowIcon />;

/**
 * The disc a button's arrow rides in, flush with the pill's inner edge. The button (see
 * `buttonClass`) finds it by its slot to tighten around it and tint it.
 */
export const ButtonIcon = ({
  nudge = "right",
  children = ARROW,
}: ButtonIconProps) => (
  <span
    data-slot="button-icon"
    className={`grid size-[38px] shrink-0 place-items-center rounded-full transition-transform duration-[260ms] ease-out motion-reduce:duration-0 [&>svg]:size-[15px] ${NUDGE[nudge]}`}
  >
    {children}
  </span>
);
