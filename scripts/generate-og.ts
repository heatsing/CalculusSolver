import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const templatePath = path.resolve(__dirname, "og-template.html");
  await page.goto(`file://${templatePath}`);
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.resolve(__dirname, "..", "public", "og-image.png"),
    type: "png"
  });
  await browser.close();
  console.log("Generated public/og-image.png");
}

void main();
