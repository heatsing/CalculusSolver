import { test, expect } from "@playwright/test";
import { mockResult, mockGraphResult, mockSolveRoute, fillAndSubmit } from "./helpers";

const HISTORY_KEY = "calculus-solver-history-v2";

test.describe("Calculus Solver", () => {
  test("home page loads and shows the solver", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Calculus Solve Problems\s+Step by Step/ })).toBeVisible();
    await expect(page.locator("#math-problem-input")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Open menu" });
    if (await menuButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await menuButton.click();
      await page.getByRole("link", { name: "Examples" }).first().click();
    } else {
      await page.locator('header nav a[href="/examples"]').click();
    }
    await expect(page).toHaveURL("/examples", { timeout: 10000 });
  });

  test("submitting a problem shows the mocked result", async ({ page }) => {
    await mockSolveRoute(page);

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.getByRole("heading", { name: /Problem recognized/ })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Step-by-step solution" })).toBeVisible();
    await expect(page.getByText("Interpret the problem")).toBeVisible();
  });

  test("all steps are visible without clicking", async ({ page }) => {
    await mockSolveRoute(page);

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.getByRole("heading", { name: "Step-by-step solution" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Interpret the problem")).toBeVisible();
    await expect(page.getByText("Apply the power rule")).toBeVisible();
  });

  test("examples page search filters the list", async ({ page }) => {
    await page.goto("/examples");
    const search = page.getByPlaceholder("Search examples...");
    await search.fill("sin(x)");

    await expect(page.getByText("Solve ∫ x² sin(x) dx")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Solve 2x + 5 = 17")).toBeHidden({ timeout: 5000 });
  });

  test("history persists across reloads and selecting populates the input", async ({ page }) => {
    const historyItem = {
      id: "solver-history-test",
      createdAt: new Date().toISOString(),
      input: "derivative of x^2",
      mode: "auto",
      result: mockResult
    };

    await page.goto("/");
    await page.evaluate(({ key, item }: { key: string; item: unknown }) => {
      localStorage.setItem(key, JSON.stringify([item]));
    }, { key: HISTORY_KEY, item: historyItem });
    await page.reload();

    await page.getByRole("button", { name: "Open history" }).click();
    await expect(page.getByRole("heading", { name: "Recent problems" })).toBeVisible();
    await page.getByTestId("history-select").click();
    await expect(page.locator("#math-problem-input")).toHaveValue("derivative of x^2");
  });

  test("cancel button stops the loading state", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: "success", requestId: "e2e-cancel", result: mockResult })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.getByText("Solving your problem...")).toBeVisible();
    await page.getByRole("button", { name: "Cancel solving" }).click();
    await expect(page.getByText("Solving your problem...")).toBeHidden();
  });

  test("error card shows retry button and retry succeeds", async ({ page }) => {
    let requestCount = 0;
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        requestCount++;
        if (requestCount === 1) {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ error: { message: "Server error" } })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ status: "success", requestId: "e2e-retry", result: mockResult })
          });
        }
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.getByText("Something went wrong")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { name: /Problem recognized/ })).toBeVisible({ timeout: 10000 });
  });

  test("graph result renders zoom, reset, download controls and plotly canvas", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: "success", requestId: "e2e-graph", result: mockGraphResult })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await fillAndSubmit(page, "derivative of x^2");

    await expect(page.locator(".plotly").first()).toBeVisible({ timeout: 10000 });
    for (const name of ["Zoom in", "Zoom out", "Reset view", "Download graph"]) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }
  });
});
