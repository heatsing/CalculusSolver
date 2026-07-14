import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/algebra-solver",
  "/calculus-calculator",
  "/daily-challenge",
  "/derivative-calculator",
  "/integral-calculator",
  "/definite-integral-calculator",
  "/limit-calculator",
  "/asymptote-calculator",
  "/equation-solver",
  "/quadratic-solver",
  "/factoring-calculator",
  "/inequality-calculator",
  "/system-of-equations-calculator",
  "/complex-numbers-calculator",
  "/long-division-calculator",
  "/pythagorean-theorem-calculator",
  "/sequence-calculator",
  "/sum-of-series-calculator",
  "/examples",
  "/calculators",
  "/guides",
  "/about",
  "/contact",
  "/privacy",
  "/terms"
];

const sampleRoutes = ["/", "/calculus-calculator", "/derivative-calculator"];

async function getMetaContent(page: import("@playwright/test").Page, name: string): Promise<string | null> {
  return page.evaluate((n) => {
    const el = document.querySelector(`meta[name="${n}"]`);
    return el?.getAttribute("content") ?? null;
  }, name);
}

async function getOgContent(page: import("@playwright/test").Page, property: string): Promise<string | null> {
  return page.evaluate((p) => {
    const el = document.querySelector(`meta[property="og:${p}"]`);
    return el?.getAttribute("content") ?? null;
  }, property);
}

async function getTwitterContent(page: import("@playwright/test").Page, name: string): Promise<string | null> {
  return page.evaluate((n) => {
    const el = document.querySelector(`meta[name="twitter:${n}"]`);
    return el?.getAttribute("content") ?? null;
  }, name);
}

async function waitForMetaTags(page: import("@playwright/test").Page): Promise<void> {
  await page.waitForFunction(() => {
    const title = document.title?.trim();
    const desc = document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
    return title && title.length > 0 && desc && desc.length > 0;
  }, { timeout: 15000 });
}

test.describe("SEO crawler", () => {
  test("home page uses the approved title and description", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForMetaTags(page);

    await expect(page).toHaveTitle("Free Calculus Solver with Steps | Derivatives & Integrals");
    expect(await getMetaContent(page, "description")).toBe(
      "Calculus Solver – Solve Your Problems Quickly."
    );
  });

  test("every route has a unique title and description", async ({ page }) => {
    test.setTimeout(120000);
    const seen = new Map<string, string>();

    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForMetaTags(page);
      const title = await page.title();
      const description = await getMetaContent(page, "description");

      expect(title.trim().length, `Empty title on ${route}`).toBeGreaterThan(0);
      expect(description?.trim().length ?? 0, `Empty description on ${route}`).toBeGreaterThan(0);
      expect(description, `Domain-style brand found in description on ${route}`).not.toMatch(/CalculusSolver\.net/i);

      const key = `${title}::${description}`;
      expect(seen.has(key), `Duplicate title/description on ${route} (already on ${seen.get(key)})`).toBe(false);
      seen.set(key, route);
    }
  });

  test("canonical and Open Graph tags are present on sample routes", async ({ page }) => {
    test.setTimeout(60000);
    for (const route of sampleRoutes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForMetaTags(page);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toBeAttached();
      const canonicalHref = await canonical.getAttribute("href");
      expect(canonicalHref, `Canonical mismatch on ${route}`).toContain(route);

      expect(await getOgContent(page, "title"), `Missing og:title on ${route}`).toBeTruthy();
      expect(await getOgContent(page, "description"), `Missing og:description on ${route}`).toBeTruthy();
      expect(await getOgContent(page, "url"), `Missing og:url on ${route}`).toBeTruthy();
      expect(await getOgContent(page, "image"), `Missing og:image on ${route}`).toContain("/og-image.png");
      expect(await getOgContent(page, "site_name"), `Missing og:site_name on ${route}`).toBeTruthy();
      expect(await getOgContent(page, "type"), `Missing og:type on ${route}`).toBeTruthy();

      expect(await getTwitterContent(page, "card"), `Missing twitter:card on ${route}`).toBeTruthy();
      expect(await getTwitterContent(page, "title"), `Missing twitter:title on ${route}`).toBeTruthy();
      expect(await getTwitterContent(page, "description"), `Missing twitter:description on ${route}`).toBeTruthy();
      expect(await getTwitterContent(page, "image"), `Missing twitter:image on ${route}`).toContain("/og-image.png");
    }
  });

  test("sitemap is valid and contains all routes", async ({ page }) => {
    const response = await page.request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    const locations = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);

    expect(locations.length).toBeGreaterThan(0);
    expect(new Set(locations).size, "Duplicate URLs in sitemap").toBe(locations.length);

    for (const route of routes) {
      expect(locations.some((url) => url.endsWith(route)), `Missing route ${route} in sitemap`).toBe(true);
    }

    const origins = new Set(locations.map((url) => new URL(url).origin));
    expect(origins.size, "Sitemap contains mixed origins").toBe(1);
  });

  test("robots meta and robots.txt are crawlable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const robotsMeta = await getMetaContent(page, "robots");
    expect(robotsMeta?.toLowerCase() ?? "").toContain("index");
    expect(robotsMeta?.toLowerCase() ?? "").toContain("follow");

    const response = await page.request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("Sitemap:");
  });

  test("structured data includes WebSite and SoftwareApplication", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#homepage-faq-schema")).toBeAttached();
    await expect(page.locator("#homepage-how-to-schema")).toBeAttached();

    const structured = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
        try {
          return JSON.parse(script.textContent ?? "");
        } catch {
          return null;
        }
      });
    });

    const types = structured
      .filter((item): item is Record<string, unknown> => item !== null)
      .map((item) => item["@type"]);

    expect(types).toContain("WebSite");
    expect(types).toContain("SoftwareApplication");
    expect(types).toContain("FAQPage");
    expect(types).toContain("HowTo");

    const app = structured.find(
      (item): item is Record<string, unknown> => item !== null && item["@type"] === "SoftwareApplication"
    );
    expect(app).toBeDefined();
    expect(app).toHaveProperty("applicationCategory");
    expect(app).toHaveProperty("applicationSubCategory");
    expect(app).toHaveProperty("operatingSystem");
    expect(app).toHaveProperty("offers");
    expect(app).toHaveProperty("featureList");
    expect(app).not.toHaveProperty("aggregateRating");
  });
});
