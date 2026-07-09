"use client";

import * as React from "react";
import { Equal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MathDisplay } from "@/components/math/math-display";
import { evaluateExpression, kindLabel, type CalcResult } from "@/lib/calculator-engine";

type CalcButton = {
  label: string;
  value: string;
  variant?: "default" | "operator" | "function" | "calculus" | "action";
  span?: 1 | 2;
};

const buttonRows: CalcButton[][] = [
  [
    { label: "d/dx", value: "derivative(", variant: "calculus" },
    { label: "∫", value: "integrate(", variant: "calculus" },
    { label: "lim", value: "limit(", variant: "calculus" },
    { label: "√", value: "sqrt(", variant: "function" },
    { label: "xⁿ", value: "^", variant: "function" }
  ],
  [
    { label: "sin", value: "sin(", variant: "function" },
    { label: "cos", value: "cos(", variant: "function" },
    { label: "tan", value: "tan(", variant: "function" },
    { label: "ln", value: "ln(", variant: "function" },
    { label: "log", value: "log(", variant: "function" }
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "÷", value: "/", variant: "operator" },
    { label: "C", value: "CLEAR", variant: "action" }
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "×", value: "*", variant: "operator" },
    { label: "⌫", value: "BACKSPACE", variant: "action" }
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "−", value: "-", variant: "operator" },
    { label: "π", value: "pi", variant: "function" }
  ],
  [
    { label: "0", value: "0" },
    { label: ".", value: "." },
    { label: "(", value: "(", variant: "function" },
    { label: ")", value: ")", variant: "function" },
    { label: "+", value: "+", variant: "operator" }
  ],
  [
    { label: "x", value: "x" },
    { label: "e", value: "e", variant: "function" },
    { label: ",", value: ",", variant: "function" },
    { label: "=", value: "=", variant: "operator", span: 2 }
  ]
];

const variantClasses: Record<NonNullable<CalcButton["variant"]>, string> = {
  default: "bg-white text-heading border-border hover:border-primary",
  operator: "bg-primary-soft text-primary border-primary/20 hover:bg-primary/10",
  function: "bg-secondary-background text-body border-border hover:border-primary",
  calculus: "bg-primary text-white border-primary hover:bg-primary/90",
  action: "bg-error/5 text-error border-error/20 hover:bg-error/10"
};

export function OnlineCalculator(): React.JSX.Element {
  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState<CalcResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Refs so the global keydown listener always sees the latest handlers/state
  // without needing to re-bind on every keystroke.
  const expressionRef = React.useRef(expression);
  expressionRef.current = expression;
  const loadingRef = React.useRef(loading);
  loadingRef.current = loading;

  function handleInput(value: string): void {
    if (loading) return;
    setResult(null);
    if (value === "CLEAR") {
      setExpression("");
      setResult(null);
      return;
    }
    if (value === "BACKSPACE") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    setExpression((prev) => prev + value);
  }

  async function handleEvaluate(): Promise<void> {
    const current = expressionRef.current.trim();
    if (!current) {
      setResult({ ok: false, value: "", error: "Please enter an expression" });
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await evaluateExpression(current);
      setResult(res);
    } catch {
      setResult({ ok: false, value: "", error: "Could not evaluate expression" });
    } finally {
      setLoading(false);
    }
  }

  function handleSolveFull(): void {
    if (!expression.trim() || loading) return;
    const encoded = encodeURIComponent(expression);
    window.location.href = `/?q=${encoded}`;
  }

  // Physical keyboard support — makes the calculator feel like a real device.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (loadingRef.current) return;

      const key = e.key;
      if (key === "Enter" || key === "=") {
        e.preventDefault();
        void handleEvaluate();
        return;
      }
      if (key === "Backspace") {
        e.preventDefault();
        handleInput("BACKSPACE");
        return;
      }
      if (key === "Escape") {
        e.preventDefault();
        handleInput("CLEAR");
        return;
      }
      if (/^[0-9.+\-*/^(),xe]$/.test(key)) {
        e.preventDefault();
        handleInput(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {/* Display */}
        <div className="border-b border-border bg-secondary-background/50 p-5">
          <div
            className="min-h-[3rem] break-all text-right font-mono text-2xl text-heading"
            aria-live="polite"
          >
            {expression || <span className="text-body/40">0</span>}
          </div>

          {/* Result */}
          {loading && (
            <div className="mt-3 flex items-center justify-end gap-2 text-sm text-body">
              <Loader2 className="h-4 w-4 animate-spin" />
              Computing…
            </div>
          )}
          {!loading && result && result.ok && (
            <div className="mt-3 border-t border-border/60 pt-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-body/70">
                  {kindLabel(result.kind)}
                </span>
              </div>
              {result.latex ? (
                <div className="mt-1 overflow-x-auto text-right">
                  <MathDisplay latex={result.latex} display="block" showCopy={false} />
                </div>
              ) : (
                <div className="mt-1 break-all text-right font-mono text-xl font-semibold text-primary">
                  {result.value}
                </div>
              )}
              {result.latex && result.value && (
                <div className="mt-1 break-all text-right font-mono text-xs text-body">
                  = {result.value}
                </div>
              )}
            </div>
          )}
          {!loading && result && !result.ok && result.error && (
            <div className="mt-2 text-right text-sm text-error" role="alert">
              {result.error}
            </div>
          )}
        </div>

        {/* Button grid */}
        <div className="space-y-1.5 p-3">
          {buttonRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
              {row.map((button) => (
                <button
                  key={`${rowIndex}-${button.label}`}
                  type="button"
                  onClick={() => handleInput(button.value)}
                  disabled={loading}
                  className={cn(
                    "h-12 rounded-lg border text-sm font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    variantClasses[button.variant ?? "default"],
                    button.span === 2 && "col-span-2"
                  )}
                  aria-label={button.label}
                >
                  {button.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex gap-2 border-t border-border p-3">
          <button
            type="button"
            onClick={() => void handleEvaluate()}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Equal className="h-4 w-4" />}
            Evaluate
          </button>
          <button
            type="button"
            onClick={handleSolveFull}
            disabled={loading || !expression.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold text-heading transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Solve step-by-step
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="mt-3 text-center text-xs text-body">
        Tip: use your keyboard — digits, + − × ÷, <kbd className="rounded border border-border bg-white px-1">Enter</kbd> to evaluate, <kbd className="rounded border border-border bg-white px-1">⌫</kbd> to delete, <kbd className="rounded border border-border bg-white px-1">Esc</kbd> to clear.
      </p>

      {/* Preview */}
      {expression && (
        <div className="mt-4 rounded-xl border border-border bg-white p-4">
          <p className="mb-2 text-xs font-medium text-body">LaTeX preview</p>
          <MathDisplay latex={expressionToLatex(expression)} display="block" />
        </div>
      )}
    </div>
  );
}

function expressionToLatex(expr: string): string {
  return expr
    .replace(/\*/g, " \\cdot ")
    .replace(/sqrt\(/g, "\\sqrt{")
    .replace(/\)/g, "}")
    .replace(/pi/g, "\\pi")
    .replace(/->/g, " \\to ")
    .replace(/derivative\(/g, "\\frac{d}{dx}\\left(")
    .replace(/integrate\(/g, "\\int ")
    .replace(/limit\(/g, "\\lim_{x \\to ");
}
