# Multi-Role UX Audit & Fix Cycle Plan

## Summary
Execute a structured usability and quality audit of the Calculus Solver Next.js web app by simulating five distinct user roles: first-time visitor, returning user, mobile user, accessibility user, and SEO crawler. For each role, identify friction points, rank them by severity, fix the highest-impact issues, and re-test until no significant usability problems remain. Testing will be automated with Playwright and axe-core; visual regression and Lighthouse checks provide additional gates.

## Current State Analysis
- The app is a Next.js 15.5 project with a math input, symbolic/AI solver, step-by-step results, graphs, history, and multiple SEO landing pages.
- Recent redesign changed the visual system to a non-AI navy/serif aesthetic, but several UX gaps remain.
- Existing E2E tests cover only basic home navigation and one mocked solve flow.
- A previously recorded overflow artifact (`screenshots/overflow-issues.json`) indicates a known mobile layout regression.
- Vercel Web Interface Guidelines were fetched and used as the compliance baseline.

## Proposed Changes

### Phase A — Critical/P0 fixes
1. **Icon-only button labels**
   - Files: `components/solver/smart-input.tsx`, `components/layout/header.tsx`, `components/solver/graph-card.tsx`
   - What: Add `aria-label` to submit arrow, header menu, graph zoom/reset/download buttons.
   - Why: Screen-reader users cannot identify these controls.

2. **Skip link to main content**
   - File: `app/layout.tsx`
   - What: Add a visible "Skip to main content" link targeting `<main>`.
   - Why: Keyboard users currently tab through the entire header/hero on every page.

3. **Mobile overflow regression**
   - Files: `components/solver/solver-shell.tsx`, `components/solver/answer-card.tsx`, `components/math/math-display.tsx`
   - What: Add `overflow-x-hidden`, `min-w-0`, `break-words`; ensure KaTeX blocks scroll or wrap.
   - Why: Documented horizontal overflow at 320 px breaks the mobile experience.

4. **History drawer nested interactions**
   - File: `components/solver/history-drawer.tsx`
   - What: Separate delete button from select row, make delete always focusable, add `aria-describedby`.
   - Why: Nested interactive controls violate accessibility and make touch targets unreliable.

5. **Unique metadata per tool route**
   - Files: all `app/*-solver/page.tsx` and `app/*-calculator/page.tsx`
   - What: Pass distinct `title`, `description`, and `path` to `createMetadata` for each route.
   - Why: Currently tool pages may share thin/generic metadata, hurting crawlability.

6. **Remove or disable non-functional Image input mode**
   - File: `components/solver/smart-input.tsx`
   - What: Hide the Image tab until OCR is implemented, or make it clearly disabled.
   - Why: A selectable dead-end confuses first-time visitors.

### Phase B — High/P1 fixes
7. **Persistent input label**
   - File: `components/solver/smart-input.tsx`
   - What: Add a visible `<label htmlFor="math-problem-input">` linked to the textarea.
   - Why: Placeholders disappear while typing; first-time visitors lose context.

8. **Share-link auto-submit**
   - Files: `components/solver/share-button.tsx`, `components/solver/solver-shell.tsx`
   - What: Include `example` param when relevant; when `?q=` is present, auto-submit on load.
   - Why: Returning users expect shared links to reproduce the full result.

9. **Respect prefers-reduced-motion**
   - Files: `app/globals.css`, `tailwind.config.ts`
   - What: Disable fade/slide animations and reduce spinner motion under the media query.
   - Why: Accessibility users may experience motion sickness.

10. **Live-region announcements**
    - Files: `components/solver/solver-shell.tsx`, `components/solver/steps-card.tsx`
    - What: Add `aria-live="polite"` status text for loading and step explanations; move focus to new content.
    - Why: Screen-reader users are not notified when async content appears.

11. **Heading hierarchy**
    - Files: `components/marketing/hero.tsx`, page files
    - What: Ensure exactly one `<h1>` per page; tool pages should not duplicate H1 from Hero and calculator page.
    - Why: SEO crawlers and screen-reader users rely on a clear outline.

12. **Open Graph image and footer links**
    - Files: `lib/seo.ts`, `public/og-image.png`, `components/layout/footer.tsx`
    - What: Add a default 1200x630 OG image; replace footer placeholder links with real routes or remove them.
    - Why: Incomplete social previews and dead footer links reduce trust.

13. **Sheet accessibility**
    - Files: `components/ui/sheet.tsx`, `components/solver/history-drawer.tsx`
    - What: Add `aria-labelledby` referencing the visible sheet title.
    - Why: Screen readers need a labelled dialog context.

### Phase C — Medium/P2 polish
14. **Keyboard shortcut to focus input**
    - File: new `hooks/use-keyboard-shortcut.ts`, `components/solver/smart-input.tsx`
    - What: `Cmd/Ctrl + K` or `/` focuses the textarea.
    - Why: Returning users expect quick keyboard navigation.

15. **Mobile symbol keyboard footprint**
    - Files: `components/solver/symbol-keyboard.tsx`, `components/solver/smart-input.tsx`
    - What: Default keyboard closed on viewports <= 640 px; reduce button density.
    - Why: The keyboard currently obscures results on small screens.

16. **MathLive virtual keyboard on mobile**
    - File: `components/solver/math-field-input.tsx`
    - What: Disable MathLive's built-in virtual keyboard on mobile; rely on the custom symbol keyboard.
    - Why: Two keyboards fight for screen space and push content off-screen.

17. **History cap and LRU eviction**
    - File: `hooks/use-solver-history.ts`
    - What: Limit history to 50 items; evict oldest. Add a brief privacy note.
    - Why: Unbounded localStorage can degrade performance and raise privacy concerns.

18. **Enrich structured data**
    - File: `lib/seo.ts`
    - What: Add `operatingSystem`, `applicationSubCategory`, optional `aggregateRating`.
    - Why: Richer SoftwareApplication schema improves SERP presentation.

## Testing & Verification
1. **Playwright project expansion**
   - Update `playwright.config.ts` to include Chromium desktop, WebKit desktop, Pixel 7, and iPhone 14.
   - Install `@axe-core/playwright` as a dev dependency.

2. **New E2E specs**
   - `e2e/first-time-visitor.spec.ts`: hero/input visibility, empty-submit error, no dead-end Image tab.
   - `e2e/returning-user.spec.ts`: history drawer select/delete, share URL auto-submit.
   - `e2e/mobile.spec.ts`: no horizontal overflow, keyboard defaults closed, touch targets >= 44 px.
   - `e2e/accessibility.spec.ts`: axe-core scan, skip link, heading order, keyboard-only solve flow.
   - `e2e/seo.spec.ts`: unique titles/descriptions, canonical/OG tags, sitemap validity.

3. **Visual regression**
   - Regenerate baselines for home idle/result, `/calculus-solver` result, `/examples`, and mobile breakpoints.
   - Add `npm run test:visual` using the existing `scripts/audit-screenshots.mjs`.

4. **Quality gates**
   - `npm run typecheck` passes with zero errors.
   - `npm run test` passes.
   - `npm run test:e2e` passes for all Playwright projects.
   - Lighthouse: Accessibility >= 95, Best Practices >= 90, SEO >= 95.
   - axe-core: zero critical or serious violations.

## Assumptions & Decisions
- The AI backend (DeepSeek) is treated as unavailable for E2E tests; all role tests use the existing `mockSolveRoute` pattern.
- The Image input mode has no OCR backend, so it will be hidden rather than left as a dead-end.
- The OG image will be generated as a simple branded 1200x630 PNG; no dynamic OG generation is required.
- Touch-target minimum is 44x44 CSS px per WCAG 2.5.5 (AAA) and Apple HIG.
- `prefers-reduced-motion` support is implemented via CSS media query rather than JavaScript state.
- All remaining verification uses the existing Node/Playwright/Vitest/TypeScript stack; no Python tooling is introduced.

## Phase D — Complete the E2E Spec Suite

### D1. Create `e2e/mobile.spec.ts`

**Goal**: Validate the mobile-specific UX fixes from Phases A-C and ensure no regression on the documented `calculus-result` overflow.

**Test cases**:

1. **No horizontal overflow at 320 px on idle and result pages**
   - Visit `/`, `/calculus-solver`, `/algebra-solver`, `/derivative-calculator`, `/examples`.
   - Submit a problem on `/` and `/calculus-solver` using `mockSolveRoute`.
   - Evaluate `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
   - If overflow exists, collect offenders (tag/class/width) and fail.

2. **Symbol keyboard defaults closed on mobile**
   - On Pixel 7 and iPhone 14, load `/`.
   - Assert the "Math keyboard" toggle shows "Show" (i.e., keyboard is collapsed).
   - Tap the toggle and assert "Hide" plus visible symbol buttons.

3. **Math symbol buttons meet touch target**
   - Query all symbol buttons inside `SymbolKeyboard`.
   - Assert each bounding box height and width >= 44 px.

4. **History drawer works on touch**
   - Seed `localStorage` with one history item, open History, select the row, assert input populated.
   - Open History again, tap delete, assert the row is removed.

5. **Header mobile menu opens**
   - Tap the header menu button, assert the sheet is visible with Calculus/Algebra/Examples links.

6. **Share URL auto-submits on mobile**
   - Visit `/?q=derivative%20of%20x%5E2` on Pixel 7, assert result appears.

**Implementation notes**:
- Use `test.describe("Mobile user", () => { test.use({ ...devices["Pixel 7"] }); ... })` and a parallel block for iPhone 14, or rely on Playwright projects and let the same test run across both.
- Re-use `mockSolveRoute(page)` and dispose after each test with `await mockSolveRoute(page);` pattern (Playwright route is auto-disposed when page closes, but explicit `use` helper is cleaner).

### D2. Create `e2e/accessibility.spec.ts`

**Goal**: Verify axe-core compliance and keyboard/screen-reader flows.

**Test cases**:

1. **axe-core scan on key routes**
   - Routes: `/`, `/calculus-solver`, `/algebra-solver`, `/derivative-calculator`, `/examples`.
   - Use `new AxeBuilder({ page }).analyze()` from `@axe-core/playwright`.
   - Assert `violations` array has zero items with `impact === 'critical'` or `impact === 'serious'`.
   - Allow listing minor (`moderate`/`minor`) violations for triage but fail on critical/serious.

2. **Skip link**
   - On `/`, send `Tab` once.
   - Assert the "Skip to main content" link is visible and has `href="#main-content"`.
   - Press Enter, assert focus moves into `main#main-content`.

3. **Heading hierarchy**
   - On each route, count `h1` elements; assert exactly one.
   - Assert `h2`/`h3` do not skip levels (optional: use `page.evaluate` to check `headingOrder`).

4. **Keyboard-only solve flow**
   - On `/`, press `/` to focus input, type `derivative of x^2`, press Enter.
   - Assert result heading becomes visible.
   - Assert focus is moved into the result region (or at least Tab order reaches the answer card).

5. **Icon-only buttons are named**
   - Query buttons with no visible text (graph zoom/download, header menu, smart-input submit) and assert each has non-empty accessible name.

6. **Live region and reduced motion**
   - Submit a problem; assert `div#solver-result` has `aria-live="polite"` and `aria-busy` toggles.
   - Emulate `prefers-reduced-motion: reduce` via `page.emulateMedia({ reducedMotion: 'reduce' })` and assert no motion-induced layout failures.

**Implementation notes**:
- Add `import AxeBuilder from "@axe-core/playwright";`.
- For route scans, first wait for network idle or key content to avoid false positives on loading skeletons.

### D3. Create `e2e/seo.spec.ts`

**Goal**: Verify metadata, canonical/OG, sitemap, and structured data.

**Test cases**:

1. **Unique title and description per route**
   - Routes: `/`, `/calculus-solver`, `/algebra-solver`, `/derivative-calculator`, `/integral-calculator`, `/limit-calculator`, `/equation-solver`, `/quadratic-solver`, `/factoring-calculator`, `/examples`, `/privacy`, `/terms`.
   - Assert each page has a non-empty, route-specific `<title>` and `<meta name="description">`.
   - Assert no two tested routes share the exact same title/description pair.

2. **Canonical and Open Graph tags**
   - For a sample of routes, assert:
     - `<link rel="canonical" href="...">` matches the path.
     - `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:type` are present.
     - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` are present.

3. **Sitemap validity**
   - Fetch `/sitemap.xml`.
   - Parse XML and assert every route in `app/sitemap.ts` is present.
   - Assert no duplicates and all URLs use the configured base URL.

4. **Robots meta**
   - Assert `<meta name="robots" content="index, follow">` on key pages.
   - Fetch `/robots.txt` and assert it allows `/` and disallows `/api/`.

5. **Structured data**
   - Assert at least one `<script type="application/ld+json">` exists on `/`.
   - Parse and assert `@type` includes `WebSite` and `SoftwareApplication`.
   - Assert `SoftwareApplication` contains `applicationCategory`, `applicationSubCategory`, `operatingSystem`, `offers`, and `aggregateRating`.

**Implementation notes**:
- Use `page.goto` and `page.locator('meta[property="og:title"]').getAttribute('content')` for meta assertions.
- For sitemap, use `page.request().get('/sitemap.xml')` and a lightweight XML parser or regex.

### D4. Update `e2e/solver.spec.ts`

**Goal**: Remove duplication, expand coverage, and align with the new helper.

**Changes to make**:

1. **Remove duplicated mock fixtures**
   - Delete the local `mockResult` and `mockSolveRoute` in `solver.spec.ts`.
   - Import from `e2e/helpers.ts`:
     ```ts
     import { mockSolveRoute, mockResult } from "./helpers";
     ```

2. **Keep/adjust existing tests**
   - "home page loads and shows the solver"
   - "navigation links work"
   - "submitting a problem shows the mocked result"
   - "all steps are visible without clicking"
   - "examples page search filters the list"

3. **Add new tests**
   - **History persistence**: seed `localStorage` with `calculus-solver-history-v2`, reload, open History drawer, assert item appears and selecting it populates the input.
   - **Cancel loading state**: mock a delayed solve response, click cancel, assert loading state clears.
   - **Error retry**: mock a 500 response, assert error card, click retry, then mock success and assert result.
   - **Graph card rendering**: extend `mockResult` in helpers or create a graph variant where `graph.available = true`, `expression = "x^2"`, `variable = "x"`, `domain = [-10, 10]`; assert zoom/reset/download buttons are visible and the Plotly canvas renders.

4. **Stabilize selectors**
   - Replace `page.locator("[aria-label='Math problem input']")` with `page.locator("#math-problem-input")` to match the current `SmartInput` implementation.

**Implementation notes**:
- For delayed/error mocks, create small inline route handlers rather than modifying `mockSolveRoute` so the shared helper stays simple.
- For graph testing, keep `mockResult` immutable and create a `mockGraphResult` helper.

## Phase E — Execute Tests and Fix Findings

### E1. Run the full test matrix

Commands (run in project root):

```bash
npm run typecheck
npm run test
npx playwright install --with-deps   # if not already installed
npm run test:e2e
```

- Run E2E locally first on all four projects.
- On CI, rely on `retries: 2` and `workers: 1` already configured.

### E2. Expected findings and fixes

Based on the current code, anticipate at least these issues:

1. **History storage cap mismatch**
   - `use-solver-history.ts` caps at 50; `lib/storage.ts` `writeHistory` caps at 12.
   - **Fix**: align `writeHistory` to 50 to match the plan and LRU intent.

2. **`solver.spec.ts` selector drift**
   - The test still uses `[aria-label='Math problem input']`, but `SmartInput` now exposes `id="math-problem-input"`.
   - **Fix**: update selectors in `solver.spec.ts` to `#math-problem-input`.

3. **Possible mobile overflow on result pages**
   - `screenshots/overflow-issues.json` already reports overflow at 320 px for `calculus-result`.
   - **Fix**: ensure `min-w-0`, `break-words`, `overflow-x-auto` are applied to result cards and KaTeX blocks. The current `solver-shell.tsx` has `overflow-x-hidden` on the result wrapper, but child grids may still force width; add `min-w-0` to all flex/grid children and verify `MathDisplay` block rendering uses `overflow-x-auto`.

4. **axe-core heading/order or button-name issues**
   - If any marketing component introduces multiple `h1`s or icon buttons without labels, fix per Phase A items 1 and 11.

5. **SEO canonical base URL mismatch between dev and production**
   - `createMetadata` uses `process.env.NEXT_PUBLIC_APP_URL` fallback to `http://localhost:3000` in `lib/seo.ts` but `https://calculussolver.net` in `app/sitemap.ts` and `app/robots.ts`.
   - **Fix**: use a single source of truth in `lib/seo.ts` and import it into `sitemap.ts`/`robots.ts`, or document that tests should validate path suffixes rather than absolute origin.

### E3. Iterate fix/test cycle

For each failure:
1. Reproduce locally with the failing project.
2. Apply the minimal fix in source code.
3. Re-run only the affected spec/project first (`npx playwright test e2e/mobile.spec.ts --project=mobile-chrome`).
4. Re-run the full E2E suite.

## Phase F — Final Verification Gates

Run and confirm all gates pass:

| Gate | Command | Success Criteria |
|---|---|---|
| TypeScript | `npm run typecheck` | Zero errors. |
| Unit tests | `npm run test` | All Vitest tests pass. |
| E2E tests | `npm run test:e2e` | All specs pass across all 4 projects (with retries on CI). |
| axe-core | via `accessibility.spec.ts` | Zero critical/serious violations. |
| Lighthouse | `npm run build && npx lighthouse http://localhost:3000 --output=json` (or Lighthouse CI) | Accessibility >= 95, Best Practices >= 90, SEO >= 95. |
| Visual regression | `npm run test:visual` (using `scripts/audit-screenshots.mjs`) | No unexpected overflows; regenerate baselines if approved. |

**Lighthouse specifics**:
- Build first (`npm run build`) so metadata and sitemap are production-like.
- Start the production server (`npm start`) on a separate port if needed, or use the built output via `next start`.
- Run Lighthouse against `/`, `/calculus-solver`, `/derivative-calculator`, and `/examples`.
- If Lighthouse scores are below gates, address:
  - **Accessibility**: color contrast, touch targets, aria labels.
  - **Best Practices**: HTTPS, image aspect ratios, CSP.
  - **SEO**: canonical, mobile viewport, title/description, hreflang.

## Deliverables

After completion, the project should contain:
- `e2e/mobile.spec.ts`
- `e2e/accessibility.spec.ts`
- `e2e/seo.spec.ts`
- Updated `e2e/solver.spec.ts`
- Any source fixes required to make the above pass
- Updated `screenshots/` baselines if visual regression changed
- Passing typecheck, unit tests, E2E tests, axe-core, and Lighthouse gates
