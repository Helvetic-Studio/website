import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with `clsx`, then resolve Tailwind conflicts via `twMerge`.
 *
 * Prefer this over bare string concatenation or `clsx` alone when composing
 * utility classes that may override each other.
 *
 * @param inputs - Class values accepted by `clsx` (`string`, arrays, conditionals).
 * @returns A single conflict-free class string.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
