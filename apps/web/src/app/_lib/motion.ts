/**
 * The two things every animated component on the page has to ask the browser: whether the visitor
 * wants movement at all, and what the page's own easing is. Both read live state, so they are kept
 * out of the pure geometry modules and out of each component's own copy.
 */

/** The page's rise easing (`--rise-ease` in index.css); the literal is the fallback only. */
const RISE_EASE_FALLBACK = "cubic-bezier(0.2, 0.7, 0.2, 1)";

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const riseEaseOf = (element: Element): string =>
  getComputedStyle(element).getPropertyValue("--rise-ease").trim() ||
  RISE_EASE_FALLBACK;
