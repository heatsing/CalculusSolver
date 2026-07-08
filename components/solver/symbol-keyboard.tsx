"use client";

import { cn } from "@/lib/utils";

const keyboardRows = [
  [
    { label: "x²", value: "^2" },
    { label: "√", value: "sqrt(" },
    { label: "π", value: "pi" },
    { label: "∞", value: "Infinity" },
    { label: "(", value: "(" },
    { label: ")", value: ")" }
  ],
  [
    { label: "+", value: "+" },
    { label: "−", value: "-" },
    { label: "×", value: "*" },
    { label: "÷", value: "/" },
    { label: "=", value: "=" },
    { label: "<", value: "<" },
    { label: ">", value: ">" }
  ],
  [
    { label: "∫", value: "integrate(" },
    { label: "d/dx", value: "derivative(" },
    { label: "∂", value: "partial_derivative(" },
    { label: "lim", value: "limit(" },
    { label: "Σ", value: "summation(" }
  ],
  [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "log", value: "log(" },
    { label: "ln", value: "ln(" },
    { label: "eˣ", value: "exp(" }
  ]
];

export type SymbolKeyboardProps = {
  onInsert: (value: string) => void;
  className?: string;
};

export function SymbolKeyboard({ onInsert, className }: SymbolKeyboardProps): React.JSX.Element {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-body/70">Math keyboard</p>
      <div
        className={cn(
          "rounded-lg border border-border bg-secondary-background/60 p-2"
        )}
      >
        <div className="space-y-1.5">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-1">
            {row.map((symbol) => (
              <button
                key={symbol.label}
                type="button"
                onClick={() => onInsert(symbol.value)}
                className={cn(
                  "inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-md border border-border bg-white px-2.5",
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
        ))}
      </div>
      </div>
    </div>
  );
}
