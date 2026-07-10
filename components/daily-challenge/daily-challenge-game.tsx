"use client";

import * as React from "react";
import { Lightbulb, SkipForward, Share2, Check, X, Clock, Flame, Trophy, RotateCcw } from "lucide-react";
import { useDailyChallenge } from "@/hooks/use-daily-challenge";
import { MathDisplay } from "@/components/math/math-display";
import { getMsUntilNextDay, MAX_HINTS, MAX_GUESSES } from "@/lib/daily-challenge";
import { cn } from "@/lib/utils";

export function DailyChallengeGame(): React.JSX.Element {
  const { state, submitGuess, skipHint, shareText, resetGame } = useDailyChallenge();
  const [input, setInput] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ type: "correct" | "incorrect" | "info"; message: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [countdown, setCountdown] = React.useState("");

  // Countdown timer
  React.useEffect(() => {
    function updateCountdown(): void {
      const ms = getMsUntilNextDay();
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1000);
      setCountdown(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!input.trim()) return;
    const result = submitGuess(input.trim());
    if (result.correct) {
      setFeedback({ type: "correct", message: "Correct! Well done." });
    } else if (result.status === "lost") {
      setFeedback({ type: "incorrect", message: "Out of attempts. Better luck tomorrow!" });
    } else {
      setFeedback({ type: "incorrect", message: "Not quite. A new hint has been revealed." });
    }
    setInput("");
  }

  function handleSkip(): void {
    skipHint();
    setFeedback({ type: "info", message: "Hint revealed. Your score decreased." });
  }

  async function handleShare(): Promise<void> {
    if (!shareText) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  // Loading state
  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-3 text-body">Loading today's challenge...</span>
      </div>
    );
  }

  // Error state
  if (state.status === "error" || !state.challenge || !state.progress) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-8 text-center">
        <X className="mx-auto h-8 w-8 text-error" />
        <p className="mt-3 font-semibold text-heading">Could not load the daily challenge</p>
        <p className="mt-1 text-sm text-body">Please refresh the page or try again later.</p>
      </div>
    );
  }

  const { challenge, progress, stats, dayNumber } = state;
  const isPlaying = progress.status === "playing";
  const isWon = progress.status === "won";
  const isLost = progress.status === "lost";
  const hintsRevealed = progress.hintStage;
  const guessesLeft = MAX_GUESSES - progress.guesses.length;

  return (
    <div className="mx-auto w-full rounded-2xl border border-[#82aff5] bg-white p-5 shadow-[0_14px_40px_rgba(35,74,132,.10)] sm:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Daily Challenge · Day {dayNumber}</p>
          <p className="text-xs text-body">{challenge.category} · {challenge.difficulty}</p>
        </div>
        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <span data-testid="daily-streak" className="flex items-center gap-1 text-body">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-heading">{stats.currentStreak}</span> streak
            </span>
            <span data-testid="daily-wins" className="flex items-center gap-1 text-body">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-heading">{stats.totalWon}</span> won
            </span>
          </div>
        )}
      </div>

      {/* Problem card */}
      <div className="rounded-xl border border-[#d9e4f3] bg-[#f8fbff] p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-lg font-bold text-primary">
            {challenge.symbol}
          </span>
          <h2 className="text-lg font-semibold text-heading">{challenge.problem}</h2>
        </div>
        <div className="rounded-xl bg-secondary-background p-4">
          <MathDisplay latex={challenge.problemLatex} display="block" />
        </div>
      </div>

      {/* Hints */}
      {hintsRevealed > 0 && (
        <div className="mt-4 rounded-2xl border border-border bg-white p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-heading">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Hints ({hintsRevealed}/{MAX_HINTS})
          </h3>
          <ol className="space-y-2">
            {challenge.hints.slice(0, hintsRevealed).map((hint: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-body">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                {hint}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "mt-4 rounded-xl p-4 text-sm",
            feedback.type === "correct" && "bg-green-50 text-green-700",
            feedback.type === "incorrect" && "bg-red-50 text-red-700",
            feedback.type === "info" && "bg-blue-50 text-blue-700"
          )}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {/* Input area (only when playing) */}
      {isPlaying && (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="daily-guess-input" className="mb-2 block text-sm font-medium text-heading">
            Your answer
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="daily-guess-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your final answer..."
              autoComplete="off"
              className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-heading placeholder:text-body/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Enter your answer"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              Submit Answer
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-body">
            <span>{guessesLeft} attempt{guessesLeft !== 1 ? "s" : ""} remaining</span>
            <button
              type="button"
              onClick={handleSkip}
              disabled={hintsRevealed >= MAX_HINTS}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-body transition-colors hover:bg-secondary-background hover:text-heading disabled:opacity-40"
            >
              <SkipForward className="h-3 w-3" />
              Reveal hint (-{18} pts)
            </button>
          </div>
        </form>
      )}

      {/* Won state */}
      {isWon && (
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <Check className="mx-auto h-10 w-10 text-green-600" />
          <h3 className="mt-2 text-xl font-bold text-green-800">Solved!</h3>
          <p className="mt-1 text-sm text-green-700">Score: {progress.score} · Hints used: {hintsRevealed}/{MAX_HINTS}</p>
          <div className="mt-4 rounded-xl bg-white p-4">
            <p className="mb-2 text-xs font-medium text-body">Answer</p>
            <MathDisplay latex={challenge.answerLatex} display="block" />
          </div>
        </div>
      )}

      {/* Lost state */}
      {isLost && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <X className="mx-auto h-10 w-10 text-red-600" />
          <h3 className="mt-2 text-xl font-bold text-red-800">Not solved</h3>
          <p className="mt-1 text-sm text-red-700">The answer is below. Try again tomorrow!</p>
          <div className="mt-4 rounded-xl bg-white p-4">
            <p className="mb-2 text-xs font-medium text-body">Answer</p>
            <MathDisplay latex={challenge.answerLatex} display="block" />
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-body">
          <Clock className="h-4 w-4" />
          <span>Next challenge in <span data-testid="daily-countdown" className="font-mono font-semibold text-heading">{countdown}</span></span>
        </div>
        <div className="flex items-center gap-2">
          {shareText && (
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-heading transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Share"}
            </button>
          )}
          {!isPlaying && (
            <button
              type="button"
              onClick={resetGame}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-heading transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>

      {/* Previous guesses */}
      {progress.guesses.length > 0 && isPlaying && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-body">Previous attempts</p>
          <div className="flex flex-wrap gap-2">
            {progress.guesses.map((guess, i) => (
              <span key={i} className="rounded-full bg-secondary-background px-3 py-1 text-xs text-body">
                {guess}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
