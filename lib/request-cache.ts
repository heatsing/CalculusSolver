import type { SolverResult } from "@/types/solver";

export class RequestCache<T> {
  private cache = new Map<string, { value: T; insertedAt: number }>();
  private ttlMs: number;
  private maxEntries: number;

  constructor(ttlMs = 5 * 60 * 1000, maxEntries = 50) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.insertedAt > this.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value as string | undefined;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { value, insertedAt: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const solveCache = new RequestCache<SolverResult>(5 * 60 * 1000, 50);
