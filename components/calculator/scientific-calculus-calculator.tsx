"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Check, Delete, RotateCcw } from "lucide-react";
import type { OnlineCalculatorResultData } from "@/components/calculator/online-calculator-result";

const OnlineCalculatorResult = dynamic(
  () => import("@/components/calculator/online-calculator-result").then((module) => module.OnlineCalculatorResult),
  {
    ssr: false,
    loading: () => <div className="mt-5 min-h-40 animate-pulse rounded-xl bg-[#eef5fd]" aria-hidden="true" />
  }
);

type Operation = "auto" | "derivative" | "integral" | "limit" | "series";
type CalculatorVariant = "calculus" | "derivative" | "integral" | "limit";
type AngleMode = "RAD" | "DEG";
type KeyAction = "clear" | "backspace" | "calculate" | "derivative" | "second-derivative" | "integral" | "limit" | "series" | "matrix" | "answer" | "product" | "quotient" | "chain" | "definite-integral" | "constant" | "integration-parts" | "substitution" | "limit-zero" | "limit-infinity" | "left-limit" | "right-limit" | "rational-limit";

type CalculatorKey = {
  label: string;
  value?: string;
  action?: KeyAction;
  tone?: "number" | "function" | "operator" | "danger" | "equals" | "calculus";
  ariaLabel?: string;
};

const baseKeys: readonly CalculatorKey[] = [
  { label: "C", action: "clear", tone: "danger", ariaLabel: "Clear expression" },
  { label: "⌫", action: "backspace", tone: "function", ariaLabel: "Delete previous character" },
  { label: "(", value: "(", tone: "function" }, { label: ")", value: ")", tone: "function" },
  { label: "÷", value: "/", tone: "operator", ariaLabel: "Divide" },
  { label: "%", value: "%", tone: "operator", ariaLabel: "Percent" },
  { label: "xʸ", value: "^", tone: "function", ariaLabel: "Power" },
  { label: "x²", value: "^2", tone: "function", ariaLabel: "Square" },
  { label: "x³", value: "^3", tone: "function", ariaLabel: "Cube" },
  { label: "√x", value: "sqrt(", tone: "function", ariaLabel: "Square root" },
  { label: "ⁿ√x", value: "^(1/", tone: "function", ariaLabel: "Nth root" },
  { label: "×", value: "*", tone: "operator", ariaLabel: "Multiply" },
  { label: "sin", value: "sin(", tone: "function" }, { label: "cos", value: "cos(", tone: "function" },
  { label: "tan", value: "tan(", tone: "function" },
  { label: "sin⁻¹", value: "asin(", tone: "function", ariaLabel: "Inverse sine" },
  { label: "cos⁻¹", value: "acos(", tone: "function", ariaLabel: "Inverse cosine" },
  { label: "−", value: "-", tone: "operator", ariaLabel: "Subtract" },
  { label: "log", value: "log10(", tone: "function", ariaLabel: "Base ten logarithm" },
  { label: "ln", value: "ln(", tone: "function", ariaLabel: "Natural logarithm" },
  { label: "log₁₀", value: "log10(", tone: "function", ariaLabel: "Base ten logarithm" },
  { label: "e", value: "e", tone: "function" }, { label: "π", value: "pi", tone: "function", ariaLabel: "Pi" },
  { label: "+", value: "+", tone: "operator", ariaLabel: "Add" },
  { label: "|x|", value: "abs(", tone: "function", ariaLabel: "Absolute value" },
  { label: "n!", value: "!", tone: "function", ariaLabel: "Factorial" },
  { label: "1/x", value: "1/(", tone: "function", ariaLabel: "Reciprocal" },
  { label: "a/b", value: "/(", tone: "function", ariaLabel: "Fraction" },
  { label: "x", value: "x", tone: "function", ariaLabel: "Variable x" },
  { label: ",", value: ",", tone: "function", ariaLabel: "Comma" }
];

const numberKeys: readonly CalculatorKey[] = [
  { label: "7", value: "7", tone: "number" }, { label: "8", value: "8", tone: "number" },
  { label: "9", value: "9", tone: "number" }, { label: "4", value: "4", tone: "number" },
  { label: "5", value: "5", tone: "number" }, { label: "6", value: "6", tone: "number" },
  { label: "1", value: "1", tone: "number" }, { label: "2", value: "2", tone: "number" },
  { label: "3", value: "3", tone: "number" }, { label: "0", value: "0", tone: "number" },
  { label: ".", value: ".", tone: "number", ariaLabel: "Decimal point" },
  { label: "=", action: "calculate", tone: "equals", ariaLabel: "Calculate result" }
];

const calculusKeys: readonly CalculatorKey[] = [
  { label: "∫", action: "integral", tone: "calculus", ariaLabel: "Calculate an integral" },
  { label: "d/dx", action: "derivative", tone: "calculus", ariaLabel: "Calculate a derivative" },
  { label: "d²/dx²", action: "second-derivative", tone: "calculus", ariaLabel: "Calculate a second derivative" },
  { label: "lim", action: "limit", tone: "calculus", ariaLabel: "Calculate a limit" },
  { label: "Σ", action: "series", tone: "calculus", ariaLabel: "Calculate an infinite series" },
  { label: "[ ]", action: "matrix", tone: "calculus", ariaLabel: "Insert a matrix" }
];

const derivativeKeys: readonly CalculatorKey[] = [
  { label: "d/dx", action: "derivative", tone: "calculus", ariaLabel: "First derivative" },
  { label: "d²/dx²", action: "second-derivative", tone: "calculus", ariaLabel: "Second derivative" },
  { label: "u·v", action: "product", tone: "calculus", ariaLabel: "Product rule example" },
  { label: "u/v", action: "quotient", tone: "calculus", ariaLabel: "Quotient rule example" },
  { label: "f(g)", action: "chain", tone: "calculus", ariaLabel: "Chain rule example" },
  { label: "Ans", action: "answer", tone: "calculus", ariaLabel: "Insert previous answer" }
];

const integralKeys: readonly CalculatorKey[] = [
  { label: "∫", action: "integral", tone: "calculus", ariaLabel: "Indefinite integral" },
  { label: "∫ₐᵇ", action: "definite-integral", tone: "calculus", ariaLabel: "Definite integral" },
  { label: "+ C", action: "constant", tone: "calculus", ariaLabel: "Constant of integration" },
  { label: "u·dv", action: "integration-parts", tone: "calculus", ariaLabel: "Integration by parts example" },
  { label: "u-sub", action: "substitution", tone: "calculus", ariaLabel: "Substitution example" },
  { label: "Ans", action: "answer", tone: "calculus", ariaLabel: "Insert previous answer" }
];

const limitKeys: readonly CalculatorKey[] = [
  { label: "lim", action: "limit", tone: "calculus", ariaLabel: "Limit" },
  { label: "x→0", action: "limit-zero", tone: "calculus", ariaLabel: "Limit as x approaches zero" },
  { label: "x→∞", action: "limit-infinity", tone: "calculus", ariaLabel: "Limit as x approaches infinity" },
  { label: "x→a⁻", action: "left-limit", tone: "calculus", ariaLabel: "Left hand limit" },
  { label: "x→a⁺", action: "right-limit", tone: "calculus", ariaLabel: "Right hand limit" },
  { label: "0/0", action: "rational-limit", tone: "calculus", ariaLabel: "Indeterminate rational limit example" }
];

const toneClasses: Record<NonNullable<CalculatorKey["tone"]>, string> = {
  number: "border-[#36536d] bg-[#203a50] text-white hover:bg-[#294963]",
  function: "border-[#36536d] bg-[#29465e] text-[#f5f9ff] hover:bg-[#355873]",
  calculus: "border-[#315675] bg-[#274b67] text-[#eaf5ff] hover:bg-[#356382]",
  operator: "border-[#a65300] bg-[#a65300] text-white hover:bg-[#b85d00]",
  danger: "border-[#ef5350] bg-[#ef4444] text-white hover:bg-[#ff5c58]",
  equals: "border-[#a65300] bg-[#a65300] text-white hover:bg-[#b85d00]"
};

const presets: Record<CalculatorVariant, { input: string; operation: Operation; examples: readonly { label: string; input: string; operation: Operation }[] }> = {
  calculus: {
    input: "d/dx (x^3 * sin(x))",
    operation: "derivative",
    examples: [
      { label: "Product derivative", input: "d/dx (x^3 * sin(x))", operation: "derivative" },
      { label: "Integral", input: "sin(x)", operation: "integral" },
      { label: "Limit", input: "lim x->0 sin(x)/x", operation: "limit" },
      { label: "Series", input: "1/n^2", operation: "series" }
    ]
  },
  derivative: {
    input: "x^3 * sin(x)", operation: "derivative",
    examples: [
      { label: "Power rule", input: "x^5 - 3*x^2 + 7", operation: "derivative" },
      { label: "Product rule", input: "x^2 * sin(x)", operation: "derivative" },
      { label: "Quotient rule", input: "ln(x) / x", operation: "derivative" },
      { label: "Chain rule", input: "sin(x^2 + 1)", operation: "derivative" }
    ]
  },
  integral: {
    input: "x^2 * cos(x)", operation: "integral",
    examples: [
      { label: "Power rule", input: "x^4", operation: "integral" },
      { label: "Trigonometric", input: "sin(x)", operation: "integral" },
      { label: "Exponential", input: "e^x", operation: "integral" },
      { label: "Integration by parts", input: "x * e^x", operation: "integral" }
    ]
  },
  limit: {
    input: "lim x->0 sin(x)/x", operation: "limit",
    examples: [
      { label: "Standard limit", input: "lim x->0 sin(x)/x", operation: "limit" },
      { label: "Factor and cancel", input: "lim x->1 (x^2-1)/(x-1)", operation: "limit" },
      { label: "At infinity", input: "lim x->Infinity (2*x^2+1)/(x^2-3)", operation: "limit" },
      { label: "Direct substitution", input: "lim x->2 x^2+3*x", operation: "limit" }
    ]
  }
};

function applyDegreeMode(input: string): string {
  return input
    .replace(/\b(sin|cos|tan)\(\s*(-?\d+(?:\.\d+)?)\s*\)/gi, "$1(($2)*pi/180)")
    .replace(/\b(asin|acos|atan)\(([^()]+)\)/gi, "($1($2)*180/pi)");
}

function cleanCalculusTarget(input: string): string {
  return input
    .replace(/^\s*d\s*\/\s*d[xy]\s*/i, "")
    .replace(/^\s*(?:differentiate|derivative|integrate|integral)(?:\s+of)?\s*/i, "")
    .replace(/\s+d[xy]\s*$/i, "")
    .trim();
}

export function ScientificCalculusCalculator({ variant = "calculus" }: { variant?: CalculatorVariant }): React.JSX.Element {
  const preset = presets[variant];
  const specializedKeys = variant === "derivative" ? derivativeKeys : variant === "integral" ? integralKeys : variant === "limit" ? limitKeys : calculusKeys;
  const [input, setInput] = React.useState(preset.input);
  const [operation, setOperation] = React.useState<Operation>(preset.operation);
  const [angleMode, setAngleMode] = React.useState<AngleMode>("RAD");
  const [result, setResult] = React.useState<OnlineCalculatorResultData | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  function updateInput(next: string, nextOperation = operation): void {
    setInput(next); setOperation(nextOperation); setResult(null); setError("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function insert(value: string): void {
    const element = inputRef.current;
    const start = element?.selectionStart ?? input.length;
    const end = element?.selectionEnd ?? input.length;
    const next = input.slice(0, start) + value + input.slice(end);
    setInput(next); setResult(null); setError("");
    requestAnimationFrame(() => { element?.focus(); element?.setSelectionRange(start + value.length, start + value.length); });
  }

  function backspace(): void {
    const element = inputRef.current;
    const start = element?.selectionStart ?? input.length;
    const end = element?.selectionEnd ?? input.length;
    if (start !== end) { updateInput(input.slice(0, start) + input.slice(end)); return; }
    if (start > 0) updateInput(input.slice(0, start - 1) + input.slice(start));
  }

  function runKeyAction(action: KeyAction): void {
    if (action === "clear") { updateInput(""); return; }
    if (action === "backspace") { backspace(); return; }
    if (action === "calculate") { void calculate(); return; }
    if (action === "answer") { if (result) insert(result.answer); return; }
    if (action === "matrix") { updateInput("det([[1,2],[3,4]])", "auto"); return; }
    if (action === "integral") { updateInput(cleanCalculusTarget(input), "integral"); return; }
    if (action === "derivative") { updateInput(cleanCalculusTarget(input), "derivative"); return; }
    if (action === "second-derivative") { const target = cleanCalculusTarget(input) || "x^4"; updateInput(`derivative(derivative(${target},x),x)`, "derivative"); return; }
    if (action === "limit") { updateInput("lim x->0 sin(x)/x", "limit"); return; }
    if (action === "series") { updateInput("1/n^2", "series"); return; }
    if (action === "product") { updateInput("x^2 * sin(x)", "derivative"); return; }
    if (action === "quotient") { updateInput("ln(x) / x", "derivative"); return; }
    if (action === "chain") { updateInput("sin(x^2 + 1)", "derivative"); return; }
    if (action === "definite-integral") { updateInput("x^2 from 0 to 1", "integral"); return; }
    if (action === "constant") { void calculate(); return; }
    if (action === "integration-parts") { updateInput("x * e^x", "integral"); return; }
    if (action === "substitution") { updateInput("2*x * cos(x^2)", "integral"); return; }
    if (action === "limit-zero") { updateInput("lim x->0 sin(x)/x", "limit"); return; }
    if (action === "limit-infinity") { updateInput("lim x->Infinity (2*x^2+1)/(x^2-3)", "limit"); return; }
    if (action === "left-limit") { updateInput("lim x->0- 1/x", "limit"); return; }
    if (action === "right-limit") { updateInput("lim x->0+ 1/x", "limit"); return; }
    if (action === "rational-limit") updateInput("lim x->1 (x^2-1)/(x-1)", "limit");
  }

  async function calculate(): Promise<void> {
    if (!input.trim() || loading) { if (!input.trim()) setError("Enter an expression to calculate."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const submittedInput = angleMode === "DEG" && operation === "auto" ? applyDegreeMode(input) : input;
      const response = await fetch("/api/calculus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: submittedInput, operation }) });
      const body = await response.json() as OnlineCalculatorResultData & { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not calculate this expression.");
      setResult(body);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not calculate this expression."); }
    finally { setLoading(false); }
  }

  const allKeys = [...baseKeys, ...specializedKeys, ...numberKeys];
  const operationLabel = operation === "auto" ? "Scientific" : operation.charAt(0).toUpperCase() + operation.slice(1);
  const operationTabs: readonly (readonly [string, Operation])[] = variant !== "calculus"
    ? [[variant === "derivative" ? "First derivative" : variant === "integral" ? "Integral of f(x)" : "Limit of f(x)", preset.operation]]
    : [["Scientific", "auto"], ["Derivative", "derivative"], ["Integral", "integral"], ["Limit", "limit"], ["Series", "series"]];

  return (
    <section aria-label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} calculator`}>
      <div className="mx-auto max-w-[780px] rounded-[30px] border-4 border-[#182d3f] bg-[linear-gradient(145deg,#173149,#0b1d2c)] p-3 shadow-[0_24px_65px_rgba(14,35,58,.28),inset_0_1px_0_rgba(255,255,255,.16)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3 px-1 text-white">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">{variant.charAt(0).toUpperCase() + variant.slice(1)} mode</p><p className="mt-1 text-sm font-semibold text-white/90">{operationLabel}</p></div>
          <button type="button" role="switch" aria-label="Angle unit" aria-checked={angleMode === "DEG"} onClick={() => setAngleMode((current) => current === "RAD" ? "DEG" : "RAD")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <span>{angleMode}</span><span className={`relative h-5 w-9 rounded-full transition ${angleMode === "DEG" ? "bg-[#ff9f0a]" : "bg-[#557289]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${angleMode === "DEG" ? "left-[18px]" : "left-0.5"}`} /></span>
          </button>
        </div>
        <div className="rounded-2xl border border-[#8ba0a0] bg-[linear-gradient(145deg,#e7eeea,#cfdcd7)] p-4 shadow-[inset_0_2px_5px_rgba(24,45,63,.22)] sm:p-5">
          <label htmlFor={`calculator-screen-${variant}`} className="sr-only">Enter a mathematical expression</label>
          <textarea ref={inputRef} id={`calculator-screen-${variant}`} value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void calculate(); } }} rows={2} spellCheck={false} className="w-full resize-none bg-transparent font-mono text-lg font-semibold leading-7 text-[#10283c] outline-none sm:text-xl" placeholder={variant === "derivative" ? "Enter f(x), for example x^2 sin(x)" : variant === "integral" ? "Enter an integrand, for example x^2 cos(x)" : variant === "limit" ? "Enter a limit, for example lim x->0 sin(x)/x" : "Enter an expression or calculus problem"} />
          <div className="mt-2 flex min-h-12 items-end justify-between gap-4 border-t border-dashed border-[#9aaea8] pt-3"><span className="font-mono text-lg text-[#1d3a4d]">=</span><output className={`max-w-full overflow-x-auto text-right font-mono font-bold text-[#10283c] ${result ? "text-2xl sm:text-3xl" : "text-sm text-[#536b72]"}`} aria-live="polite">{loading ? "Calculating…" : result ? result.answer : error ? "Error" : "Ready"}</output></div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Calculation type">
          {operationTabs.map(([label, value]) => <button key={value} type="button" aria-pressed={operation === value} onClick={() => { setOperation(value); setResult(null); setError(""); }} className={`min-h-9 shrink-0 rounded-lg border px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${operation === value ? "border-[#a65300] bg-[#a65300] text-white" : "border-[#36536d] bg-[#203a50] text-blue-100 hover:bg-[#294963]"}`}>{label}</button>)}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5 min-[360px]:grid-cols-6 sm:gap-2">
          {allKeys.map((key, index) => <button key={`${key.label}-${index}`} type="button" aria-label={key.ariaLabel ?? key.label} onClick={() => key.action ? runKeyAction(key.action) : key.value && insert(key.value)} disabled={loading} className={`min-h-11 rounded-lg border px-1 font-mono text-xs font-semibold shadow-[0_2px_3px_rgba(0,0,0,.28)] transition active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 sm:min-h-12 sm:text-sm ${toneClasses[key.tone ?? "function"]}`}>{key.label === "⌫" ? <Delete className="mx-auto h-4 w-4" /> : key.label}</button>)}
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[780px] flex-wrap items-center justify-center gap-2">
        {preset.examples.map((example) => <button key={example.label} type="button" onClick={() => updateInput(example.input, example.operation)} className="rounded-full border border-[#c5d8ef] bg-white px-4 py-2 text-xs font-semibold text-[#314567] shadow-sm hover:border-[#0967ed] hover:text-[#0967ed]">{example.label}</button>)}
        <button type="button" onClick={() => updateInput("")} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c5d8ef] bg-white px-4 text-xs font-semibold text-[#637392] hover:border-[#0967ed] hover:text-[#0967ed]"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
      </div>
      {error && <div className="mx-auto mt-5 max-w-[780px] rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
      {result && <div className="mx-auto mt-6 max-w-[980px] rounded-2xl border border-[#dbe6f6] bg-[#fbfdff] p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#0a234f]">Step-by-step solution</h2><span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><Check className="h-3.5 w-3.5" />Solved</span></div><OnlineCalculatorResult result={result} /></div>}
    </section>
  );
}
