import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mockGraphResult, mockSolveRoute, fillAndSubmit, fillInput } from "./helpers";

const routesToScan = ["/", "/calculus-solver", "/algebra-solver", "/derivative-calculator", "/examples"];

test.describe("Accessibility user", () => {
  test("axe-core scans have no critical or serious violations", async ({ page }) => {
    test.setTimeout(120000);
    for (const route of routesToScan) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(800);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      const severe = accessibilityScanResults.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );
      expect(severe, `Critical/serious a11y violations on ${route}: ${severe.map((v) => v.help).join(", ")}`).toHaveLength(0);
    }
  });

  test("skip link is visible and moves focus to main content", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-chrome" || testInfo.project.name === "mobile-safari",
      "Skip link uses Tab key, which is not standard on mobile"
    );
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    await skipLink.press("Enter");
    const focusedId = await page.evaluate(() => document.activeElement?.id ?? "");
    expect(focusedId).toBe("main-content");
  });

  test("each route has exactly one h1 and no skipped heading levels within main", async ({ page }) => {
    test.setTimeout(120000);
    for (const route of routesToScan) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);

      const headings = await page.evaluate(() => {
        const main = document.getElementById("main-content") ?? document.body;
        return Array.from(main.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) => ({
          level: Number.parseInt(el.tagName[1], 10),
          text: el.textContent?.slice(0, 40) ?? ""
        }));
      });

      const h1Count = headings.filter((h) => h.level === 1).length;
      expect(h1Count, `Expected one h1 on ${route}, found ${h1Count}`).toBe(1);

      for (let i = 1; i < headings.length; i++) {
        expect(
          headings[i].level,
          `Heading level skip on ${route}: "${headings[i].text}" (${headings[i].level}) after "${headings[i - 1].text}" (${headings[i - 1].level})`
        ).toBeLessThanOrEqual(headings[i - 1].level + 1);
      }
    }
  });

  test("keyboard-only solve flow focuses input and result", async ({ page }) => {
    await mockSolveRoute(page);
    await page.goto("/");
    await expect(page.locator("#math-problem-input")).toBeVisible();
    await page.locator("body").click();

    await page.keyboard.press("/");
    await expect(page.locator("#math-problem-input")).toBeFocused();

    await fillInput(page, "derivative of x^2");
    await page.locator("#math-problem-input").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Step-by-step solution" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#solver-result")).toBeFocused();
  });

  test("icon-only buttons have accessible names", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: "success", requestId: "e2e-a11y", result: mockGraphResult })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    await expect(page.locator('[aria-label="Solve"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Open history" })).toBeVisible();

    await fillAndSubmit(page, "derivative of x^2");
    await expect(page.locator(".plotly").first()).toBeVisible({ timeout: 20000 });

    for (const name of ["Zoom in", "Zoom out", "Reset view", "Download graph"]) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("solver result region announces busy state", async ({ page }) => {
    await page.route("**/api/solve", async (route) => {
      if (route.request().method() === "POST") {
        await new Promise((resolve) => setTimeout(resolve, 600));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ status: "success", requestId: "e2e-busy", result: mockGraphResult })
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/");
    const resultRegion = page.locator("#solver-result");
    await expect(resultRegion).toHaveAttribute("aria-live", "polite");
    await expect(resultRegion).toHaveAttribute("aria-busy", "false");

    await fillAndSubmit(page, "derivative of x^2");
    await expect(resultRegion).toHaveAttribute("aria-busy", "true", { timeout: 2000 });
    await expect(resultRegion).toHaveAttribute("aria-busy", "false", { timeout: 10000 });
  });

  test("prefers-reduced-motion does not cause layout failures", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflows).toBe(false);
  });
});
