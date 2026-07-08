import { test, expect } from "@playwright/test";
import type { SolverResult } from "@/types/solver";

const mockResult: SolverResult = {
  operation: "derivative",
  interpretedProblem: "derivative of x^2",
  interpretedLatex: "x^2",
  answer: "2x",
  answerLatex: "2x",
  answerType: "exact",
  steps: [
    {
      number: 1,
      title: "Interpret the problem",
      explanation: "The derivative of x^2 is requested.",
      rule: "Operation detection"
    },
    {
      number: 2,
      title: "Apply the power rule",
      explanation: "Bring down the exponent and subtract one from it.",
      rule: "Power rule"
    }
  ],
  aiVerification: {
    status: "verified",
    explanation: "Checked by differentiation."
  },
  localVerification: {
    status: "verified",
    explanation: "Local verification matches."
  },
  graph: {
    available: false,
    expression: null,
    variable: "x",
    domain: null
  },
  machine: {
    source_expression: "x^2",
    answer_expression: "2x",
    variable: "x",
    equation_left: null,
    equation_right: null,
    solutions: [],
    lower_bound: null,
    upper_bound: null,
    limit_point: null,
    limit_direction: null
  },
  warnings: []
};

test.describe("Calculus Solver", () => {
  test("home page loads and shows the solver", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Solve Calculus with")).toBeVisible();
    await expect(page.locator("[aria-label='Math problem input']")).toBeVisible();
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");
    await page.locator("header nav >> text=Examples").click();
    await expect(page).toHaveURL("/examples");
  });

  test("submitting a problem shows the mocked result", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            requestId: "e2e-request",
            result: mockResult
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    const input = page.locator("[aria-label='Math problem input']");
    await input.fill("derivative of x^2");
    await input.press("Enter");

    await expect(page.getByText("Answer", { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Step-by-Step Solution" })).toBeVisible();
    await expect(page.getByRole("button", { name: "1 Interpret the problem" })).toBeVisible();
  });

  test("clicking Show all steps reveals every step", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "success",
            requestId: "e2e-request",
            result: mockResult
          })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    const input = page.locator("[aria-label='Math problem input']");
    await input.fill("derivative of x^2");
    await input.press("Enter");

    await expect(page.getByRole("heading", { name: "Step-by-Step Solution" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Show all steps" }).click();
    await expect(page.getByRole("button", { name: "2 Apply the power rule" })).toBeVisible();
  });

  test("examples page search filters the list", async ({ page }) => {
    await page.goto("/examples");
    const search = page.getByPlaceholder("Search examples...");
    await search.fill("sin(x)");

    await expect(page.getByText("Solve ∫ x² sin(x) dx")).toBeVisible();
    await expect(page.getByText("Solve 2x + 5 = 17")).toBeHidden();
  });
});
