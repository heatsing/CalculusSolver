import { expect, test } from "@playwright/test";

test("solves through /api/solve from the homepage", async ({ page }) => {
  await page.route("**/api/solve", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          answer: "x^2 + 4*x + 4",
          steps: [{ title: "本地验证", detail: "已通过 /api/solve 返回统一成功响应。" }],
          local: {
            normalizedInput: "(x+2)^2",
            result: "x^2+4*x+4",
            graphPoints: [],
            warnings: []
          },
          source: "local-fallback"
        }
      })
    });
  });

  await page.goto("/");
  await page.getByLabel("数学表达式或方程").fill("(x+2)^2");
  await page.getByRole("button", { name: "求解并验证" }).click();

  await expect(page.getByText("x^2 + 4*x + 4")).toBeVisible();
  await expect(page.getByText("已通过 /api/solve 返回统一成功响应。")).toBeVisible();
});

test("exposes dedicated solver pages", async ({ page }) => {
  await page.goto("/calculus-solver");
  await expect(page.getByRole("heading", { name: "求导、积分、极限和函数图像。" })).toBeVisible();

  await page.goto("/algebra-solver");
  await expect(page.getByRole("heading", { name: "化简表达式、解方程并验证代数结果。" })).toBeVisible();
});
