import { test, expect, type Page } from "@playwright/test";

async function fillInputReact(page: Page, text: string): Promise<void> {
  const input = page.locator("#daily-guess-input");
  await input.fill(text);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("calculus-solver-daily-progress-v1");
    localStorage.removeItem("calculus-solver-daily-stats-v1");
  });
});

test.describe("Daily Challenge", () => {
  test("page loads and shows the challenge", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.getByRole("heading", { name: /Calculus Solve Problems/ })).toBeVisible();
    await expect(page.getByText(/Daily Challenge.*Day/)).toBeVisible({ timeout: 10000 });
    await expect(page.locator("#daily-guess-input")).toBeVisible();
  });

  test("wrong answer reveals a hint", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/Hints \(1\/6\)/)).not.toBeVisible();

    await fillInputReact(page, "definitely_wrong_answer");
    await page.getByRole("button", { name: "Submit Answer" }).click();

    await expect(page.getByText(/Hints \(1\/6\)/)).toBeVisible({ timeout: 5000 });
  });

  test("skip button reveals a hint", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /Reveal hint/ }).click();

    await expect(page.getByText(/Hints \(1\/6\)/)).toBeVisible({ timeout: 5000 });
  });

  test("progress persists across reload", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await fillInputReact(page, "wrong");
    await page.getByRole("button", { name: "Submit Answer" }).click();
    await expect(page.getByText(/Hints \(1\/6\)/)).toBeVisible({ timeout: 5000 });

    await page.reload();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/Hints \(1\/6\)/)).toBeVisible({ timeout: 5000 });
  });

  test("countdown timer is displayed", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/Next challenge in/)).toBeVisible();
    await expect(page.getByTestId("daily-countdown")).toHaveText(/\d{2}:\d{2}:\d{2}/);
  });

  test("streak and wins are displayed", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await expect(page.getByTestId("daily-streak")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("daily-wins")).toBeVisible({ timeout: 5000 });
  });

  test("daily challenge is linked from the shared footer", async ({ page }) => {
    await page.goto("/");
    const navLink = page.getByRole("contentinfo").getByRole("link", { name: "Daily Challenge" });
    await expect(navLink).toBeVisible({ timeout: 5000 });
    await navLink.click();
    await expect(page).toHaveURL("/daily-challenge", { timeout: 10000 });
  });

  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/daily-challenge", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflows).toBe(false);
  });

  test("keyboard can submit answer", async ({ page }) => {
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    await page.locator("#daily-guess-input").focus();
    await page.keyboard.type("wrong_answer");
    await page.keyboard.press("Enter");

    await expect(page.getByText(/Hints \(1\/6\)/)).toBeVisible({ timeout: 5000 });
  });

  test("multiple wrong guesses eventually lose", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    for (let i = 0; i < 7; i++) {
      const input = page.locator("#daily-guess-input");
      const stillVisible = await input.isVisible().catch(() => false);
      if (!stillVisible) break;

      await fillInputReact(page, `wrong_${i}`);
      await page.getByRole("button", { name: "Submit Answer" }).click();
      await page.waitForTimeout(300);
    }

    const lostHeading = page.getByRole("heading", { name: "Not solved" });
    const wonHeading = page.getByRole("heading", { name: "Solved!" });
    await expect(lostHeading.or(wonHeading)).toBeVisible({ timeout: 5000 });
  });

  test("share button appears after completion", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/daily-challenge");
    await expect(page.locator("#daily-guess-input")).toBeVisible({ timeout: 10000 });

    for (let i = 0; i < 7; i++) {
      const input = page.locator("#daily-guess-input");
      const stillVisible = await input.isVisible().catch(() => false);
      if (!stillVisible) break;

      await fillInputReact(page, `wrong_${i}`);
      await page.getByRole("button", { name: "Submit Answer" }).click();
      await page.waitForTimeout(300);
    }

    await expect(page.getByRole("button", { name: "Share" })).toBeVisible({ timeout: 5000 });
  });
});
