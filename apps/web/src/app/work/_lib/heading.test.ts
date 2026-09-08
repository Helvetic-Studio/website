import { describe, expect, it } from "vite-plus/test";

import { glideKeyframes, HEADING_GLIDE_MS } from "./heading";

describe("the heading's height glide", () => {
  it("travels from the height the block had to the height it has", () => {
    expect(glideKeyframes(120, 94)).toStrictEqual([
      { height: "120px" },
      { height: "94px" },
    ]);
  });

  it("has nothing to play on the first measure", () => {
    expect(glideKeyframes(null, 94)).toBeNull();
  });

  it("has nothing to play when the words take the same room", () => {
    expect(glideKeyframes(94, 94)).toBeNull();
  });

  it("settles within the entrance of the words it makes room for", () => {
    expect(HEADING_GLIDE_MS).toBeLessThanOrEqual(400);
  });
});
