import fs from "node:fs";
import path from "node:path";

const appDir = path.resolve(".next/server/app");
const sitemapPath = path.join(appDir, "sitemap.xml.body");
const failures = [];

if (!fs.existsSync(sitemapPath)) {
  throw new Error("Built sitemap is missing. Run next build before the SEO output check.");
}

const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const titles = new Map();
const descriptions = new Map();

function htmlPathFor(pathname) {
  return pathname === "/" ? path.join(appDir, "index.html") : path.join(appDir, `${pathname.slice(1)}.html`);
}

function decodeEntities(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
}

function recordUnique(map, value, route, label) {
  if (!value) return;
  const previous = map.get(value);
  if (previous) failures.push(`${route}: duplicate ${label} also used by ${previous}`);
  else map.set(value, route);
}

for (const url of urls) {
  const parsedUrl = new URL(url);
  const route = parsedUrl.pathname;
  const filePath = htmlPathFor(route);
  if (!fs.existsSync(filePath)) {
    failures.push(`${route}: sitemap URL has no generated HTML at ${path.relative(process.cwd(), filePath)}`);
    continue;
  }

  const html = fs.readFileSync(filePath, "utf8");
  const title = decodeEntities(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
  const description = decodeEntities(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const canonical = decodeEntities(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "");
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  const textLength = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

  if (!title) failures.push(`${route}: title is missing`);
  if (!description) failures.push(`${route}: meta description is missing`);
  if (h1Count !== 1) failures.push(`${route}: expected one server-rendered H1, found ${h1Count}`);
  if (canonical !== url.replace(/\/$/, "") && !(route === "/" && canonical === url.replace(/\/$/, ""))) {
    failures.push(`${route}: canonical ${canonical || "(missing)"} does not match sitemap URL ${url}`);
  }
  if (textLength < 300) failures.push(`${route}: server-rendered text is too thin (${textLength} characters)`);
  if (/\uFFFD|Ã|Â|脳|鈥|馃/.test(html)) failures.push(`${route}: encoding-corruption marker found in HTML`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) failures.push(`${route}: sitemap URL is marked noindex`);

  recordUnique(titles, title, route, "title");
  recordUnique(descriptions, description, route, "description");

  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  if (jsonLdBlocks.length === 0) failures.push(`${route}: JSON-LD is missing`);
  for (const block of jsonLdBlocks) {
    try { JSON.parse(block); } catch { failures.push(`${route}: JSON-LD is not valid JSON`); }
  }
}

if (failures.length) {
  console.error(`SEO output check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO output check passed for ${urls.length} sitemap URLs.`);
