import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getTodayKey,
  getDayNumber,
  getMsUntilNextDay,
  getDailyChallenge,
  normalizeAnswer,
  checkAnswer,
  calculateScore,
  recordCompletion,
  generateShareText,
  readProgress,
  writeProgress,
  readStats,
  writeStats,
  BASE_SCORE,
  HINT_PENALTY,
  SKIP_PENALTY,
  MIN_SCORE,
  MAX_HINTS,
  MAX_GUESSES,
  type DailyChallengeStats,
  type DailyChallengeStatus
} from "@/lib/daily-challenge";
import { dailyChallenges } from "@/data/daily-challenges";

// ============================================================
// Date Utilities
// ============================================================

describe("getTodayKey", () => {
  it("returns a YYYY-MM-DD string in UTC", () => {
    const key = getTodayKey(new Date("2026-07-09T15:30:00Z"));
    expect(key).toBe("2026-07-09");
  });

  it("handles month/year boundaries", () => {
    expect(getTodayKey(new Date("2026-12-31T23:59:59Z"))).toBe("2026-12-31");
    expect(getTodayKey(new Date("2027-01-01T00:00:01Z"))).toBe("2027-01-01");
  });

  it("uses UTC not local time", () => {
    // 2026-07-09 23:30 UTC is 2026-07-10 in UTC+2
    const key = getTodayKey(new Date("2026-07-09T23:30:00Z"));
    expect(key).toBe("2026-07-09");
  });
});

describe("getDayNumber", () => {
  it("returns 0 for the epoch date", () => {
    expect(getDayNumber(new Date("2026-01-01T00:00:00Z"))).toBe(0);
  });

  it("increments by 1 per day", () => {
    expect(getDayNumber(new Date("2026-01-02T00:00:00Z"))).toBe(1);
    expect(getDayNumber(new Date("2026-01-10T00:00:00Z"))).toBe(9);
  });
});

describe("getMsUntilNextDay", () => {
  it("returns positive milliseconds until next UTC midnight", () => {
    const ms = getMsUntilNextDay(new Date("2026-07-09T12:00:00Z"));
    expect(ms).toBe(12 * 3_600_000);
  });

  it("returns small value near midnight", () => {
    const ms = getMsUntilNextDay(new Date("2026-07-09T23:59:00Z"));
    expect(ms).toBeLessThan(120_000);
    expect(ms).toBeGreaterThan(0);
  });
});

// ============================================================
// Daily Challenge Selection
// ============================================================

describe("getDailyChallenge", () => {
  it("returns a challenge from the pool", () => {
    const challenge = getDailyChallenge(new Date("2026-07-09T00:00:00Z"));
    expect(dailyChallenges).toContain(challenge);
  });

  it("returns the same challenge for the same day regardless of time", () => {
    const morning = getDailyChallenge(new Date("2026-07-09T06:00:00Z"));
    const evening = getDailyChallenge(new Date("2026-07-09T23:00:00Z"));
    expect(morning.id).toBe(evening.id);
  });

  it("returns a different challenge for different days (eventually)", () => {
    const day1 = getDailyChallenge(new Date("2026-07-09T00:00:00Z"));
    const day2 = getDailyChallenge(new Date("2026-07-10T00:00:00Z"));
    // They might be the same if pool length divides evenly, but at least one day in the cycle should differ
    const ids = new Set<string>();
    for (let i = 0; i < dailyChallenges.length; i++) {
      ids.add(getDailyChallenge(new Date(Date.UTC(2026, 0, 1 + i))).id);
    }
    expect(ids.size).toBe(dailyChallenges.length);
  });
});

// ============================================================
// Answer Normalization & Checking
// ============================================================

describe("normalizeAnswer", () => {
  it("removes whitespace", () => {
    expect(normalizeAnswer("2 * x")).toBe("2*x");
    expect(normalizeAnswer("  cos ( x )  ")).toBe("cos(x)");
  });

  it("converts unicode symbols", () => {
    expect(normalizeAnswer("x²")).toBe("x^2");
    expect(normalizeAnswer("x³")).toBe("x^3");
    expect(normalizeAnswer("π")).toBe("pi");
  });

  it("converts ** to ^", () => {
    expect(normalizeAnswer("x**2")).toBe("x^2");
  });

  it("is case-insensitive", () => {
    expect(normalizeAnswer("COS(X)")).toBe("cos(x)");
  });
});

describe("checkAnswer", () => {
  const challenge = dailyChallenges.find((c) => c.id === "deriv-x-squared")!;

  it("accepts the canonical answer", () => {
    expect(checkAnswer("2*x", challenge)).toBe(true);
  });

  it("accepts acceptableAnswers variants", () => {
    expect(checkAnswer("2x", challenge)).toBe(true);
  });

  it("accepts with different spacing", () => {
    expect(checkAnswer("2 * x", challenge)).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(checkAnswer("3*x", challenge)).toBe(false);
    expect(checkAnswer("x^2", challenge)).toBe(false);
  });

  it("rejects empty input", () => {
    expect(checkAnswer("", challenge)).toBe(false);
    expect(checkAnswer("   ", challenge)).toBe(false);
  });
});

// ============================================================
// Scoring
// ============================================================

describe("calculateScore", () => {
  it("returns base score with no hints or skips", () => {
    expect(calculateScore(0, 0)).toBe(BASE_SCORE);
  });

  it("deducts for each hint", () => {
    expect(calculateScore(1, 0)).toBe(BASE_SCORE - HINT_PENALTY);
    expect(calculateScore(3, 0)).toBe(BASE_SCORE - 3 * HINT_PENALTY);
  });

  it("deducts for each skip", () => {
    expect(calculateScore(0, 1)).toBe(BASE_SCORE - SKIP_PENALTY);
    expect(calculateScore(0, 2)).toBe(BASE_SCORE - 2 * SKIP_PENALTY);
  });

  it("deducts for combined hints and skips", () => {
    expect(calculateScore(2, 1)).toBe(BASE_SCORE - 2 * HINT_PENALTY - SKIP_PENALTY);
  });

  it("never goes below minimum", () => {
    expect(calculateScore(MAX_HINTS, 5)).toBeGreaterThanOrEqual(MIN_SCORE);
  });
});

// ============================================================
// Stats & Anti-Duplicate
// ============================================================

describe("recordCompletion", () => {
  const baseStats: DailyChallengeStats = {
    currentStreak: 0,
    maxStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
    lastPlayedDateKey: null,
    lastStatus: null
  };

  it("increments played and won on first win", () => {
    const result = recordCompletion(baseStats, "2026-07-09", "won");
    expect(result.totalPlayed).toBe(1);
    expect(result.totalWon).toBe(1);
    expect(result.currentStreak).toBe(1);
    expect(result.maxStreak).toBe(1);
    expect(result.lastPlayedDateKey).toBe("2026-07-09");
    expect(result.lastStatus).toBe("won");
  });

  it("increments played but not won on loss", () => {
    const result = recordCompletion(baseStats, "2026-07-09", "lost");
    expect(result.totalPlayed).toBe(1);
    expect(result.totalWon).toBe(0);
    expect(result.currentStreak).toBe(0);
  });

  it("does NOT increment when same day is recorded twice", () => {
    const first = recordCompletion(baseStats, "2026-07-09", "won");
    const second = recordCompletion(first, "2026-07-09", "won");
    expect(second.totalPlayed).toBe(1);
    expect(second.totalWon).toBe(1);
  });

  it("extends streak when winning on consecutive days", () => {
    const day1 = recordCompletion(baseStats, "2026-07-08", "won");
    const day2 = recordCompletion(day1, "2026-07-09", "won");
    expect(day2.currentStreak).toBe(2);
    expect(day2.maxStreak).toBe(2);
  });

  it("resets streak when losing", () => {
    const day1 = recordCompletion(baseStats, "2026-07-08", "won");
    const day2 = recordCompletion(day1, "2026-07-09", "lost");
    expect(day2.currentStreak).toBe(0);
  });

  it("resets streak when skipping a day", () => {
    const day1 = recordCompletion(baseStats, "2026-07-07", "won");
    const day3 = recordCompletion(day1, "2026-07-09", "won");
    expect(day3.currentStreak).toBe(1);
  });

  it("updates maxStreak when current exceeds it", () => {
    let stats = baseStats;
    stats = recordCompletion(stats, "2026-07-07", "won");
    stats = recordCompletion(stats, "2026-07-08", "won");
    stats = recordCompletion(stats, "2026-07-09", "won");
    expect(stats.currentStreak).toBe(3);
    expect(stats.maxStreak).toBe(3);
  });
});

// ============================================================
// Share Text
// ============================================================

describe("generateShareText", () => {
  it("does not reveal the answer", () => {
    const challenge = dailyChallenges[0];
    const text = generateShareText(100, "won", 2, 76, 3);
    expect(text).not.toContain(challenge.answer);
    expect(text).not.toContain(challenge.answerLatex);
    expect(text).not.toContain(challenge.problem);
  });

  it("includes day number, status, hints, score, and streak", () => {
    const text = generateShareText(42, "won", 3, 64, 5);
    expect(text).toContain("Day 42");
    expect(text).toContain("Solved");
    expect(text).toContain("3/6");
    expect(text).toContain("64");
    expect(text).toContain("5");
  });

  it("shows different message for lost status", () => {
    const text = generateShareText(42, "lost", 6, 0, 0);
    expect(text).toContain("Not solved");
  });
});

// ============================================================
// Storage (mocked localStorage)
// ============================================================

describe("storage helpers", () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
    });
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });
  });

  it("writes and reads progress", () => {
    const progress = {
      dateKey: "2026-07-09",
      challengeId: "test-id",
      hintStage: 2,
      skipsUsed: 1,
      status: "playing" as DailyChallengeStatus,
      score: 0,
      guesses: ["wrong"],
      completedAt: null
    };
    writeProgress(progress);
    const read = readProgress();
    expect(read).toEqual(progress);
  });

  it("returns null when no progress exists", () => {
    expect(readProgress()).toBeNull();
  });

  it("writes and reads stats", () => {
    const stats: DailyChallengeStats = {
      currentStreak: 3,
      maxStreak: 5,
      totalPlayed: 10,
      totalWon: 7,
      lastPlayedDateKey: "2026-07-08",
      lastStatus: "won"
    };
    writeStats(stats);
    const read = readStats();
    expect(read).toEqual(stats);
  });

  it("returns default stats when none exist", () => {
    const read = readStats();
    expect(read.currentStreak).toBe(0);
    expect(read.totalPlayed).toBe(0);
  });
});

// ============================================================
// Constants
// ============================================================

describe("constants", () => {
  it("MAX_HINTS is 6", () => {
    expect(MAX_HINTS).toBe(6);
  });

  it("MAX_GUESSES is 7", () => {
    expect(MAX_GUESSES).toBe(7);
  });

  it("all challenges have exactly 6 hints", () => {
    for (const challenge of dailyChallenges) {
      expect(challenge.hints.length, `${challenge.id} should have 6 hints`).toBe(6);
    }
  });

  it("all challenges have at least one acceptable answer", () => {
    for (const challenge of dailyChallenges) {
      expect(challenge.acceptableAnswers.length, `${challenge.id} should have acceptable answers`).toBeGreaterThan(0);
    }
  });
});
