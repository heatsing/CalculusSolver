import { test, expect } from "@playwright/test";
import { guides } from "@/data/guides";

test.describe("Learning guides", () => {
  test("guides index links to every real guide and calculator", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.getByRole("heading", { name: "Calculus and Algebra Guides" })).toBeVisible();
    await expect(page.getByText("Featured guide", { exact: true })).toBeVisible();

    for (const guide of guides) {
      await expect(page.locator(`a[href="/guides/${guide.slug}"]`).first(), `Missing article link for ${guide.slug}`).toBeVisible();
      await expect(page.locator(`a[href="${guide.calculator.href}"]`).first(), `Missing calculator link for ${guide.slug}`).toBeVisible();
    }
  });

  test("every guide has complete learning content and structured data", async ({ page }) => {
    test.setTimeout(120000);
    const titles = new Set<string>();
    for (const guide of guides) {
      const response = await page.goto(`/guides/${guide.slug}`, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Bad status for ${guide.slug}`).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: guide.title })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "What you will learn" })).toBeVisible();
      await expect(page.locator("#worked-example").getByText("Worked example", { exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Common mistakes" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Open calculator" })).toHaveAttribute("href", guide.calculator.href);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(titles.has(title), `Duplicate guide title: ${title}`).toBe(false);
      titles.add(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", guide.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/guides/${guide.slug}$`));

      const types = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap((element) => {
        try {
          const value = JSON.parse(element.textContent ?? "") as { "@type"?: string | string[] };
          return Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
        } catch {
          return [];
        }
      }));
      expect(types).toContain("LearningResource");
      expect(types).toContain("Article");
      expect(types).toContain("BreadcrumbList");
    }
  });

  test("index exposes collection data and sitemap includes every guide", async ({ page }) => {
    await page.goto("/guides");
    const types = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((element) => {
      try { return (JSON.parse(element.textContent ?? "") as { "@type"?: string })["@type"]; } catch { return null; }
    }));
    expect(types).toContain("CollectionPage");

    const sitemap = await page.request.get("/sitemap.xml");
    const xml = await sitemap.text();
    for (const guide of guides) expect(xml).toContain(`/guides/${guide.slug}`);
  });

  test("guides remain usable at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/guides", `/guides/${guides[0].slug}`]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflows, `Horizontal overflow on ${path}`).toBe(false);
    }
  });

  test("production CSP permits the active Umami gateway", async ({ page }) => {
    const response = await page.request.get("/guides");
    expect(response.headers()["content-security-policy"]).toContain("https://gateway.umami.is");
  });
});
