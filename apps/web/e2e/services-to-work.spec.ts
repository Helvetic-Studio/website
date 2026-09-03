import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { projectsFor } from "@/app/_lib/projects";

/** Next keeps the previous filter's grid mounted but hidden (React Activity): count what is shown. */
const visibleCards = (page: Page) => page.locator(".project-card:visible");

test("a service leads to its own slice of the work, and the filters swap without a flight", async ({
  page,
}) => {
  await page.goto("/services");
  await expect(page.locator(".nav-indicator")).toHaveCSS("opacity", "1");

  const door = page.getByRole("link", { name: "See websites we've built" });
  await door.scrollIntoViewIfNeeded();
  await door.click();

  await expect(page).toHaveURL("/work/websites");
  await expect(
    page.getByRole("heading", { level: 1, name: "Websites we've built" })
  ).toBeVisible();
  await expect(page.locator(".site-content")).toHaveCSS("opacity", "1");
  const filter = page.getByRole("navigation", { name: "Filter by service" });
  await expect(filter.getByRole("link", { name: "Websites" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(visibleCards(page)).toHaveCount(projectsFor("websites").length);
  // The Work link in the pill is the active one for a Work filter.
  await expect(
    page.getByLabel("Primary").getByRole("link", { name: "Work" })
  ).toHaveAttribute("aria-current", "page");

  await filter.getByRole("link", { name: "Design" }).click();

  await expect(page).toHaveURL("/work/design");
  await expect(
    page.getByRole("heading", { level: 1, name: "Design work" })
  ).toBeVisible();
  // A page of the same summit: the stage never faded out.
  await expect(page.locator(".site-content")).not.toHaveAttribute(
    "data-flight",
    "out"
  );
  await expect(visibleCards(page)).toHaveCount(projectsFor("design").length);

  await filter.getByRole("link", { name: "All work" }).click();

  await expect(page).toHaveURL("/work");
  await expect(
    page.getByRole("heading", { level: 1, name: "Work we're proud of." })
  ).toBeVisible();
});

test("an unknown work filter is a 404", async ({ page }) => {
  const response = await page.goto("/work/hosting");

  expect(response?.status()).toBe(404);
});
