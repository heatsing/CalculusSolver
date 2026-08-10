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
const indexedContent = [];

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

function routeForHtml(filePath) {
  const relative = path.relative(appDir, filePath).replaceAll("\\", "/").replace(/\.html$/, "");
  return relative === "index" ? "/" : `/${relative}`;
}

function collectHtml(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectHtml(fullPath));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

function plainText(html) {
  return decodeEntities(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function shingles(text, size = 5) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) result.add(words.slice(index, index + size).join(" "));
  return result;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return intersection / Math.max(1, left.size + right.size - intersection);
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
  const text = plainText(html);
  const textLength = text.length;

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
    try {
      const schema = JSON.parse(block);
      const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
      if (types.some((type) => ["WebPage", "WebApplication", "Article", "LearningResource", "CollectionPage"].includes(type)) && schema.url && schema.url !== canonical) {
        failures.push(`${route}: schema URL ${schema.url} does not match canonical ${canonical}`);
      }
    } catch { failures.push(`${route}: JSON-LD is not valid JSON`); }
  }
  indexedContent.push({ route, shingles: shingles(text) });
}

const sitemapRoutes = new Set(urls.map((url) => new URL(url).pathname));
const htmlFiles = collectHtml(appDir);
const generatedRoutes = new Set(htmlFiles.map(routeForHtml));

for (const filePath of htmlFiles) {
  const route = routeForHtml(filePath);
  if (route.startsWith("/_") || route === "/404" || route === "/500") continue;
  const html = fs.readFileSync(filePath, "utf8");
  const isNoindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  if (!sitemapRoutes.has(route) && !isNoindex) failures.push(`${route}: generated page is indexable but missing from sitemap`);

  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) {
    const target = match[1].split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (target.startsWith("/api/") || target.startsWith("/_next/")) continue;
    if (!generatedRoutes.has(target)) failures.push(`${route}: broken internal link to ${target}`);
  }
}

for (let left = 0; left < indexedContent.length; left += 1) {
  for (let right = left + 1; right < indexedContent.length; right += 1) {
    const similarity = jaccard(indexedContent[left].shingles, indexedContent[right].shingles);
    if (similarity >= 0.65) failures.push(`${indexedContent[left].route} and ${indexedContent[right].route}: high template similarity (${similarity.toFixed(2)})`);
  }
}

if (failures.length) {
  console.error(`SEO output check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO output check passed for ${urls.length} sitemap URLs.`);
