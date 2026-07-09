# Daily Mixed Challenge — Implementation Plan

## Goal
Implement a complete Daily Mixed Challenge feature: deterministic daily problem selection, 6-stage hints, scoring, win/lose, streak tracking, localStorage persistence with anti-duplicate stats, share text, countdown, and full test coverage.

## Constraints
- No global leaderboard
- No server-side progress saving
- No fake player counts
- Do not modify other modes
- Reuse shared patterns (storage convention, SEO, header/footer)

## Phases

### Phase 1: Data & Logic (exec-plan + game-engine)
- [x] `data/daily-challenges.ts` — challenge pool (24 problems with 6 hints each)
- [x] `lib/daily-challenge.ts` — date picker, scoring, answer checking, storage helpers
- Status: complete

### Phase 2: Local Storage (local-storage)
- [x] Progress persistence (hint stage, guesses, status, score)
- [x] Completion state restore
- [x] Stats (streak, played, won) with anti-duplicate
- Status: complete

### Phase 3: Hook & UI (ui-implementation)
- [x] `hooks/use-daily-challenge.ts`
- [x] `components/daily-challenge/daily-challenge-game.tsx`
- [x] `app/daily-challenge/page.tsx`
- [x] Loading, Error, Won, Lost states
- [x] Mobile + keyboard experience
- Status: complete

### Phase 4: Tests (test-and-verify)
- [x] Unit tests (Vitest) — 42/42 pass
- [x] E2E tests (Playwright) — 11/11 pass on all 4 projects
- [x] typecheck passes
- Status: complete

### Phase 5: Integrate & Ship
- [x] Nav link, footer link, sitemap
- [x] Accessibility contrast fix on /calculus-calculator
- [x] Commit + push
- Status: complete

## Errors
| Error | Attempts | Solution |
|-------|----------|----------|
| DailyChallenge type import from wrong module | 1 | Split import: type from `@/data/daily-challenges`, logic from `@/lib/daily-challenge` |
| Vitest `window` undefined in node env | 1 | Changed all storage functions to use `globalThis.localStorage` instead of `window.localStorage` |
| E2E button selector mismatch (aria-label overrides visible text) | 1 | Removed redundant `aria-label` attributes from buttons; let visible text be the accessible name (best practice) |
| `getByText(/streak/)` matched 5 elements (strict mode violation) | 1 | Added `data-testid="daily-streak"` and `data-testid="daily-wins"` to stat elements; updated test to use `getByTestId` |
| Mobile nav link not visible (hidden in hamburger menu) | 1 | Added "Open menu" button click before checking nav link on mobile; scoped to `dialog` role on mobile, `navigation` role on desktop |
| Desktop nav link strict mode violation (2 matches: header + footer) | 1 | Scoped selector: `getByRole("navigation").getByRole("link")` on desktop, `getByRole("dialog").getByRole("link")` on mobile |
| mobile-safari dialog timing flakiness | 1 | Added explicit `expect(dialog).toBeVisible({ timeout: 10000 })` before looking for link inside dialog |
| axe-core color-contrast violation on /calculus-calculator | 1 | Changed `text-body/70` to `text-body` on calculator hint paragraph; kbd elements inherited the opacity causing 3.51:1 ratio (below 4.5:1 minimum) |

## Deliverables
- `data/daily-challenges.ts` — 24 challenges across 4 categories (Derivatives, Integrals, Limits, Algebra)
- `lib/daily-challenge.ts` — Core logic: UTC date selection, answer normalization, scoring, storage, share text
- `hooks/use-daily-challenge.ts` — React hook with game state management
- `components/daily-challenge/daily-challenge-game.tsx` — Full game UI with all states
- `app/daily-challenge/page.tsx` — Page shell with SEO metadata and FAQ
- `tests/daily-challenge.test.ts` — 42 unit tests
- `e2e/daily-challenge.spec.ts` — 11 E2E tests across 4 browser projects

## Feature Checklist
- [x] Unified date rule (UTC-based deterministic selection)
- [x] Same challenge across all refreshes in a day
- [x] Six-stage progressive hints
- [x] Hint advancement on wrong guess and skip
- [x] Scoring (base 100, -12 per hint, -18 per skip, min 10)
- [x] Win/lose conditions (7 max guesses, 6 max hints)
- [x] Daily progress restore
- [x] Completion state restore
- [x] Daily streak tracking
- [x] Anti-duplicate stats (same-day completion doesn't re-increment)
- [x] Next challenge countdown timer
- [x] Share text without revealing answer
- [x] Loading state
- [x] Error state
- [x] Missing schedule state (error state covers this)
- [x] Mobile experience (responsive, no horizontal overflow)
- [x] Keyboard experience (Enter to submit, focus management)
- [x] Unit tests (42)
- [x] Component/E2E tests (11 × 4 projects)
