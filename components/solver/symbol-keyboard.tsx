"use client";

import { cn } from "@/lib/utils";

const keyboardSections = [
  {
    title: "Basic",
    symbols: [
      { label: "+", value: "+" },
      { label: "−", value: "-" },
      { label: "×", value: "*" },
      { label: "÷", value: "/" },
      { label: "=", value: "=" },
      { label: "≠", value: "!=" },
      { label: "<", value: "<" },
      { label: ">", value: ">" },
      { label: "≤", value: "<=" },
      { label: "≥", value: ">=" }
    ]
  },
  {
    title: "Power",
    symbols: [
      { label: "x²", value: "^2" },
      { label: "x³", value: "^3" },
      { label: "xⁿ", value: "^" },
      { label: "√", value: "sqrt(" },
      { label: "∛", value: "cbrt(" },
      { label: "|x|", value: "abs(" },
      { label: "%", value: "%" }
    ]
  },
  {
    title: "Fractions & Constants",
    symbols: [
      { label: "a/b", value: "/" },
      { label: "½", value: "1/2" },
      { label: "π", value: "pi" },
      { label: "e", value: "e" },
      { label: "∞", value: "Infinity" }
    ]
  },
  {
    title: "Calculus",
    symbols: [
      { label: "∫", value: "integrate(" },
      { label: "∬", value: "integrate(integrate(" },
      { label: "∭", value: "integrate(integrate(integrate(" },
      { label: "∮", value: "contour_integrate(" },
      { label: "dx", value: " dx" },
      { label: "dy", value: " dy" },
      { label: "dz", value: " dz" },
      { label: "d/dx", value: "derivative(" },
      { label: "∂", value: "partial_derivative(" },
      { label: "lim", value: "limit(" }
    ]
  },
  {
    title: "Functions",
    symbols: [
      { label: "sin", value: "sin(" },
      { label: "cos", value: "cos(" },
      { label: "tan", value: "tan(" },
      { label: "ln", value: "ln(" },
      { label: "log", value: "log(" },
      { label: "exp", value: "exp(" },
      { label: "sqrt", value: "sqrt(" },
      { label: "abs", value: "abs(" }
    ]
  },
  {
    title: "Linear Algebra",
    symbols: [
      { label: "Matrix", value: "matrix(" },
      { label: "Det", value: "det(" },
      { label: "Inv", value: "inv(" },
      { label: "Transpose", value: "transpose(" },
      { label: "Rank", value: "rank(" }
    ]
  },
  {
    title: "Statistics",
    symbols: [
      { label: "Σ", value: "summation(" },
      { label: "Π", value: "product(" },
      { label: "μ", value: "mu" },
      { label: "σ", value: "sigma" },
      { label: "Var", value: "var(" },
      { label: "Mean", value: "mean(" }
    ]
  },
  {
    title: "Sets",
    symbols: [
      { label: "ℝ", value: "R" },
      { label: "ℤ", value: "Z" },
      { label: "ℕ", value: "N" },
      { label: "ℂ", value: "C" },
      { label: "∈", value: " in " },
      { label: "∪", value: " union " },
      { label: "∩", value: " intersect " }
    ]
  },
  {
    title: "Logic",
    symbols: [
      { label: "∀", value: "for all " },
      { label: "∃", value: "exists " },
      { label: "⇒", value: "=>" },
      { label: "⇔", value: "<=>" }
    ]
  },
  {
    title: "Greek",
    symbols: [
      { label: "α", value: "alpha" },
      { label: "β", value: "beta" },
      { label: "γ", value: "gamma" },
      { label: "δ", value: "delta" },
      { label: "ε", value: "epsilon" },
      { label: "θ", value: "theta" },
      { label: "λ", value: "lambda" },
      { label: "μ", value: "mu" },
      { label: "π", value: "pi" },
      { label: "σ", value: "sigma" },
      { label: "φ", value: "phi" },
      { label: "ω", value: "omega" }
    ]
  },
  {
    title: "Brackets",
    symbols: [
      { label: "(", value: "(" },
      { label: ")", value: ")" },
      { label: "[", value: "[" },
      { label: "]", value: "]" },
      { label: "{", value: "{" },
      { label: "}", value: "}" },
      { label: "||", value: "abs(" },
      { label: "⌈⌉", value: "ceil(" },
      { label: "⌊⌋", value: "floor(" }
    ]
  }
];

export type SymbolKeyboardProps = {
  onInsert: (value: string) => void;
  className?: string;
};

export function SymbolKeyboard({ onInsert, className }: SymbolKeyboardProps): React.JSX.Element {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-body/70">Math keyboard</p>
      <div className="rounded-lg border border-border bg-secondary-background/60 p-3">
        <div className="space-y-3">
          {keyboardSections.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 text-xs font-medium text-body/60">{section.title}</p>
              <div className="flex flex-wrap gap-1">
                {section.symbols.map((symbol) => (
                  <button
                    key={`${section.title}-${symbol.label}`}
                    type="button"
                    onClick={() => onInsert(symbol.value)}
                    className={cn(
                      "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border border-border bg-white px-2",
                      "text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary hover:shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    )}
                    aria-label={`Insert ${symbol.label}`}
                    title={`Insert ${symbol.label}`}
                  >
                    {symbol.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
