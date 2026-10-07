import { expect, test } from "@playwright/test";

test("the visitor's need jumps to its service, and the stage follows the chapter being read", async ({
  page,
}) => {
  await page.goto("/services");
  // Hydrated once the nav indicator has been measured.
  await expect(page.locator('[data-slot="nav-indicator"]')).toHaveCSS(
    "opacity",
    "1"
  );

  const router = page.getByRole("navigation", { name: "I need…" });
  await router
    .getByRole("link", { name: /to sell online in Switzerland/u })
    .click();

  await expect(page).toHaveURL("/services#shops");
  await expect(
    page.getByRole("heading", { level: 2, name: "Online shops" })
  ).toBeInViewport();
  const progress = page.getByRole("navigation", {
    name: "Services on this page",
  });
  await expect(
    progress.getByRole("link", { name: "Online shops" })
  ).toHaveAttribute("aria-current", "true");
  // One scene on stage at a time: the shop.
  await expect(page.locator('[data-state="active"]:visible')).toHaveCount(1);

  await progress.getByRole("link", { name: "Care & growth" }).click();

  await expect(
    page.getByRole("heading", { level: 2, name: "Care & growth" })
  ).toBeInViewport();
  await expect(
    progress.getByRole("link", { name: "Care & growth" })
  ).toHaveAttribute("aria-current", "true");
  await expect(
    progress.getByRole("link", { name: "Online shops" })
  ).not.toHaveAttribute("aria-current");
});
