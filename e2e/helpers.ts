import type { Page, Disposable } from "@playwright/test";
import type { SolverResult } from "@/types/solver";

export const mockResult: SolverResult = {
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
      rule: "Operation detection",
      latexBefore: undefined,
      latexAfter: undefined
    },
    {
      number: 2,
      title: "Apply the power rule",
      explanation: "Bring down the exponent and subtract one from it.",
      rule: "Power rule",
      latexBefore: "x^2",
      latexAfter: "2x"
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

export const mockGraphResult: SolverResult = {
  ...mockResult,
  graph: {
    available: true,
    expression: "x^2",
    variable: "x",
    domain: [-10, 10],
    title: "Graph of x^2"
  }
};

export function mockSolveRoute(page: Page): Promise<Disposable> {
  return page.route("**/api/solve", async (route) => {
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
}

/**
 * Fill the math input using React-compatible native value setter.
 * Works across chromium, webkit, and mobile browsers where `fill` alone
 * may not trigger React's onChange.
 */
export async function fillInput(page: Page, text: string): Promise<void> {
  const input = page.locator("#math-problem-input");
  await input.click();
  await input.evaluate((el: HTMLTextAreaElement, val: string) => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    setter?.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, text);
}

export async function submitProblem(page: Page): Promise<void> {
  await page.locator('[aria-label="Solve"]').click();
}

export async function fillAndSubmit(page: Page, text: string): Promise<void> {
  await fillInput(page, text);
  await submitProblem(page);
}
