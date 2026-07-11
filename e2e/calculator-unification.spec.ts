import { test, expect } from "@playwright/test";

const calculatorRoutes = [
  "/calculus-calculator",
  "/derivative-calculator",
  "/integral-calculator",
  "/limit-calculator",
  "/gradient-calculator",
  "/graphing-calculator",
  "/algebra-solver",
  "/equation-solver",
  "/quadratic-solver",
  "/factoring-calculator",
  "/simplify-calculator",
  "/exponent-calculator",
  "/math-calculator",
  "/fraction-calculator",
  "/matrix-calculator",
  "/average-calculator",
  "/percentage-calculator",
  "/probability-calculator",
  "/root-calculator",
  "/log-calculator",
  "/lcm-calculator"
];

test.describe("Unified calculator pages", () => {
  test("every calculator uses the shared page structure", async ({ page }) => {
    test.setTimeout(120000);

    for (const route of calculatorRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByText("Free online calculator", { exact: true }), `Missing shared hero on ${route}`).toBeVisible();
      await expect(page.getByText("Step-by-step solutions", { exact: true }), `Missing shared benefits on ${route}`).toBeVisible();
      await expect(page.getByRole("heading", { name: /How to Use the/ }), `Missing shared instructions on ${route}`).toBeVisible();
      await expect(page.getByRole("heading", { name: "Frequently Asked Questions" }), `Missing shared FAQ on ${route}`).toBeVisible();
      await expect(page.getByRole("heading", { name: "More Calculators" }), `Missing related tools on ${route}`).toBeVisible();
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
    test.setTimeout(120000);
    const representativeRoutes = calculatorRoutes.filter((route) => route !== "/calculus-calculator");

    for (const route of representativeRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Calculate", exact: true }).click();
      await expect(page.getByText("Solved", { exact: true }), `Calculator failed on ${route}`).toBeVisible({ timeout: 10000 });
    }
  });
});
