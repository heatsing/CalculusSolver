import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  HISTORY_CHANGE_EVENT,
  HISTORY_KEY,
  HISTORY_KEY_V1,
  HISTORY_LIMIT,
  clearHistory,
  readHistory,
  writeHistory,
  type HistoryItem
} from "@/lib/storage";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function historyItem(id: string, createdAt: string): HistoryItem {
  return {
    id,
    createdAt,
    input: `problem ${id}`,
    mode: "auto",
    result: {
      operation: "simplify",
      interpretedProblem: `problem ${id}`,
      interpretedLatex: id,
      answer: id,
      answerLatex: id,
      answerType: "exact",
      steps: [],
      aiVerification: { status: "verified", explanation: "" },
      localVerification: { status: "verified", explanation: "" },
      graph: { available: false, expression: null, variable: "x", domain: null },
      machine: {
        source_expression: id,
        answer_expression: id,
        variable: "x",
        equation_left: null,
        equation_right: null,
        solutions: [],
        lower_bound: null,
        upper_bound: null,
        limit_point: null,
        limit_direction: null
      },
      warnings: []
    }
  };
}

describe("solver history storage", () => {
  let localStorage: MemoryStorage;
  let events: EventTarget;

  beforeEach(() => {
    localStorage = new MemoryStorage();
    events = new EventTarget();
    vi.stubGlobal("window", {
      localStorage,
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
      dispatchEvent: events.dispatchEvent.bind(events)
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("merges v1 and v2 history before removing the legacy key", () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([historyItem("current", "2026-07-29T00:00:00.000Z")]));
    localStorage.setItem(HISTORY_KEY_V1, JSON.stringify([historyItem("legacy", "2026-07-28T00:00:00.000Z")]));

    expect(readHistory().map((item) => item.id)).toEqual(["current", "legacy"]);
    expect(localStorage.getItem(HISTORY_KEY_V1)).toBeNull();
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]")).toHaveLength(2);
  });

  it("deduplicates, sorts, and keeps the configured history limit", () => {
    const items = Array.from({ length: HISTORY_LIMIT + 5 }, (_, index) =>
      historyItem(String(index), new Date(Date.UTC(2026, 6, 1, 0, index)).toISOString())
    );

    writeHistory([items[0], ...items, items[0]]);

    const stored = readHistory();
    expect(stored).toHaveLength(HISTORY_LIMIT);
    expect(stored[0]?.id).toBe(String(HISTORY_LIMIT + 4));
    expect(new Set(stored.map((item) => item.id)).size).toBe(HISTORY_LIMIT);
  });

  it("notifies same-page subscribers after writes and clears", () => {
    const listener = vi.fn();
    events.addEventListener(HISTORY_CHANGE_EVENT, listener);

    writeHistory([historyItem("one", "2026-07-29T00:00:00.000Z")]);
    clearHistory();

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
