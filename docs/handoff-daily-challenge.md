# Handoff: Daily Mixed Challenge

## Summary
The Daily Mixed Challenge feature is fully implemented, tested, and ready for deployment. It provides a deterministic daily math challenge with progressive hints, scoring, streak tracking, and localStorage persistence — all client-side with no server dependency.

## Architecture

### Date Rule
- **UTC-based deterministic selection**: `getDayNumber()` calculates days since 2026-01-01 UTC, then `dayNumber % challenges.length` selects the challenge.
- All users worldwide see the same challenge on the same UTC day.
- Refreshing the page on the same day always shows the same challenge.

### Game Flow
1. User visits `/daily-challenge`
2. Hook loads today's challenge + saved progress + saved stats from localStorage
3. If saved progress is for a different day, it's discarded and a fresh game starts
4. User submits guesses or skips to reveal hints
5. Wrong guess advances hint stage by 1
6. Skip advances hint stage by 1 and costs 18 points
7. Game ends on correct answer (win) or max guesses reached (lose)
8. Stats are recorded with anti-duplicate logic (same-day completion doesn't re-increment)

### Scoring
- Base: 100 points
- Hint penalty: -12 per hint revealed (wrong guesses + skips)
- Skip penalty: -18 per skip (additional, on top of hint penalty)
- Minimum: 10 points

### Limits
- Max hints: 6
- Max guesses: 7 (6 hints + final guess)

## File Structure

```
data/
  daily-challenges.ts          # 24 challenges, 6 hints each

lib/
  daily-challenge.ts           # Date utils, selection, scoring, storage, share text

hooks/
  use-daily-challenge.ts       # React hook: state management + actions

components/
  daily-challenge/
    daily-challenge-game.tsx   # Full game UI (loading/error/playing/won/lost)

app/
  daily-challenge/
    page.tsx                   # Server shell: metadata, FAQ, header/footer

tests/
  daily-challenge.test.ts      # 42 unit tests (Vitest)

e2e/
  daily-challenge.spec.ts      # 11 E2E tests (Playwright, 4 projects)
```

## Storage Keys
- `calculus-solver-daily-progress-v1` — Current day's progress (dateKey, challengeId, hintStage, guesses, status, score)
- `calculus-solver-daily-stats-v1` — Lifetime stats (currentStreak, maxStreak, totalPlayed, totalWon, lastPlayedDateKey)

## Anti-Duplicate Logic
`recordCompletion()` checks if `stats.lastPlayedDateKey === today's dateKey`. If so, it only updates `lastStatus` without incrementing counters. This prevents refresh-after-completion from inflating stats.

## Streak Logic
- Win after yesterday's win → streak + 1
- Win after yesterday's loss or gap > 1 day → streak = 1
- Loss → streak = 0

## Share Text
Does not reveal the answer. Contains:
- Day number
- Win/lose emoji
- Hint usage as emoji grid (💡⚫)
- Score
- Streak
- Play URL

## Testing Results

### Unit Tests (Vitest)
- 42/42 pass
- Coverage: date logic, answer normalization, scoring, storage read/write, anti-duplicate stats, share text generation

### E2E Tests (Playwright)
- 11 tests × 4 browser projects = 44 test runs
- Projects: chromium-desktop, webkit-desktop, mobile-chrome, mobile-safari
- Coverage: page load, wrong answer hint, skip hint, progress persistence, countdown, streak/wins display, nav link, mobile overflow, keyboard submit, lose condition, share button

### Accessibility
- axe-core scans pass on all routes including /daily-challenge
- Fixed pre-existing color-contrast violation on /calculus-calculator (text-body/70 → text-body)

## Decisions Made

### 1. Removed aria-labels from game buttons
**Context**: Buttons had `aria-label` attributes that differed from visible text (e.g., "Check" button had `aria-label="Submit answer"`).
**Decision**: Removed all aria-labels. Visible text is now the accessible name.
**Rationale**: Best practice is visible text = accessible name. Different values confuse voice control users (Dragon, Voice Control) who see "Check" but must say "click Submit answer". The visible texts ("Check", "Reveal hint", "Share", "Try again") are sufficiently descriptive in context.

### 2. data-testid for stat elements
**Context**: `getByText(/streak/)` matched 5 elements (FAQ, description, stat).
**Decision**: Added `data-testid="daily-streak"` and `data-testid="daily-wins"`.
**Rationale**: More robust than text matching; survives copy changes.

### 3. UTC-based date selection
**Context**: Needed a unified date rule so all users see the same challenge.
**Decision**: UTC midnight boundaries.
**Rationale**: Simplest, most consistent globally. Countdown timer shows time until next UTC midnight.

### 4. globalThis instead of window
**Context**: Vitest runs in Node environment where `window` is undefined.
**Decision**: All storage functions use `globalThis.localStorage`.
**Rationale**: `globalThis` works in both browser and Node. No need for environment-specific code.

## Known Limitations
1. **Challenge pool size**: 24 challenges. After 24 days, the cycle repeats. To extend, add more entries to `data/daily-challenges.ts`.
2. **Timezone**: Challenge changes at UTC midnight, not local midnight. Users in timezones far from UTC may see the new challenge at an unexpected local time.
3. **No server sync**: Progress is device-local only. Switching devices starts fresh.
4. **No global leaderboard**: By design (per requirements).

## Future Work (Not Implemented)
- Expand challenge pool beyond 24
- Add difficulty filtering
- Add weekly/monthly stats view
- Add export/import of stats
- Consider local-midnight option for timezone flexibility
