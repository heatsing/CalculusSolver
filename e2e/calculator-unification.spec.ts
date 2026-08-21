import { test, expect } from "@playwright/test";
import { allCalculatorTools } from "@/data/calculator-tools";

const calculatorRoutes = allCalculatorTools.map((tool) => tool.href);

test.describe("Unified calculator pages", () => {
  test("every calculator uses the shared page structure", async ({ page }) => {
    test.setTimeout(120000);

    for (const route of calculatorRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page, `Incorrect title format on ${route}`).toHaveTitle(/^Calculus Solver – Free Online /);
      await expect(page.getByText("Free online calculator", { exact: true }), `Missing shared hero on ${route}`).toBeVisible();
      await expect(page.getByText("Step-by-step solutions", { exact: true }), `Missing shared benefits on ${route}`).toBeVisible();
      await expect(page.getByRole("heading", { name: /How to Use the/ }), `Missing shared instructions on ${route}`).toBeVisible();
      await expect(page.getByRole("heading", { name: "Frequently Asked Questions" }), `Missing shared FAQ on ${route}`).toBeVisible();
      const moreCalculators = page.getByRole("heading", { name: "More Calculators" }).locator("..");
      await expect(moreCalculators, `Missing related tools on ${route}`).toBeVisible();
      const relatedCount = await moreCalculators.getByRole("link").count();
      expect(relatedCount, `Expected a focused related-calculator set on ${route}`).toBeGreaterThanOrEqual(4);
      expect(relatedCount, `Too many non-contextual calculator links on ${route}`).toBeLessThanOrEqual(7);
      await expect(page.getByRole("contentinfo"), `Missing shared footer on ${route}`).toBeVisible();
    }
  });

  test("calculator directory links to every calculator route", async ({ page }) => {
    await page.goto("/calculators");
    for (const route of calculatorRoutes) {
      await expect(page.locator("#main-content").locator(`a[href="${route}"]`), `Missing directory link to ${route}`).toBeVisible();
    }
  });

  test("specialized calculator workspaces return real answers", async ({ page }) => {
    test.setTimeout(240000);
    const representativeRoutes = calculatorRoutes.filter((route) => route !== "/calculus-calculator");
    let requestIndex = 0;
    for (const endpoint of ["**/api/solve", "**/api/calculus"]) {
      await page.route(endpoint, async (route) => {
        requestIndex += 1;
        await route.continue({
          headers: { ...route.request().headers(), "x-forwarded-for": `198.51.100.${requestIndex}` }
        });
      });
    }

    for (const route of representativeRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Calculate result", exact: true }).click();
      await expect(page.getByText("Solved", { exact: true }), `Calculator failed on ${route}`).toBeVisible({ timeout: 30000 });
    }
  });
});
