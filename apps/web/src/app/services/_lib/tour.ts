/** Where one service sits relative to the one being read: passed, on stage, or still to come. */
export type SceneState = "before" | "active" | "after";

/**
 * The side a scene waits on decides the way it travels: scrolling down, the passed scene leaves
 * upwards and the next one rises from below; scrolling back up plays the same move in reverse.
 */
export const sceneStateFor = (index: number, active: number): SceneState => {
  if (index < active) {
    return "before";
  }
  return index === active ? "active" : "after";
};

/** A 1-based position as the page writes it: "01", "02"… */
export const numeral = (position: number): string =>
  String(position).padStart(2, "0");

/** The parts of an observer entry the chapter tracking reads. */
export type ChapterEntry = Pick<
  IntersectionObserverEntry,
  "isIntersecting" | "target"
>;

/**
 * The chapter a batch of observer entries says is being read now: the last one crossing the line,
 * by its `data-chapter` index. None when the batch only reports chapters leaving the line.
 */
export const chapterInView = (
  entries: readonly ChapterEntry[]
): number | null => {
  const target = entries.findLast((entry) => entry.isIntersecting)?.target;
  const chapter =
    target instanceof HTMLElement ? target.dataset["chapter"] : undefined;
  return chapter === undefined ? null : Number(chapter);
};
