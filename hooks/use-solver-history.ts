"use client";

import * as React from "react";
import { readHistory, writeHistory, clearHistory, type HistoryItem } from "@/lib/storage";

export function useSolverHistory() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setHistory(readHistory());
  }, []);

  function add(input: string, mode: string, result: unknown): void {
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

  function clear(): void {
    setHistory([]);
    clearHistory();
  }

  return { history: mounted ? history : [], add, clear };
}
