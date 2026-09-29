import type { CSSProperties, JSX } from "react";
import { Fragment } from "react";

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

/** Where each line starts in the title's word count, for the stagger. */
const lineOffsets = (lines: MaskedTitleProps["lines"]) =>
  lines.map((_, line) =>
    lines.slice(0, line).reduce((count, words) => count + words.length, 0)
  );

/**
 * A display title whose words rise out of their own masks, a beat after one another. The words
 * stay real text in one heading, so its accessible name is the sentence. Timing lives in CSS
 * (`.mask-word`); `--words-delay` on the title shifts the whole sequence.
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
        <span
          key={line.map((word) => word.text).join(" ")}
          className="mask-line"
        >
          {line.map((word, wordIndex) => {
            const style: WordStyle = {
              "--word": String((offsets[lineIndex] ?? 0) + wordIndex),
            };
            // The space sits between the masks: inside an inline-block it would collapse.
            return (
              <Fragment key={word.text}>
                <span className="mask-word-wrap">
                  <span
                    className={
                      word.accent === true
                        ? "mask-word mask-accent"
                        : "mask-word"
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
