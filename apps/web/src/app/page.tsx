import type { CSSProperties } from "react";
import { Fragment } from "react";

import { ArrowIcon } from "@/app/_components/arrow-icon";
import { FlightLink } from "@/app/_components/flight-link";

interface Word {
  text: string;
  accent?: boolean;
}

// Two lines, set by hand: the break is part of the rhythm, not a wrap the viewport decides.
const TITLE_LINES: readonly (readonly Word[])[] = [
  [{ text: "Build" }, { text: "a" }, { text: "website." }],
  [{ text: "Get" }, { text: "noticed." }, { text: "Grow.", accent: true }],
];

/** Where each line starts in the headline's word count, for the stagger. */
const LINE_OFFSETS = TITLE_LINES.map((_, line) =>
  TITLE_LINES.slice(0, line).reduce((count, words) => count + words.length, 0)
);

type WordStyle = CSSProperties & Record<"--word", string>;

/** Each word rises out of its own mask, a beat after the one before it. */
const HeroTitle = () => (
  <h1 className="hero-title">
    {TITLE_LINES.map((line, lineIndex) => (
      <span key={line[0]?.text} className="hero-line">
        {line.map((word, wordIndex) => {
          const style: WordStyle = {
            "--word": String((LINE_OFFSETS[lineIndex] ?? 0) + wordIndex),
          };
          // The space sits between the masks: inside an inline-block it would collapse.
          return (
            <Fragment key={word.text}>
              <span className="hero-word-mask">
                <span
                  className={
                    word.accent === true ? "hero-word hero-accent" : "hero-word"
                  }
                  style={style}
                >
                  {word.text}
                </span>
              </span>{" "}
            </Fragment>
          );
        })}
      </span>
    ))}
  </h1>
);

const Page = () => (
  <div className="hero">
    <p className="hero-badge">
      <span className="live-dot" aria-hidden="true" />
      {/* TODO: "Swiss web studio" or "Swiss software studio"; add the season once booking is confirmed */}
      <span>Swiss web studio</span>
      <span className="hero-badge-rule" aria-hidden="true" />
      <span className="hero-badge-note">Now taking on new projects</span>
    </p>
    <HeroTitle />
    <p className="hero-lede">
      Sharp, fast websites that turn visitors into customers.
    </p>
    <div className="hero-actions">
      <FlightLink href="/contact" className="button button-primary">
        Start a project
        <span className="button-icon">
          <ArrowIcon />
        </span>
      </FlightLink>
      <FlightLink href="/work" className="button button-ghost">
        See our work
      </FlightLink>
    </div>
  </div>
);

export default Page;
