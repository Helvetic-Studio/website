export interface InkWordsProps {
  text: string;
}

/**
 * A sentence set word by word, so each word can ink in as it crosses the viewport (`.ink-word`, a
 * scroll-driven animation). Plain text inside: it reads as one sentence to assistive technology,
 * and it is fully inked wherever scroll timelines or motion are unavailable.
 */
export const InkWords = ({ text }: InkWordsProps) =>
  text.split(" ").map((word, index) => (
    // Words repeat ("the", "we"), so the position is part of the key; the text never reorders.
    // oxlint-disable-next-line react/no-array-index-key
    <span key={`${index}-${word}`} className="ink-word">
      {word}{" "}
    </span>
  ));
