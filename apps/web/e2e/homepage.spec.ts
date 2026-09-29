import { expect, test } from "@playwright/test";

test("shows the homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Helvetic Studio");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build a website. Get noticed. Grow.",
    })
  ).toBeVisible();
});

test("an unknown address lands off the trail, with the summits as ways back", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Off the trail." })
  ).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Site sections" })
      .getByRole("link", { name: "Services" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to the start" })
  ).toBeVisible();
});
