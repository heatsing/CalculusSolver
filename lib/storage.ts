import type { SolverResult } from "@/types/solver";

export const HISTORY_KEY = "calculus-solver-history-v2";
export const HISTORY_KEY_V1 = "calculus-solver-history-v1";
export const HISTORY_CHANGE_EVENT = "calculus-solver:history-change";
export const HISTORY_LIMIT = 50;

export type HistoryItem = {
  id: string;
  createdAt: string;
  input: string;
  mode: string;
  result: SolverResult;
};

type LegacyHistoryItem = {
  id: string;
  createdAt: string;
  input: string;
  mode: string;
  result: unknown;
};

function parseHistory(raw: string | null): HistoryItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is LegacyHistoryItem =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.createdAt === "string" &&
          typeof item.input === "string" &&
          typeof item.mode === "string" &&
          "result" in item
      )
      .map((item) => ({ ...item, result: item.result as SolverResult }));
  } catch {
    return [];
  }
}

function normalizeHistory(items: HistoryItem[]): HistoryItem[] {
  const seen = new Set<string>();

  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((left, right) => {
      const leftTime = Date.parse(left.createdAt);
      const rightTime = Date.parse(right.createdAt);
      return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
    })
    .slice(0, HISTORY_LIMIT);
}

function notifyHistoryChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT));
}

export function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const current = parseHistory(window.localStorage.getItem(HISTORY_KEY));
    const legacy = parseHistory(window.localStorage.getItem(HISTORY_KEY_V1));

    if (legacy.length > 0) {
      const merged = normalizeHistory([...current, ...legacy]);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
      window.localStorage.removeItem(HISTORY_KEY_V1);
      notifyHistoryChange();
      return merged;
    }

    return normalizeHistory(current);
  } catch {
    return [];
  }
}

export function writeHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(normalizeHistory(items)));
  notifyHistoryChange();
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  const items = readHistory();
  const next = items.filter((item) => item.id !== id);
  writeHistory(next);
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
  notifyHistoryChange();
}
