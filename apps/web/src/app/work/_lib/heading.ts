/**
 * The Work heading swaps its words with the filter, and one filter's words rarely take the same
 * lines as the next: a lede wraps, a title breaks. The block glides between the two heights so the
 * chips and the grid below are never knocked up or down. This module is the geometry; the
 * component measures and plays.
 */

/** The glide takes the words' own entrance, so the block has settled as the new text arrives. */
export const HEADING_GLIDE_MS = 360;

/**
 * The heights to glide between, or nothing to play: the first measure has nothing to come from,
 * and a block that kept its height has nothing to travel.
 */
export const glideKeyframes = (
  before: number | null,
  after: number
): Keyframe[] | null =>
  before === null || before === after
    ? null
    : [{ height: `${before}px` }, { height: `${after}px` }];
