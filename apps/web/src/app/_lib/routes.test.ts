import { describe, expect, it } from "vite-plus/test";

import { isWithinRoute } from "./routes";

describe(isWithinRoute, () => {
  it("matches a route and the pages beneath it", () => {
    expect(isWithinRoute("/work", "/work")).toBeTruthy();
    expect(isWithinRoute("/work/websites", "/work")).toBeTruthy();
    expect(isWithinRoute("/workshop", "/work")).toBeFalsy();
    expect(isWithinRoute("/services", "/work")).toBeFalsy();
  });

  it("gives the home page nothing beneath it", () => {
    expect(isWithinRoute("/", "/")).toBeTruthy();
    expect(isWithinRoute("/work", "/")).toBeFalsy();
  });
});
