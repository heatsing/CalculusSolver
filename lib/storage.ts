import type { SolverResult } from "@/types/solver";

export const HISTORY_KEY = "calculus-solver-history-v2";
export const HISTORY_KEY_V1 = "calculus-solver-history-v1";

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

function migrateV1History(): HistoryItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY_V1);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const migrated = parsed
      .filter(
        (item): item is LegacyHistoryItem =>
          item && typeof item === "object" && "id" in item && "createdAt" in item && "input" in item && "mode" in item
      )
      .map((item) => ({ ...item, result: item.result as SolverResult }));
    window.localStorage.removeItem(HISTORY_KEY_V1);
    return migrated;
  } catch {
    return null;
  }
}

export function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const migrated = migrateV1History();
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      if (migrated && migrated.length > 0) {
        writeHistory(migrated);
        return migrated;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function writeHistory(items: HistoryItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 12)));
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
}
