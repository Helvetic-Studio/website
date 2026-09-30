export interface InkWordsProps {
  text: string;
}

/**
 * A sentence set word by word, so each word can ink in as it crosses the viewport: it waits pale
 * and inks in as it crosses from the lower to the middle third of the view, a scroll-driven
 * animation. Plain text inside: it reads as one sentence to assistive technology, and it is fully
 * inked wherever scroll timelines or motion are unavailable.
 */
const INK_WORD =
  "supports-[animation-timeline:view()]:animate-[inkIn_linear_both] supports-[animation-timeline:view()]:[animation-range:cover_18%_cover_42%] supports-[animation-timeline:view()]:[animation-timeline:view()] motion-reduce:animate-none!";

export const InkWords = ({ text }: InkWordsProps) =>
  text.split(" ").map((word, index) => (
    // Words repeat ("the", "we"), so the position is part of the key; the text never reorders.
    // oxlint-disable-next-line react/no-array-index-key
    <span key={`${index}-${word}`} className={INK_WORD}>
      {word}{" "}
    </span>
  ));
