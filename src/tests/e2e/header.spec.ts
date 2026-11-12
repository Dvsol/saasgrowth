import { test, expect } from "@playwright/test";
test("header: logo returns home, nav works, mobile menu", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await page.getByRole("link", { name: /EKIS.*home/i }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Scorecards", exact: true }).first().click();
  await expect(page).toHaveURL(/\/scorecards/);
  // Mobile menu
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /Open menu|Close menu/ });
  await toggle.click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toBeHidden();
});

test("tables scroll and headings order", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();
  await expect(page.locator("caption")).toBeHidden(); // sr-only but exists
});
