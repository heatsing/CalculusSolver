"use client";

import * as React from "react";
import {
  HISTORY_CHANGE_EVENT,
  HISTORY_KEY,
  readHistory,
  writeHistory,
  clearHistory,
  deleteHistoryItem,
  type HistoryItem
} from "@/lib/storage";
import type { SolverResult } from "@/types/solver";

export function useSolverHistory() {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    function syncHistory(): void {
      setHistory(readHistory());
    }

    function handleStorage(event: StorageEvent): void {
      if (event.key === null || event.key === HISTORY_KEY) {
        syncHistory();
      }
    }

    setMounted(true);
    syncHistory();
    window.addEventListener(HISTORY_CHANGE_EVENT, syncHistory);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(HISTORY_CHANGE_EVENT, syncHistory);
      window.removeEventListener("storage", handleStorage);
    };
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
    const next = [item, ...readHistory()];
    writeHistory(next);
  }

  function remove(id: string): void {
    deleteHistoryItem(id);
  }

  function clear(): void {
    clearHistory();
  }

  return { history: mounted ? history : [], add, remove, clear };
}
