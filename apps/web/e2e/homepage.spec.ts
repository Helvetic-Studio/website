import { expect, test } from "@playwright/test";

test("shows the homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Helvetic Studio");
  await expect(
    page.getByRole("heading", { level: 1, name: "Hello, World!" })
  ).toBeVisible();
});

test("changes the color theme", async ({ page }) => {
  await page.goto("/");

  const darkTheme = page.getByRole("radio", {
    name: "Switch to dark theme",
  });
  await page.locator("label").filter({ has: darkTheme }).click();

  await expect(darkTheme).toBeChecked();
  await expect(page.locator("html")).toHaveClass(/dark/u);
});
