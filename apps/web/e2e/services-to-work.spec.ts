import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { projectsFor } from "@/app/_lib/projects";

/** Next keeps the previous filter's grid mounted but hidden (React Activity): count what is shown. */
const visibleCards = (page: Page) => page.locator(".project-card:visible");

test("a service leads to its own slice of the work, and the filters shuffle without a flight", async ({
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
  // Landed by a flight, the grid is dealt from the Websites chip; every card ends in its slot.
  await expect(page.locator(".project-grid:visible")).toHaveAttribute(
    "data-deal",
    "landing"
  );
  const lastCard = visibleCards(page).last();
  await expect(lastCard).toHaveCSS("opacity", "1");
  await expect(lastCard).toHaveCSS("transform", "none");
  // The Work link in the pill is the active one for a Work filter.
  await expect(
    page.getByLabel("Primary").getByRole("link", { name: "Work" })
  ).toHaveAttribute("aria-current", "page");

  await filter.getByRole("link", { name: "Design" }).click();

  // The clicked chip is current from the click; the cards are gathered before the URL changes.
  await expect(filter.getByRole("link", { name: "Design" })).toHaveAttribute(
    "aria-current",
    "page"
  );
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
  // A shuffle: the new grid is dealt from the Design chip.
  await expect(page.locator(".project-grid:visible")).toHaveAttribute(
    "data-deal",
    "shuffle"
  );
  const lastDesignCard = visibleCards(page).last();
  await expect(lastDesignCard).toHaveCSS("opacity", "1");
  await expect(lastDesignCard).toHaveCSS("transform", "none");

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
