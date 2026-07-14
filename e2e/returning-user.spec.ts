import { test, expect } from "@playwright/test";
import { mockSolveRoute, fillInput } from "./helpers";

test.describe("Returning user", () => {
  test("share URL restores query and auto-submits", async ({ page }) => {
    await mockSolveRoute(page);

    await page.goto("/?q=derivative%20of%20x%5E2");
    await expect(page.locator("#math-problem-input")).toHaveValue("derivative of x^2");
    await expect(page.locator("#solver-result").getByRole("heading", { name: "Problem", exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("keyboard shortcut / focuses input", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#math-problem-input")).toBeVisible();
    await page.locator("body").click();
    await page.keyboard.press("/");
    await expect(page.locator("#math-problem-input")).toBeFocused();
  });

  test("keyboard Enter submits the problem", async ({ page }) => {
    await mockSolveRoute(page);

    await page.goto("/");
    await page.locator("body").click();
    await page.keyboard.press("/");
    await expect(page.locator("#math-problem-input")).toBeFocused();

    await fillInput(page, "derivative of x^2");
    await page.locator("#math-problem-input").focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#solver-result").getByRole("heading", { name: "Problem", exact: true })).toBeVisible({ timeout: 10000 });
  });
});
