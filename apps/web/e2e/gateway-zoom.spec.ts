import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const zoomNear = async (page: Page) =>
  await page
    .locator(".zoom-stage")
    .evaluate((stage) =>
      getComputedStyle(stage).getPropertyValue("--zoom-near").trim()
    );

test("a gateway pin navigates and the URL drives the zoom", async ({
  page,
}) => {
  await page.goto("/");
  expect(await zoomNear(page)).toBe("1");

  await page
    .getByRole("navigation", { name: "Site sections" })
    .getByRole("link", { name: "Work" })
    .click();

  await expect(page).toHaveURL(/\/work$/u);
  await expect(
    page.getByRole("heading", { level: 1, name: "Work" })
  ).toBeVisible();
  // The custom property, not the animation: proves the URL drove the zoom without waiting on it.
  await expect.poll(async () => await zoomNear(page)).toBe("3.2");

  await page.goBack();

  await expect(page).toHaveURL(/\/$/u);
  await expect.poll(async () => await zoomNear(page)).toBe("1");
});
