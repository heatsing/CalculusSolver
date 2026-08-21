import { chromium } from "@playwright/test";
import fs from "node:fs";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3210";
const browser = await chromium.launch({ headless: true });
const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
const routes = ["calculus-calculator", "derivative-calculator", "integral-calculator", "limit-calculator"];
const profiledRoutes = [
  "algebra-solver", "asymptote-calculator", "average-calculator", "definite-integral-calculator",
  "equation-solver", "exponent-calculator", "factoring-calculator", "fraction-calculator",
  "gradient-calculator", "graphing-calculator", "inequality-calculator", "lcm-calculator",
  "log-calculator", "long-division-calculator", "math-calculator", "matrix-calculator",
  "percentage-calculator", "probability-calculator", "pythagorean-theorem-calculator",
  "quadratic-solver", "root-calculator", "sequence-calculator", "simplify-calculator",
  "sum-of-series-calculator", "system-of-equations-calculator", "complex-numbers-calculator"
];
const solveInBrowser = new Set([
  "asymptote-calculator", "definite-integral-calculator", "factoring-calculator", "fraction-calculator",
  "gradient-calculator", "graphing-calculator", "matrix-calculator", "percentage-calculator",
  "pythagorean-theorem-calculator", "quadratic-solver", "sequence-calculator"
]);
const answers = {};

try {
  for (const route of routes) {
    await desktop.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });
    const calculator = desktop.locator('section[aria-label$="calculator"]').first();
    await calculator.getByRole("button", { name: "Calculate result" }).click();
    const output = calculator.locator("output");
    await output.waitFor({ state: "visible" });
    await desktop.waitForFunction(() => {
      const value = document.querySelector('section[aria-label$="calculator"] output')?.textContent?.trim();
      return Boolean(value && !["Ready", "Calculating…", "Error"].includes(value));
    });
    answers[route] = (await output.textContent())?.trim();
  }

  for (const route of profiledRoutes) {
    await desktop.setExtraHTTPHeaders({ "x-forwarded-for": `smoke-${route}` });
    await desktop.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });
    const calculator = desktop.locator('section[aria-label$="interactive calculator"]').first();
    await calculator.waitFor({ state: "visible" });
    if (!await calculator.locator("textarea").inputValue()) throw new Error(`${route} has no default input`);
    if (solveInBrowser.has(route)) {
      await calculator.getByRole("button", { name: "Calculate result" }).click();
      const output = calculator.locator("output");
      await desktop.waitForFunction(() => {
        const value = document.querySelector('section[aria-label$="interactive calculator"] output')?.textContent?.trim();
        return Boolean(value && !["Ready", "Calculating…", "Check input"].includes(value));
      });
      answers[route] = (await output.textContent())?.trim();
    }
  }

  fs.mkdirSync("artifacts", { recursive: true });
  await desktop.goto(`${baseUrl}/calculus-calculator`, { waitUntil: "networkidle" });
  await desktop.screenshot({ path: "artifacts/calculus-calculator-final.png", fullPage: true });
  await desktop.goto(`${baseUrl}/quadratic-solver`, { waitUntil: "networkidle" });
  await desktop.locator('section[aria-label$="interactive calculator"]').screenshot({ path: "artifacts/quadratic-calculator-shell.png" });
  await desktop.goto(`${baseUrl}/matrix-calculator`, { waitUntil: "networkidle" });
  await desktop.locator('section[aria-label$="interactive calculator"]').screenshot({ path: "artifacts/matrix-calculator-shell.png" });
  await desktop.goto(`${baseUrl}/1-2-as-a-percent-and-decimal`, { waitUntil: "networkidle" });
  await desktop.getByLabel("Numerator").fill("3");
  await desktop.getByLabel("Denominator").fill("8");
  await desktop.getByText("37.5%", { exact: true }).waitFor();
  await desktop.screenshot({ path: "artifacts/fraction-page-final.png", fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobile.goto(`${baseUrl}/fraction-calculator`, { waitUntil: "networkidle" });
  await mobile.locator('section[aria-label$="interactive calculator"]').screenshot({ path: "artifacts/fraction-calculator-mobile-shell.png" });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error("Mobile fraction calculator causes horizontal page overflow");
  await mobile.close();
  console.log(JSON.stringify({ ok: true, answers }, null, 2));
} finally {
  await desktop.close();
  await browser.close();
}
