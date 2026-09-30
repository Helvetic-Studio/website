import type { Metadata } from "next";

import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import type { TitleWord } from "@/app/_components/masked-title";
import { RangeHero } from "@/app/_components/range-hero";
import { buttonClass } from "@/app/_components/styles";

export const metadata: Metadata = {
  title: "Page not found",
};

const TITLE: readonly (readonly TitleWord[])[] = [
  [{ text: "Off" }, { text: "the" }, { text: "trail.", accent: true }],
];

/**
 * An unknown address is not a gateway, so the camera shows the whole range — and the summit
 * markers beneath this text are live doors back into the site. The page only has to say so.
 */
const NotFound = () => (
  <RangeHero
    badge={{ lead: "404", note: "Page not found" }}
    title={TITLE}
    lede="This page doesn’t exist, or it has moved. Every summit below leads somewhere real."
  >
    <FlightLink href="/" className={buttonClass("primary")}>
      Back to the start
      <ButtonIcon />
    </FlightLink>
    <FlightLink href="/contact" className={buttonClass("ghost")}>
      Ask us instead
    </FlightLink>
  </RangeHero>
);

export default NotFound;
