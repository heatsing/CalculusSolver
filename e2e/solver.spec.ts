import { test, expect } from "@playwright/test";

test.describe("Calculus Solver", () => {
  test("home page loads and shows the solver", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Solve Calculus with")).toBeVisible();
    await expect(page.locator("[aria-label='Math problem input']")).toBeVisible();
  });

  test("submitting a problem without API key returns a fallback result", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("[aria-label='Math problem input']");
    await input.fill("Solve 2x + 5 = 17");
    await input.press("Enter");

    await expect(page.locator("text=Answer").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Step-by-Step Solution")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Examples");
    await expect(page).toHaveURL("/examples");
  });
});
