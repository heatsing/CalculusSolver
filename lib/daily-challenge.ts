import { dailyChallenges, type DailyChallenge } from "@/data/daily-challenges";

// ============================================================
// Date Utilities (unified UTC-based rule)
// ============================================================

export function getTodayKey(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayNumber(date: Date = new Date()): number {
  const epoch = Date.UTC(2026, 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - epoch) / 86_400_000);
}

export function getMsUntilNextDay(date: Date = new Date()): number {
  const tomorrow = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
  return tomorrow - date.getTime();
}

// ============================================================
// Deterministic Daily Challenge Selection
// ============================================================

export function getDailyChallenge(date: Date = new Date()): DailyChallenge {
  const dayNum = getDayNumber(date);
  const index = ((dayNum % dailyChallenges.length) + dailyChallenges.length) % dailyChallenges.length;
  return dailyChallenges[index];
}

export function getDailyChallengeByDateKey(dateKey: string): DailyChallenge | null {
  const challenge = dailyChallenges.find((c) => {
    const dayNum = getDayNumber(new Date(dateKey + "T00:00:00Z"));
    const index = ((dayNum % dailyChallenges.length) + dailyChallenges.length) % dailyChallenges.length;
    return dailyChallenges[index].id === c.id;
  });
  return challenge ?? null;
}

// ============================================================
// Answer Normalization & Checking
// ============================================================

export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\u00b2/g, "^2")
    .replace(/\u00b3/g, "^3")
    .replace(/\u2212/g, "-")
    .replace(/\u00d7/g, "*")
    .replace(/\u00f7/g, "/")
    .replace(/\u03c0/g, "pi")
    .replace(/\*\*/g, "^")
    .replace(/(\d)([a-z(])/g, "$1*$2")
    .replace(/±/g, "+-")
    .trim();
}

export function checkAnswer(userInput: string, challenge: DailyChallenge): boolean {
  const normalized = normalizeAnswer(userInput);
  if (!normalized) return false;

  for (const acceptable of challenge.acceptableAnswers) {
    if (normalizeAnswer(acceptable) === normalized) return true;
  }

  // Also check the canonical answer
  if (normalizeAnswer(challenge.answer) === normalized) return true;

  return false;
}

// ============================================================
// Scoring
// ============================================================

export const BASE_SCORE = 100;
export const HINT_PENALTY = 12;
export const SKIP_PENALTY = 18;
export const MIN_SCORE = 10;

export function calculateScore(hintsRevealed: number, skipsUsed: number): number {
  const deduction = hintsRevealed * HINT_PENALTY + skipsUsed * SKIP_PENALTY;
  return Math.max(BASE_SCORE - deduction, MIN_SCORE);
}

// ============================================================
// Storage Types
// ============================================================

export type DailyChallengeStatus = "playing" | "won" | "lost";

export type DailyChallengeProgress = {
  dateKey: string;
  challengeId: string;
  hintStage: number;
  skipsUsed: number;
  status: DailyChallengeStatus;
  score: number;
  guesses: string[];
  completedAt: string | null;
};

export type DailyChallengeStats = {
  currentStreak: number;
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
  lastPlayedDateKey: string | null;
  lastStatus: DailyChallengeStatus | null;
};

// ============================================================
// Storage Keys
// ============================================================

const PROGRESS_KEY = "calculus-solver-daily-progress-v1";
const STATS_KEY = "calculus-solver-daily-stats-v1";

// ============================================================
// Progress Storage
// ============================================================

export function readProgress(): DailyChallengeProgress | null {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) return null;
  try {
    const raw = globalThis.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyChallengeProgress;
    if (!parsed.dateKey || !parsed.challengeId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeProgress(progress: DailyChallengeProgress): void {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) return;
  try {
    globalThis.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // storage full or unavailable
  }
}

export function clearProgress(): void {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) return;
  try {
    globalThis.localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // ignore
  }
}

// ============================================================
// Stats Storage
// ============================================================

const DEFAULT_STATS: DailyChallengeStats = {
  currentStreak: 0,
  maxStreak: 0,
  totalPlayed: 0,
  totalWon: 0,
  lastPlayedDateKey: null,
  lastStatus: null
};

export function readStats(): DailyChallengeStats {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) return DEFAULT_STATS;
  try {
    const raw = globalThis.localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as DailyChallengeStats;
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function writeStats(stats: DailyChallengeStats): void {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) return;
  try {
    globalThis.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

/**
 * Record a completed game in stats.
 * Anti-duplicate: only increments if lastPlayedDateKey !== today's dateKey.
 * Streak logic: if yesterday was a win, increment streak; if gap > 1 day, reset to 0.
 */
export function recordCompletion(
  stats: DailyChallengeStats,
  dateKey: string,
  status: DailyChallengeStatus
): DailyChallengeStats {
  // Prevent duplicate counting for the same day
  if (stats.lastPlayedDateKey === dateKey) {
    return {
      ...stats,
      lastStatus: status
    };
  }

  const yesterdayKey = getYesterdayKey(dateKey);
  const wasStreakActive = stats.lastPlayedDateKey === yesterdayKey && stats.lastStatus === "won";

  const newCurrentStreak = status === "won" ? (wasStreakActive ? stats.currentStreak + 1 : 1) : 0;

  return {
    currentStreak: newCurrentStreak,
    maxStreak: Math.max(stats.maxStreak, newCurrentStreak),
    totalPlayed: stats.totalPlayed + 1,
    totalWon: stats.totalWon + (status === "won" ? 1 : 0),
    lastPlayedDateKey: dateKey,
    lastStatus: status
  };
}

function getYesterdayKey(dateKey: string): string {
  const d = new Date(dateKey + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return getTodayKey(d);
}

// ============================================================
// Share Text (does not reveal the answer)
// ============================================================

export function generateShareText(
  dayNumber: number,
  status: DailyChallengeStatus,
  hintsUsed: number,
  score: number,
  streak: number
): string {
  const emoji = status === "won" ? "🎉" : "😅";
  const hintsEmoji = "💡".repeat(Math.min(hintsUsed, 6));
  const emptyEmoji = "⚫".repeat(Math.max(0, 6 - hintsUsed));

  return [
    `Calculus Solver Daily Challenge — Day ${dayNumber}`,
    `${emoji} ${status === "won" ? "Solved" : "Not solved"}`,
    `Hints: ${hintsEmoji}${emptyEmoji} (${hintsUsed}/6)`,
    `📊 Score: ${score}`,
    `🔥 Streak: ${streak}`,
    `Play at ${process.env.NEXT_PUBLIC_APP_URL ?? "https://calculussolver.net"}/daily-challenge`
  ].join("\n");
}

// ============================================================
// Constants
// ============================================================

export const MAX_HINTS = 6;
export const MAX_GUESSES = 7; // 6 hints + final guess
