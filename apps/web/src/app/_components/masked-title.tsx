import type { CSSProperties, JSX } from "react";
import { Fragment } from "react";

import { FADE_WHEN_REDUCED } from "@/app/_components/styles";

export interface TitleWord {
  text: string;
  accent?: boolean;
}

export interface MaskedTitleProps {
  /** Lines set by hand: the break is part of the rhythm, not a wrap the viewport decides. */
  lines: readonly (readonly TitleWord[])[];
  className: string;
  as?: "h1" | "h2";
  id?: string;
}

type WordStyle = CSSProperties & Record<"--word", string>;

// Each word rises out of its own mask. The mask is padded below so descenders are never clipped
// once the word is home, and pulled back so the line box doesn't grow.
const WORD_MASK =
  "-mx-[0.02em] -mb-[0.1em] inline-block overflow-clip px-[0.02em] pb-[0.1em] align-top";
const WORD = `inline-block animate-[wordRise_1000ms_var(--ease-out)_calc(var(--words-delay,140ms)_+_var(--word)*65ms)_both] ${FADE_WHEN_REDUCED}`;

/** Where each line starts in the title's word count, for the stagger. */
const lineOffsets = (lines: MaskedTitleProps["lines"]) =>
  lines.map((_, line) =>
    lines.slice(0, line).reduce((count, words) => count + words.length, 0)
  );

/**
 * A display title whose words rise out of their own masks, a beat after one another. The words
 * stay real text in one heading, so its accessible name is the sentence. `--words-delay` on the
 * title (`[--words-delay:120ms]`) shifts the whole sequence.
 */
export const MaskedTitle = ({
  lines,
  className,
  as: Tag = "h1",
  id,
}: MaskedTitleProps): JSX.Element => {
  const offsets = lineOffsets(lines);

  return (
    <Tag id={id} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={line.map((word) => word.text).join(" ")} className="block">
          {line.map((word, wordIndex) => {
            const style: WordStyle = {
              "--word": String((offsets[lineIndex] ?? 0) + wordIndex),
            };
            // The space sits between the masks: inside an inline-block it would collapse.
            return (
              <Fragment key={word.text}>
                <span className={WORD_MASK}>
                  <span
                    className={
                      word.accent === true ? `${WORD} text-brand-text` : WORD
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
    </Tag>
  );
};
