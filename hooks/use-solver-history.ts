"use client";

import * as React from "react";
import { readHistory, writeHistory, clearHistory, deleteHistoryItem, type HistoryItem } from "@/lib/storage";
import type { SolverResult } from "@/types/solver";

export function useSolverHistory() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setHistory(readHistory());
  }, []);

  function add(input: string, mode: string, result: SolverResult): void {
    if (typeof window === "undefined") return;
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      input,
      mode,
      result
    };
    const next = [item, ...history].slice(0, 12);
    setHistory(next);
    writeHistory(next);
  }

  function remove(id: string): void {
    const next = history.filter((item) => item.id !== id);
    setHistory(next);
    deleteHistoryItem(id);
  }

  function clear(): void {
    setHistory([]);
    clearHistory();
  }

  return { history: mounted ? history : [], add, remove, clear };
}
