import { describe, expect, it } from "vite-plus/test";

import { tileSize } from "./tiles";

const board = (count: number) =>
  Array.from({ length: count }, (_, order) => tileSize(order, count));

describe("the Work board's tile sizes", () => {
  it("leads with the newest project across the full width", () => {
    expect(tileSize(0, 7)).toBe("full");
  });

  it("follows with pairs whose wide half swaps sides every row", () => {
    expect(board(7)).toStrictEqual([
      "full",
      "wide",
      "narrow",
      "narrow",
      "wide",
      "wide",
      "narrow",
    ]);
  });

  it("gives a project left over at the end the full width", () => {
    expect(board(4)).toStrictEqual(["full", "wide", "narrow", "full"]);
    expect(board(2)).toStrictEqual(["full", "full"]);
  });

  it("shows a single project across the full width", () => {
    expect(board(1)).toStrictEqual(["full"]);
  });
});
