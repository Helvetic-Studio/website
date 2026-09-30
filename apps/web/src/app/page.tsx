import { ButtonIcon } from "@/app/_components/button-icon";
import { FlightLink } from "@/app/_components/flight-link";
import type { TitleWord } from "@/app/_components/masked-title";
import { RangeHero } from "@/app/_components/range-hero";
import { buttonClass } from "@/app/_components/styles";

const TITLE: readonly (readonly TitleWord[])[] = [
  [{ text: "Build" }, { text: "a" }, { text: "website." }],
  [{ text: "Get" }, { text: "noticed." }, { text: "Grow.", accent: true }],
];

// TODO: "Swiss web studio" or "Swiss software studio"; add the season once booking is confirmed
const Page = () => (
  <RangeHero
    badge={{
      lead: "Swiss web studio",
      note: "Now taking on new projects",
      live: true,
    }}
    title={TITLE}
    lede="Sharp, fast websites that turn visitors into customers."
  >
    <FlightLink href="/contact" className={buttonClass("primary")}>
      Start a project
      <ButtonIcon />
    </FlightLink>
    <FlightLink href="/work" className={buttonClass("ghost")}>
      See our work
    </FlightLink>
  </RangeHero>
);

export default Page;
