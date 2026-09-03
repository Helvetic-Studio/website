import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const NEAR_ZOOM = 3.2;

declare global {
  interface Window {
    ridgeSamples?: number[];
  }
}

const nearScale = async (page: Page) =>
  await page.evaluate(() => {
    const layer = document.querySelector(".ridge-near");
    if (!layer) {
      throw new Error("ridge-near missing");
    }
    return new DOMMatrix(getComputedStyle(layer).transform).a;
  });

/** Records the near layer's scale on every frame into `window.ridgeSamples`. */
const startSampling = async (page: Page) => {
  await page.evaluate(() => {
    const layer = document.querySelector(".ridge-near");
    if (!layer) {
      throw new Error("ridge-near missing");
    }
    const samples: number[] = [];
    window.ridgeSamples = samples;
    const tick = () => {
      samples.push(new DOMMatrix(getComputedStyle(layer).transform).a);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};

const openHome = async (page: Page) => {
  await page.goto("/");
  // Hydrated once the nav indicator has been measured.
  await expect(page.locator(".nav-indicator")).toHaveCSS("opacity", "1");
};

test("a gateway click flies the ridge in while the page fades, then flies back out", async ({
  page,
}) => {
  await openHome(page);
  expect(await nearScale(page)).toBe(1);

  await startSampling(page);
  await page
    .getByLabel("Primary")
    .getByRole("link", { name: "Services" })
    .click();

  await expect(page).toHaveURL("/services");
  await expect(
    page.getByRole("heading", { level: 1, name: /Everything your company/u })
  ).toBeVisible();
  await expect(page.locator(".site-content")).toHaveCSS("opacity", "1");
  await expect
    .poll(async () => await nearScale(page))
    .toBeCloseTo(NEAR_ZOOM, 3);
  await expect(page.locator(".pins")).toBeHidden();
  // The camera passes through the middle of its flight instead of snapping.
  const samples = await page.evaluate(() => window.ridgeSamples ?? []);
  expect(samples.some((scale) => scale > 1.2 && scale < 3)).toBe(true);

  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Build a website/u })
  ).toBeVisible();
  await expect(page.locator(".site-content")).toHaveCSS("opacity", "1");
  await expect.poll(async () => await nearScale(page)).toBe(1);
  await expect(page.locator(".pins")).toBeVisible();
});

test("a summit pin lands on its gateway", async ({ page }) => {
  await openHome(page);

  await page
    .getByLabel("Site sections")
    .getByRole("link", { name: "Work" })
    .click();

  await expect(page).toHaveURL("/work");
  await expect(
    page.getByRole("heading", { level: 1, name: "Work we're proud of." })
  ).toBeVisible();
  await expect(page.locator(".site-content")).toHaveCSS("opacity", "1");
  await expect
    .poll(async () => await nearScale(page))
    .toBeCloseTo(NEAR_ZOOM, 3);
});

test("reduced motion still lands on the gateway", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);

  await page.getByLabel("Primary").getByRole("link", { name: "About" }).click();

  await expect(page).toHaveURL("/about");
  await expect(
    page.getByRole("heading", { level: 1, name: "About" })
  ).toBeVisible();
  await expect(page.locator(".site-content")).toHaveCSS("opacity", "1");
  await expect
    .poll(async () => await nearScale(page))
    .toBeCloseTo(NEAR_ZOOM, 3);
});
