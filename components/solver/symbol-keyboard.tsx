"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const keyboardGroups = [
  {
    title: "Basic",
    categories: [
      {
        name: "Operators",
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
        name: "Power & Fractions",
        symbols: [
          { label: "x²", value: "^2" },
          { label: "x³", value: "^3" },
          { label: "xⁿ", value: "^" },
          { label: "√", value: "sqrt(" },
          { label: "∛", value: "cbrt(" },
          { label: "a/b", value: "/" },
          { label: "½", value: "1/2" },
          { label: "|x|", value: "abs(" },
          { label: "%", value: "%" }
        ]
      },
      {
        name: "Constants & Brackets",
        symbols: [
          { label: "π", value: "pi" },
          { label: "e", value: "e" },
          { label: "∞", value: "Infinity" },
          { label: "(", value: "(" },
          { label: ")", value: ")" },
          { label: "[", value: "[" },
          { label: "]", value: "]" },
          { label: "{", value: "{" },
          { label: "}", value: "}" },
          { label: "⌈⌉", value: "ceil(" },
          { label: "⌊⌋", value: "floor(" }
        ]
      }
    ]
  },
  {
    title: "Calculus",
    categories: [
      {
        name: "Calculus",
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
        name: "Functions",
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
        name: "Greek",
        symbols: [
          { label: "α", value: "alpha" },
          { label: "β", value: "beta" },
          { label: "γ", value: "gamma" },
          { label: "δ", value: "delta" },
          { label: "ε", value: "epsilon" },
          { label: "θ", value: "theta" },
          { label: "λ", value: "lambda" },
          { label: "μ", value: "mu" },
          { label: "σ", value: "sigma" },
          { label: "φ", value: "phi" },
          { label: "ω", value: "omega" }
        ]
      }
    ]
  },
  {
    title: "Advanced",
    categories: [
      {
        name: "Linear Algebra",
        symbols: [
          { label: "Matrix", value: "matrix(" },
          { label: "Det", value: "det(" },
          { label: "Inv", value: "inv(" },
          { label: "Transpose", value: "transpose(" },
          { label: "Rank", value: "rank(" }
        ]
      },
      {
        name: "Statistics",
        symbols: [
          { label: "Σ", value: "summation(" },
          { label: "Π", value: "product(" },
          { label: "Var", value: "var(" },
          { label: "Mean", value: "mean(" }
        ]
      },
      {
        name: "Sets & Logic",
        symbols: [
          { label: "ℝ", value: "R" },
          { label: "ℤ", value: "Z" },
          { label: "ℕ", value: "N" },
          { label: "ℂ", value: "C" },
          { label: "∈", value: " in " },
          { label: "∪", value: " union " },
          { label: "∩", value: " intersect " },
          { label: "∀", value: "for all " },
          { label: "∃", value: "exists " },
          { label: "⇒", value: "=>" },
          { label: "⇔", value: "<=>" }
        ]
      }
    ]
  }
];

export type SymbolKeyboardProps = {
  onInsert: (value: string) => void;
  className?: string;
};

function SymbolButton({
  label,
  value,
  onInsert
}: {
  label: string;
  value: string;
  onInsert: (value: string) => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onInsert(value)}
      className={cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border border-border bg-white px-2",
        "text-sm font-medium text-heading transition-colors hover:border-primary hover:text-primary hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      )}
      aria-label={`Insert ${label}`}
      title={`Insert ${label}`}
    >
      {label}
    </button>
  );
}

function CategorySection({
  category,
  onInsert
}: {
  category: (typeof keyboardGroups)[number]["categories"][number];
  onInsert: (value: string) => void;
}): React.JSX.Element {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-body/60">{category.name}</p>
      <div className="flex flex-wrap gap-1">
        {category.symbols.map((symbol) => (
          <SymbolButton
            key={`${category.name}-${symbol.label}`}
            label={symbol.label}
            value={symbol.value}
            onInsert={onInsert}
          />
        ))}
      </div>
    </div>
  );
}

function GroupPanel({
  group,
  expanded,
  onToggle,
  onInsert
}: {
  group: (typeof keyboardGroups)[number];
  expanded: boolean;
  onToggle: () => void;
  onInsert: (value: string) => void;
}): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-heading hover:bg-secondary-background/40"
        aria-expanded={expanded}
      >
        {group.title}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="space-y-3 border-t border-border px-3 pb-3 pt-2">
          {group.categories.map((category) => (
            <CategorySection key={category.name} category={category} onInsert={onInsert} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SymbolKeyboard({ onInsert, className }: SymbolKeyboardProps): React.JSX.Element {
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    Basic: true,
    Calculus: false,
    Advanced: false
  });

  function toggleGroup(title: string): void {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-body/70">Math keyboard</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            setExpandedGroups({
              Basic: false,
              Calculus: false,
              Advanced: false
            })
          }
          className="h-auto px-2 py-1 text-xs text-body hover:text-heading"
        >
          Collapse all
        </Button>
      </div>
      <div className="space-y-2">
        {keyboardGroups.map((group) => (
          <GroupPanel
            key={group.title}
            group={group}
            expanded={expandedGroups[group.title] ?? false}
            onToggle={() => toggleGroup(group.title)}
            onInsert={onInsert}
          />
        ))}
      </div>
    </div>
  );
}
