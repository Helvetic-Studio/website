import { describe, expect, it } from "vite-plus/test";

import type { ChapterEntry } from "./tour";
import { chapterInView, numeral, sceneStateFor } from "./tour";

describe(sceneStateFor, () => {
  it("puts passed scenes before the one on stage and the rest after it", () => {
    expect(
      [0, 1, 2, 3, 4].map((index) => sceneStateFor(index, 2))
    ).toStrictEqual(["before", "before", "active", "after", "after"]);
  });

  it("has nothing passed on the first chapter and nothing to come on the last", () => {
    expect(sceneStateFor(0, 0)).toBe("active");
    expect(sceneStateFor(4, 0)).toBe("after");
    expect(sceneStateFor(0, 4)).toBe("before");
    expect(sceneStateFor(4, 4)).toBe("active");
  });
});

describe(numeral, () => {
  it("writes positions with two digits", () => {
    expect(numeral(1)).toBe("01");
    expect(numeral(12)).toBe("12");
  });
});

const entry = (chapter: number, isIntersecting: boolean): ChapterEntry => {
  const target = document.createElement("article");
  target.dataset["chapter"] = String(chapter);
  return { isIntersecting, target };
};

describe(chapterInView, () => {
  it("reads the chapter crossing the line, the latest one when several are reported", () => {
    expect(chapterInView([entry(1, true)])).toBe(1);
    expect(chapterInView([entry(1, false), entry(2, true)])).toBe(2);
    expect(chapterInView([entry(0, true), entry(3, true)])).toBe(3);
  });

  it("has no answer when chapters only leave the line, or are not chapters", () => {
    expect(chapterInView([entry(2, false)])).toBeNull();
    expect(chapterInView([])).toBeNull();
    expect(
      chapterInView([
        { isIntersecting: true, target: document.createElement("div") },
      ])
    ).toBeNull();
  });
});
