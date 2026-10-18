/**
 * The Work board is not a grid of equal cards. The newest project leads across the full width;
 * the rest follow in pairs whose wide and narrow halves swap sides each row, so the eye zig-zags
 * down the page. A project left over at the end takes the full width rather than half a row.
 */
export type TileSize = "full" | "wide" | "narrow";

export const tileSize = (order: number, count: number): TileSize => {
  const rest = order - 1;
  const lastAlone = count % 2 === 0 && order === count - 1;
  if (order === 0 || lastAlone) {
    return "full";
  }
  const leftHalf = rest % 2 === 0;
  const evenRow = Math.floor(rest / 2) % 2 === 0;
  return leftHalf === evenRow ? "wide" : "narrow";
};
