import { test, expect } from "@playwright/test";
import { mockSolveRoute, fillAndSubmit } from "./helpers";

test.describe("First-time visitor", () => {
  test("home page shows clear input label and submit button is named", async ({ page }) => {
    await page.goto("/");
    const label = page.locator("label[for='math-problem-input']");
    await expect(label).toBeVisible();
    await expect(label).toHaveText("Enter a calculus problem");

    const submit = page.getByRole("button", { name: "Solve Problem" });
    await expect(submit).toBeVisible();
  });

  test("typing and submitting a problem reveals the result", async ({ page }) => {
    await mockSolveRoute(page);

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.locator("#solver-result").getByRole("heading", { name: "Problem", exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#solver-result").getByRole("heading", { name: "Step-by-Step Solution", exact: true })).toBeVisible();
  });

  test("no dead-end Image tab is shown", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Image" })).not.toBeVisible();
  });
});
