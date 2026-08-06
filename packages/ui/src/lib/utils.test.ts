import { describe, expect, it } from "vite-plus/test";

import { cn } from "./utils";

describe(cn, () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("omits falsy conditional classes", () => {
    expect(cn("text-red-500", undefined, "font-bold")).toBe(
      "text-red-500 font-bold"
    );
  });
});
