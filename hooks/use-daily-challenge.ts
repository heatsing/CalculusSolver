"use client";

import * as React from "react";
import {
  type DailyChallengeProgress,
  type DailyChallengeStats,
  type DailyChallengeStatus,
  getDailyChallenge,
  getTodayKey,
  getDayNumber,
  checkAnswer,
  calculateScore,
  readProgress,
  writeProgress,
  readStats,
  writeStats,
  recordCompletion,
  MAX_HINTS,
  MAX_GUESSES
} from "@/lib/daily-challenge";
import type { DailyChallenge } from "@/data/daily-challenges";

export type DailyChallengeState = {
  status: "loading" | "ready" | "error";
  challenge: DailyChallenge | null;
  progress: DailyChallengeProgress | null;
  stats: DailyChallengeStats | null;
  dayNumber: number;
};

export function useDailyChallenge(): {
  state: DailyChallengeState;
  submitGuess: (guess: string) => { correct: boolean; status: DailyChallengeStatus };
  skipHint: () => void;
  shareText: string | null;
  resetGame: () => void;
} {
  const [state, setState] = React.useState<DailyChallengeState>({
    status: "loading",
    challenge: null,
    progress: null,
    stats: null,
    dayNumber: 0
  });

  React.useEffect(() => {
    try {
      const challenge = getDailyChallenge();
      const dayNumber = getDayNumber();
      const todayKey = getTodayKey();

      const savedProgress = readProgress();
      const savedStats = readStats();

      // If saved progress is for a different day, discard it
      let progress: DailyChallengeProgress | null = null;
      if (savedProgress && savedProgress.dateKey === todayKey && savedProgress.challengeId === challenge.id) {
        progress = savedProgress;
      } else {
        progress = {
          dateKey: todayKey,
          challengeId: challenge.id,
          hintStage: 0,
          skipsUsed: 0,
          status: "playing",
          score: 0,
          guesses: [],
          completedAt: null
        };
      }

      setState({
        status: "ready",
        challenge,
        progress,
        stats: savedStats,
        dayNumber
      });
    } catch {
      setState((prev) => ({ ...prev, status: "error" }));
    }
  }, []);

  function persistProgress(progress: DailyChallengeProgress): void {
    writeProgress(progress);
    setState((prev) => ({ ...prev, progress }));
  }

  function submitGuess(guess: string): { correct: boolean; status: DailyChallengeStatus } {
    if (!state.challenge || !state.progress) return { correct: false, status: "playing" };
    if (state.progress.status !== "playing") return { correct: state.progress.status === "won", status: state.progress.status };

    const correct = checkAnswer(guess, state.challenge);
    const newGuesses = [...state.progress.guesses, guess];

    let newHintStage = state.progress.hintStage;
    let newStatus: DailyChallengeStatus = "playing";

    if (correct) {
      newStatus = "won";
    } else {
      // Wrong guess advances hint stage
      newHintStage = Math.min(state.progress.hintStage + 1, MAX_HINTS);
      // If all hints revealed and this is the max-th guess, lose
      if (newGuesses.length >= MAX_GUESSES) {
        newStatus = "lost";
      }
    }

    const newScore = correct ? calculateScore(newHintStage, state.progress.skipsUsed) : 0;
    const newProgress: DailyChallengeProgress = {
      ...state.progress,
      guesses: newGuesses,
      hintStage: newHintStage,
      status: newStatus,
      score: newScore,
      completedAt: newStatus !== "playing" ? new Date().toISOString() : null
    };

    persistProgress(newProgress);

    // Update stats if game just ended
    if (newStatus !== "playing" && state.stats) {
      const updatedStats = recordCompletion(state.stats, state.progress.dateKey, newStatus);
      writeStats(updatedStats);
      setState((prev) => ({ ...prev, stats: updatedStats }));
    }

    return { correct, status: newStatus };
  }

  function skipHint(): void {
    if (!state.challenge || !state.progress) return;
    if (state.progress.status !== "playing") return;

    const newHintStage = Math.min(state.progress.hintStage + 1, MAX_HINTS);
    const newSkips = state.progress.skipsUsed + 1;

    // If skipping reveals all hints and no guesses remain, lose
    let newStatus: DailyChallengeStatus = "playing";
    if (newHintStage >= MAX_HINTS && state.progress.guesses.length >= MAX_GUESSES - 1) {
      newStatus = "lost";
    }

    const newProgress: DailyChallengeProgress = {
      ...state.progress,
      hintStage: newHintStage,
      skipsUsed: newSkips,
      status: newStatus,
      completedAt: newStatus !== "playing" ? new Date().toISOString() : null
    };

    persistProgress(newProgress);

    if (newStatus !== "playing" && state.stats) {
      const updatedStats = recordCompletion(state.stats, state.progress.dateKey, newStatus);
      writeStats(updatedStats);
      setState((prev) => ({ ...prev, stats: updatedStats }));
    }
  }

  const shareText = React.useMemo(() => {
    if (!state.progress || state.progress.status === "playing") return null;
    if (!state.stats) return null;
    const hintsUsed = state.progress.hintStage;
    return generateShareTextSafe(
      state.dayNumber,
      state.progress.status,
      hintsUsed,
      state.progress.score,
      state.stats.currentStreak
    );
  }, [state.progress, state.stats, state.dayNumber]);

  function resetGame(): void {
    if (!state.challenge) return;
    const todayKey = getTodayKey();
    const newProgress: DailyChallengeProgress = {
      dateKey: todayKey,
      challengeId: state.challenge.id,
      hintStage: 0,
      skipsUsed: 0,
      status: "playing",
      score: 0,
      guesses: [],
      completedAt: null
    };
    persistProgress(newProgress);
  }

  return { state, submitGuess, skipHint, shareText, resetGame };
}

// Avoid circular import for generateShareText
function generateShareTextSafe(
  dayNumber: number,
  status: DailyChallengeStatus,
  hintsUsed: number,
  score: number,
  streak: number
): string {
  // Inline implementation to avoid import issues
  const emoji = status === "won" ? "🎉" : "😅";
  const hintsEmoji = "💡".repeat(Math.min(hintsUsed, 6));
  const emptyEmoji = "⚫".repeat(Math.max(0, 6 - hintsUsed));
  return [
    `Calculus Solver Daily Challenge — Day ${dayNumber}`,
    `${emoji} ${status === "won" ? "Solved" : "Not solved"}`,
    `Hints: ${hintsEmoji}${emptyEmoji} (${hintsUsed}/6)`,
    `Score: ${score}`,
    `Streak: ${streak}`,
    `Play at ${typeof window !== "undefined" ? window.location.origin : "https://calculussolver.net"}/daily-challenge`
  ].join("\n");
}
