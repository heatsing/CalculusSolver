"use client";

import * as React from "react";

export const FEEDBACK_KEY = "calculus-solver-result-feedback-v1";

export type ResultFeedbackValue = "up" | "down";

export type ResultFeedbackMap = Record<string, ResultFeedbackValue>;

function readFeedback(): ResultFeedbackMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as ResultFeedbackMap) : {};
  } catch {
    return {};
  }
}

function writeFeedback(map: ResultFeedbackMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map));
}

export function makeFeedbackKey(interpretedLatex: string, answerLatex: string): string {
  const raw = `${interpretedLatex.trim()}::${answerLatex.trim()}`;
  try {
    return btoa(unescape(encodeURIComponent(raw)));
  } catch {
    return raw;
  }
}

export function useResultFeedback() {
  const [feedbackMap, setFeedbackMap] = React.useState<ResultFeedbackMap>({});

  React.useEffect(() => {
    setFeedbackMap(readFeedback());
  }, []);

  function getFeedback(key: string): ResultFeedbackValue | null {
    return feedbackMap[key] ?? null;
  }

  function setFeedback(key: string, value: ResultFeedbackValue): void {
    setFeedbackMap((prev) => {
      const next = { ...prev, [key]: value };
      writeFeedback(next);
      return next;
    });
  }

  return { getFeedback, setFeedback };
}

export function getFeedbackStatic(key: string): ResultFeedbackValue | null {
  return readFeedback()[key] ?? null;
}

export function setFeedbackStatic(key: string, value: ResultFeedbackValue): void {
  const next = { ...readFeedback(), [key]: value };
  writeFeedback(next);
}
