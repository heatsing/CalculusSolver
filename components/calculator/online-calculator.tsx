"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import type { OnlineCalculatorResultData } from "@/components/calculator/online-calculator-result";

const OnlineCalculatorResult = dynamic(
  () => import("@/components/calculator/online-calculator-result").then((module) => module.OnlineCalculatorResult),
  {
    ssr: false,
    loading: () => <div className="mt-5 min-h-40 animate-pulse rounded-xl bg-[#eef5fd]" aria-hidden="true" />
  }
);

type Operation = "auto" | "derivative" | "integral" | "limit" | "series";

const tabs: Array<[string, Operation]> = [["Derivative", "derivative"], ["Integral", "integral"], ["Limit", "limit"], ["Series", "series"]];
const keys = [["x", "x"], ["x²", "x^2"], ["xⁿ", "x^"], ["√", "sqrt("], ["sin", "sin("], ["cos", "cos("], ["tan", "tan("], ["ln", "ln("], ["eˣ", "e^("], ["π", "pi"], ["(", "("], [")", ")"], ["a⁄b", "/"], ["∫", "integral "], ["d⁄dx", "d/dx "], ["lim", "lim x-> "], ["+", "+"], ["−", "-"], ["×", "*"], ["÷", "/"]] as const;
const examples: Array<{ label: string; input: string; operation: Operation }> = [
  { label: "x² + 3x", input: "d/dx (x^2 + 3x)", operation: "derivative" },
  { label: "sin(x) / x", input: "lim x->0 sin(x)/x", operation: "limit" },
  { label: "e² ln(x)", input: "integral e^2 * ln(x) dx", operation: "integral" }
];

export function OnlineCalculator(): React.JSX.Element {
  const [input, setInput] = React.useState("d/dx (x^3 * sin(x))");
  const [operation, setOperation] = React.useState<Operation>("derivative");
  const [result, setResult] = React.useState<OnlineCalculatorResultData | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  function insert(value: string): void { const el = inputRef.current; const start = el?.selectionStart ?? input.length; const end = el?.selectionEnd ?? input.length; setInput(input.slice(0, start) + value + input.slice(end)); setResult(null); requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + value.length, start + value.length); }); }
  async function calculate(): Promise<void> { if (!input.trim() || loading) { if (!input.trim()) setError("Enter an expression to calculate."); return; } setLoading(true); setError(""); setResult(null); try { const response = await fetch("/api/calculus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input, operation }) }); const body = await response.json() as OnlineCalculatorResultData & { error?: string }; if (!response.ok) throw new Error(body.error || "Could not calculate this expression."); setResult(body); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not calculate this expression."); } finally { setLoading(false); } }
  function clear(): void { setInput(""); setResult(null); setError(""); inputRef.current?.focus(); }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dbe6f6] bg-white shadow-[0_12px_40px_rgba(42,88,155,.09)]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 border-b border-[#dbe6f6] p-5 lg:border-b-0 lg:border-r sm:p-6">
          <div className="flex gap-1 overflow-x-auto border-b border-[#dbe6f6]" role="tablist" aria-label="Calculation type">{tabs.map(([label, value]) => <button key={value} type="button" role="tab" aria-selected={operation === value} onClick={() => { setOperation(value); setResult(null); }} className={`min-w-fit border-b-2 px-4 pb-3 text-xs font-semibold ${operation === value ? "border-[#0967ed] text-[#0967ed]" : "border-transparent text-[#637392] hover:text-[#0a234f]"}`}>{label}</button>)}</div>
          <label htmlFor="calculus-expression" className="mt-5 block text-xs font-medium text-[#314567]">Enter your function</label>
          <textarea ref={inputRef} id="calculus-expression" value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void calculate(); }} rows={3} className="mt-2 w-full resize-none rounded-lg border border-[#cbd9ed] bg-white px-4 py-4 font-mono text-base text-[#0a234f] outline-none focus:border-[#0967ed] focus:ring-2 focus:ring-blue-100" placeholder="Enter a function, for example x^3 * sin(x)" />
          <div className="mt-5 grid grid-cols-5 gap-2">{keys.map(([label, value]) => <button key={label} type="button" onClick={() => insert(value)} className="min-h-11 rounded-lg border border-[#dbe6f6] bg-[#fbfdff] px-2 font-mono text-sm text-[#203b67] shadow-sm transition hover:border-[#8eb9f8] hover:bg-[#eff6ff] hover:text-[#0967ed]">{label}</button>)}</div>
          <div className="mt-5 flex flex-wrap items-center gap-3"><label className="text-xs text-[#637392]">Variable: <select className="ml-1 rounded-md border border-[#dbe6f6] bg-white px-2 py-2 text-[#0a234f]" aria-label="Variable"><option>x</option></select></label><button type="button" onClick={() => void calculate()} disabled={loading} className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0967ed] px-6 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#0757c9] disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? "Calculating…" : "Calculate"}</button><button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#cbd9ed] px-4 text-sm text-[#314567] hover:bg-[#f4f8fe]"><RotateCcw className="h-4 w-4" /> Clear</button></div>
          <div className="mt-6 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs text-[#637392]">Examples:</span>{examples.map((example) => <button key={example.label} type="button" onClick={() => { setInput(example.input); setOperation(example.operation); setResult(null); setError(""); }} className="rounded-md border border-[#b8d2f7] bg-[#f5f9ff] px-3 py-2 font-mono text-xs text-[#314567] hover:border-[#0967ed] hover:text-[#0967ed]">{example.label}</button>)}</div>
        </div>

        <div className="min-h-[520px] min-w-0 bg-[#fbfdff] p-5 sm:p-6" aria-live="polite">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#0a234f]">Solution</h2>{result && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><Check className="h-3.5 w-3.5" /> Solved</span>}</div>
          {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
          {!result && !error && <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#0967ed]"><Sparkles className="h-7 w-7" /></span><h3 className="mt-5 font-bold text-[#0a234f]">Your solution will appear here</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#637392]">Choose a topic, enter a function, then click Calculate to see the answer and step-by-step explanation.</p></div>}
          {result && <OnlineCalculatorResult result={result} />}
        </div>
      </div>
    </section>
  );
}
