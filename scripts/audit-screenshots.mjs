import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = path.resolve('screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const baseUrl = 'http://localhost:3000';

const viewports = [
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 }
];

const pages = [
  { name: 'home', path: '/' },
  { name: 'calculus-idle', path: '/calculus-solver' },
  { name: 'algebra-idle', path: '/algebra-solver' },
  { name: 'examples', path: '/examples' }
];

const mockResult = {
  status: 'success',
  requestId: 'audit',
  result: {
    operation: 'integral',
    interpretedProblem: 'integral of x squared times sine x',
    interpretedLatex: '\\int x^2 \\sin(x)\\, dx',
    answer: '-x^2 cos(x) + 2x sin(x) + 2 cos(x) + C',
    answerLatex: '-x^2\\cos(x) + 2x\\sin(x) + 2\\cos(x) + C',
    answerType: 'exact',
    steps: [
      { number: 1, title: 'Identify integration by parts', explanation: 'Use integration by parts with u = x^2 and dv = sin(x) dx.', rule: 'Integration by parts' },
      { number: 2, title: 'Differentiate and integrate', explanation: 'Compute du = 2x dx and v = -cos(x).', rule: 'Power rule' },
      { number: 3, title: 'Apply formula and repeat', explanation: 'Substitute into the by-parts formula and integrate by parts again.', rule: 'Integration by parts' }
    ],
    aiVerification: { status: 'verified', explanation: 'Checked by differentiation.' },
    localVerification: { status: 'partially_verified', explanation: 'Derivative of the result matches the integrand after symbolic simplification.' },
    graph: { available: false, expression: null, variable: 'x', domain: null },
    machine: { source_expression: 'x^2*sin(x)', answer_expression: '-x^2*cos(x)+2*x*sin(x)+2*cos(x)', variable: 'x', equation_left: null, equation_right: null, solutions: [], lower_bound: null, upper_bound: null, limit_point: null, limit_direction: null },
    warnings: []
  }
};

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const html = document.documentElement;
    const hasOverflow = html.scrollWidth > html.clientWidth;
    const offenders = [];
    if (hasOverflow) {
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.width > html.clientWidth + 1) {
          offenders.push({ tag: el.tagName, class: el.className.slice(0, 120), id: el.id, width: Math.round(rect.width) });
          if (offenders.length >= 15) break;
        }
      }
    }
    return { scrollWidth: html.scrollWidth, clientWidth: html.clientWidth, hasOverflow, offenders };
  });
}

const browser = await chromium.launch({ headless: true });
const issues = [];

for (const vp of viewports) {
  for (const pg of pages) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${pg.path}`, { waitUntil: 'networkidle', timeout: 120000 });
    const overflow = await checkOverflow(page);
    if (overflow.hasOverflow) {
      issues.push({ viewport: vp.name, page: pg.name, overflow });
    }
    const filename = `${pg.name}-${vp.name}.png`;
    await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
    await context.close();
  }

  for (const resultPage of ['home', 'calculus']) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.route('**/api/solve', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResult) });
      } else {
        await route.continue();
      }
    });
    const pathName = resultPage === 'home' ? '/' : '/calculus-solver';
    await page.goto(`${baseUrl}${pathName}`, { waitUntil: 'networkidle', timeout: 120000 });
    const input = page.locator("[aria-label='Math problem input']");
    if (await input.isVisible().catch(() => false)) {
      await input.fill('integral of x^2 sin(x)');
      await input.press('Enter');
      try {
        await page.getByText('Answer', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
        await page.waitForTimeout(500);
        const filename = `${resultPage}-result-${vp.name}.png`;
        await page.screenshot({ path: path.join(OUT, filename), fullPage: true });
        const overflow = await checkOverflow(page);
        if (overflow.hasOverflow) {
          issues.push({ viewport: vp.name, page: `${resultPage}-result`, overflow });
        }
      } catch {
        console.log(`Result did not appear for ${resultPage} ${vp.name}`);
      }
    }
    await context.close();
  }
}

await browser.close();

fs.writeFileSync(path.join(OUT, 'overflow-issues.json'), JSON.stringify(issues, null, 2));
console.log('Screenshots saved to', OUT);
console.log('Overflow issues:', issues.length);
