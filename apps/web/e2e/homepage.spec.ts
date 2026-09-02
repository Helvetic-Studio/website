import { expect, test } from "@playwright/test";

test("shows the homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Helvetic Studio");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "We build websites that make your business impossible to ignore.",
    })
  ).toBeVisible();
});
