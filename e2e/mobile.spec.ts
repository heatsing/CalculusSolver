import { test, expect } from "@playwright/test";
import { mockResult, mockSolveRoute, fillAndSubmit } from "./helpers";

const mobileProjects = new Set(["mobile-chrome", "mobile-safari"]);

const HISTORY_KEY = "calculus-solver-history-v2";

const sampleHistoryItem = {
  id: "mobile-history-test",
  createdAt: new Date().toISOString(),
  input: "derivative of x^2",
  mode: "auto",
  result: mockResult
};

test.describe("Mobile user", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!mobileProjects.has(testInfo.project.name), "Mobile-only test");
  });

  test("no horizontal overflow at 320 px on idle and result pages", async ({ page }) => {
    test.setTimeout(60000);
    await mockSolveRoute(page);
    await page.setViewportSize({ width: 320, height: 568 });

    const idleRoutes = ["/", "/calculus-solver", "/algebra-solver", "/calculus-calculator", "/daily-challenge", "/derivative-calculator", "/examples"];
    for (const route of idleRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
      const overflows = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflows, `Horizontal overflow detected on ${route}`).toBe(false);
    }

    const resultRoutes = ["/", "/calculus-solver"];
    for (const route of resultRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await fillAndSubmit(page, "derivative of x^2");
      await expect(page.getByRole("heading", { name: /Problem recognized/ })).toBeVisible({ timeout: 10000 });

      const overflows = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflows, `Horizontal overflow on result at ${route}`).toBe(false);
    }
  });

  test("symbol keyboard defaults closed on mobile", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Math keyboard/i });
    await expect(toggle).toContainText("Show", { timeout: 5000 });
    await toggle.click();
    await expect(toggle).toContainText("Hide");
    await expect(page.getByRole("button", { name: /^Insert / })).not.toHaveCount(0);
  });

  test("math symbol buttons meet touch target", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /Math keyboard/i });
    await expect(toggle).toContainText("Show");
    await toggle.click();
    await expect(toggle).toContainText("Hide");

    const buttons = page.getByRole("button", { name: /^Insert / });
    await expect(buttons.first()).toBeVisible();
    await page.waitForTimeout(500);
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      expect(box?.width ?? 0, `Button ${i} width`).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0, `Button ${i} height`).toBeGreaterThanOrEqual(44);
    }
  });

  test("redesigned math keyboard switches categories and edits input", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /Math keyboard/i });
    await toggle.click();

    await page.getByRole("tab", { name: "Calculus" }).click();
    await page.getByRole("button", { name: "Insert integral" }).click();
    await expect(page.locator("#math-problem-input")).toHaveValue("integrate(");

    await page.getByRole("tab", { name: "Basic" }).click();
    await page.getByRole("button", { name: "Delete previous character" }).click();
    await expect(page.locator("#math-problem-input")).toHaveValue("integrate");
    await page.getByRole("button", { name: "Clear expression" }).click();
    await expect(page.locator("#math-problem-input")).toHaveValue("");
  });

  test("history drawer works on touch", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(({ key, item }: { key: string; item: unknown }) => {
      localStorage.setItem(key, JSON.stringify([item]));
    }, { key: HISTORY_KEY, item: sampleHistoryItem });
    await page.reload();
    await page.waitForLoadState("networkidle");

    const historyButton = page.getByRole("button", { name: "History" });
    await expect(historyButton).toBeVisible();
    await historyButton.click();
    await expect(page.getByRole("heading", { name: "Recent problems" })).toBeVisible();

    await page.getByTestId("history-select").click();
    await expect(page.locator("#math-problem-input")).toHaveValue("derivative of x^2");

    await page.getByRole("button", { name: "History" }).click();
    await page.getByTestId("history-delete").click();
    await expect(page.getByTestId("history-select")).not.toBeVisible();
  });

  test("header mobile menu opens", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Calculus Solver" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Algebra Solver" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Examples" })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Solve now" })).toBeVisible();
  });

  test("share URL auto-submits on mobile", async ({ page }) => {
    await mockSolveRoute(page);
    await page.goto("/?q=derivative%20of%20x%5E2");
    await expect(page.locator("#math-problem-input")).toHaveValue("derivative of x^2");
    await expect(page.getByRole("heading", { name: /Problem recognized/ })).toBeVisible({ timeout: 10000 });
  });
});
