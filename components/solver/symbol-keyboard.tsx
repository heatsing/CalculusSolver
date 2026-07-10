"use client";

import * as React from "react";
import { Delete, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type KeyDefinition = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "accent" | "utility";
};

const keyboardSections = [
  {
    id: "basic",
    label: "Basic",
    keys: [
      { label: "+", value: "+" },
      { label: "−", value: "-" },
      { label: "×", value: "*" },
      { label: "÷", value: "/" },
      { label: "=", value: "=" },
      { label: "(", value: "(" },
      { label: ")", value: ")" },
      { label: "π", value: "pi" },
      { label: "e", value: "e" },
      { label: "|x|", value: "abs(" },
      { label: "Clear", value: "__clear__", tone: "utility" },
      { label: "Delete", value: "__backspace__", tone: "utility" }
    ] satisfies KeyDefinition[]
  },
  {
    id: "powers",
    label: "Powers",
    keys: [
      { label: "x²", value: "^2", hint: "square" },
      { label: "x³", value: "^3", hint: "cube" },
      { label: "xⁿ", value: "^", hint: "power" },
      { label: "√x", value: "sqrt(", hint: "square root" },
      { label: "∛x", value: "cbrt(", hint: "cube root" },
      { label: "1/x", value: "1/(", hint: "reciprocal" },
      { label: "a/b", value: "/", hint: "fraction" },
      { label: "%", value: "%", hint: "percent" }
    ] satisfies KeyDefinition[]
  },
  {
    id: "functions",
    label: "Functions",
    keys: [
      { label: "sin", value: "sin(" },
      { label: "cos", value: "cos(" },
      { label: "tan", value: "tan(" },
      { label: "ln", value: "ln(" },
      { label: "log", value: "log(" },
      { label: "exp", value: "exp(" },
      { label: "asin", value: "asin(" },
      { label: "acos", value: "acos(" }
    ] satisfies KeyDefinition[]
  },
  {
    id: "calculus",
    label: "Calculus",
    keys: [
      { label: "∫", value: "integrate(", hint: "integral", tone: "accent" },
      { label: "d/dx", value: "derivative(", hint: "derivative", tone: "accent" },
      { label: "lim", value: "limit(", hint: "limit", tone: "accent" },
      { label: "Σ", value: "summation(", hint: "summation", tone: "accent" },
      { label: "∂/∂x", value: "partial_derivative(", hint: "partial derivative" },
      { label: "dx", value: " dx" },
      { label: "dy", value: " dy" },
      { label: "∞", value: "Infinity" }
    ] satisfies KeyDefinition[]
  }
] as const;

export type SymbolKeyboardProps = {
  onInsert: (value: string) => void;
  className?: string;
};

function MathKey({ keyDefinition, onInsert }: { keyDefinition: KeyDefinition; onInsert: (value: string) => void }): React.JSX.Element {
  const isClear = keyDefinition.value === "__clear__";
  const isDelete = keyDefinition.value === "__backspace__";
  return (
    <button
      type="button"
      onClick={() => onInsert(keyDefinition.value)}
      className={cn(
        "group flex min-h-12 min-w-0 items-center justify-center border px-2 font-mono text-sm transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        keyDefinition.tone === "accent"
          ? "border-primary bg-primary-soft text-primary hover:bg-primary hover:text-white"
          : keyDefinition.tone === "utility"
            ? "border-border bg-secondary-background text-body hover:border-heading hover:text-heading"
            : "border-border bg-white text-heading hover:border-primary hover:bg-primary-soft hover:text-primary"
      )}
      aria-label={isClear ? "Clear expression" : isDelete ? "Delete previous character" : `Insert ${keyDefinition.hint ?? keyDefinition.label}`}
      title={keyDefinition.hint ?? keyDefinition.label}
    >
      {isClear ? <RotateCcw className="h-4 w-4" /> : isDelete ? <Delete className="h-4 w-4" /> : keyDefinition.label}
      {keyDefinition.hint && <span className="sr-only"> {keyDefinition.hint}</span>}
    </button>
  );
}

export function SymbolKeyboard({ onInsert, className }: SymbolKeyboardProps): React.JSX.Element {
  const [activeSection, setActiveSection] = React.useState("basic");
  const section = keyboardSections.find((item) => item.id === activeSection) ?? keyboardSections[0];

  return (
    <div className={cn("border border-border bg-secondary-background", className)}>
      <div className="flex overflow-x-auto border-b border-border bg-white" role="tablist" aria-label="Math keyboard categories">
        {keyboardSections.map((item) => {
          const active = item.id === activeSection;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`math-keyboard-panel-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "min-h-12 flex-1 whitespace-nowrap border-b-2 px-4 text-sm transition-colors",
                active ? "border-primary bg-primary-soft font-medium text-primary" : "border-transparent text-body hover:bg-secondary-background hover:text-heading"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div id={`math-keyboard-panel-${section.id}`} role="tabpanel" className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6">
        {section.keys.map((keyDefinition) => (
          <MathKey key={`${section.id}-${keyDefinition.label}`} keyDefinition={keyDefinition} onInsert={onInsert} />
        ))}
      </div>
    </div>
  );
}
