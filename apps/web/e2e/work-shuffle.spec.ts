import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { PROJECTS, projectsFor } from "@/app/_lib/projects";

/** Next keeps the previous filter's grid mounted but hidden (React Activity): count what is shown. */
const visibleCards = (page: Page) => page.locator(".project-card:visible");

const filterOf = (page: Page) =>
  page.getByRole("navigation", { name: "Filter by service" });

/**
 * In its slot: no transform at all after a dealt card's flight, and the identity matrix after a
 * card that rose by CSS, whose fill holds the last keyframe.
 */
const IN_PLACE = /^(?:none|matrix\(1, 0, 0, 1, 0, 0\))$/u;

/**
 * Every card of the shown grid has landed: in its slot, opaque, and out of the air. A card left
 * mid-flight — by a gather that was restarted, or by a deal played over a stale pile — fails here.
 */
const expectSettled = async (page: Page, count: number) => {
  await expect(visibleCards(page)).toHaveCount(count);
  const cards = await visibleCards(page).all();
  await Promise.all(
    cards.flatMap((card) => [
      expect(card).toHaveCSS("opacity", "1"),
      expect(card).toHaveCSS("transform", IN_PLACE),
    ])
  );
  await expect(page.locator(".project-card.is-flying")).toHaveCount(0);
};

/** The chips return to their resting size once the deck has been handed over. */
const expectChipsAtRest = async (chips: Locator) => {
  const all = await chips.all();
  await Promise.all(
    all.map(async (chip) => {
      await expect(chip).toHaveCSS("transform", IN_PLACE);
    })
  );
};

test("a second chip clicked mid-gather lands on the last one, with every card settled", async ({
  page,
}) => {
  await page.goto("/work");
  await expect(page.locator(".nav-indicator")).toHaveCSS("opacity", "1");
  await expectSettled(page, PROJECTS.length);

  const filter = filterOf(page);
  await filter.getByRole("link", { name: "Design" }).click();
  // Inside the gather: the cards are still on their way into the "All work" chip.
  await filter.getByRole("link", { name: "Online shops" }).click();

  await expect(page).toHaveURL("/work/shops");
  await expect(
    filter.getByRole("link", { name: "Online shops" })
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("heading", { level: 1, name: "Shops we've built" })
  ).toBeVisible();
  await expectSettled(page, projectsFor("shops").length);
  await expectChipsAtRest(filter.getByRole("link"));
});

test("back after a shuffle brings the whole catalogue out again", async ({
  page,
}) => {
  await page.goto("/work");
  await expect(page.locator(".nav-indicator")).toHaveCSS("opacity", "1");

  const filter = filterOf(page);
  await filter.getByRole("link", { name: "Web applications" }).click();
  await expect(page).toHaveURL("/work/applications");
  await expectSettled(page, projectsFor("applications").length);

  await page.goBack();

  await expect(page).toHaveURL("/work");
  await expect(
    page.getByRole("heading", { level: 1, name: "Work we're proud of." })
  ).toBeVisible();
  await expectSettled(page, PROJECTS.length);
  await expectChipsAtRest(filter.getByRole("link"));
});

test("the heading keeps one set of words on screen through a shuffle", async ({
  page,
}) => {
  await page.goto("/work/websites");
  await expect(page.locator(".nav-indicator")).toHaveCSS("opacity", "1");

  const title = page.locator(".work-title");
  await expect(title).toHaveText("Websites we've built");

  await filterOf(page).getByRole("link", { name: "Care & growth" }).click();

  await expect(page).toHaveURL("/work/care");
  // The old words never come back once they have gone: the swap reads as one change, not two.
  await expect(title).toHaveText("Sites and apps we look after");
  await expect(title).toHaveCSS("opacity", "1");
  await expect(page.locator(".work-lede")).toHaveCSS("opacity", "1");
});
