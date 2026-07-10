"use client";

import * as React from "react";
import { Check, ChevronDown, Clipboard, Loader2 } from "lucide-react";
import { MathDisplay } from "@/components/math/math-display";
import { CalculusGraph } from "@/components/calculator/calculus-graph";

type Operation = "auto" | "derivative" | "integral" | "limit" | "series";
type ApiResult = {
  type: string;
  expression: string;
  normalized: string;
  answer: string;
  latex: string;
  steps: string[];
  graph: { expression: string; variable: string; domain: [number, number] } | null;
};

const keys = [
  ["x²", "x^2"], ["√", "sqrt("], ["π", "pi"], ["e", "e"],
  ["sin", "sin("], ["cos", "cos("], ["tan", "tan("], ["log", "log("], ["ln", "ln("],
  ["∫", "∫"], ["d/dx", "d/dx "], ["lim", "lim x→0 "], ["( )", "()"],
  ["+", "+"], ["−", "-"], ["×", "*"], ["÷", "/"], ["=", "="]
] as const;

const examples: Array<{ label: string; input: string; operation: Operation }> = [
  { label: "Derivative", input: "d/dx x³", operation: "derivative" },
  { label: "Integral", input: "∫x² dx", operation: "integral" },
  { label: "Limit", input: "lim x→0 sin(x)/x", operation: "limit" },
  { label: "Series", input: "sum 1/n²", operation: "series" }
];

export function OnlineCalculator(): React.JSX.Element {
  const [input, setInput] = React.useState("");
  const [operation, setOperation] = React.useState<Operation>("auto");
  const [result, setResult] = React.useState<ApiResult | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  function insert(value: string): void {
    const element = inputRef.current;
    if (!element) return setInput((current) => current + value);
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const next = input.slice(0, start) + value + input.slice(end);
    setInput(next);
    setResult(null);
    requestAnimationFrame(() => {
      element.focus();
      const cursor = value === "()" ? start + 1 : start + value.length;
      element.setSelectionRange(cursor, cursor);
    });
  }

  async function calculate(): Promise<void> {
    if (!input.trim() || loading) {
      if (!input.trim()) setError("Enter an expression to calculate.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/calculus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, operation })
      });
      const body = await response.json() as ApiResult & { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not calculate this expression.");
      setResult(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not calculate this expression.");
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer(): Promise<void> {
    if (!result) return;
    await navigator.clipboard.writeText(result.answer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function chooseExample(example: typeof examples[number]): void {
    setInput(example.input);
    setOperation(example.operation);
    setResult(null);
    setError("");
    inputRef.current?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="border border-border bg-white">
        <div className="border-b border-border p-5 sm:p-8">
          <label htmlFor="calculus-expression" className="text-sm font-medium text-heading">Enter expression</label>
          <textarea
            ref={inputRef}
            id="calculus-expression"
            value={input}
            onChange={(event) => { setInput(event.target.value); setResult(null); setError(""); }}
            onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") void calculate(); }}
            placeholder="e.g. derivative of x squared or lim x→0 sin(x)/x"
            rows={2}
            className="mt-3 w-full resize-none border-0 border-b-2 border-heading bg-secondary-background px-4 py-4 font-mono text-lg text-heading outline-none transition-colors placeholder:text-body/60 focus:border-primary"
          />
          <p className="mt-2 text-xs text-body">Use mathematical notation or natural language. Press Ctrl + Enter to calculate.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <label htmlFor="calculus-operation" className="text-sm font-medium text-heading">Operation</label>
              <div className="relative mt-2">
                <select id="calculus-operation" value={operation} onChange={(event) => setOperation(event.target.value as Operation)} className="h-12 w-full appearance-none border border-border bg-secondary-background px-4 pr-10 text-sm text-heading outline-none focus:border-primary">
                  <option value="auto">Auto Detect</option><option value="derivative">Derivative</option><option value="integral">Integral</option><option value="limit">Limit</option><option value="series">Series</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-body" />
              </div>
            </div>
            <button type="button" onClick={() => void calculate()} disabled={loading} className="flex h-12 min-w-44 items-center justify-center gap-2 bg-primary px-7 text-sm text-white transition-colors hover:bg-primary-hover disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Calculating…" : "Calculate"}
            </button>
          </div>
        </div>

        <div className="border-b border-border bg-secondary-background p-4 sm:p-5">
          <p className="mb-3 text-xs text-body">Math keyboard</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
            {keys.map(([label, value]) => <button key={label} type="button" onClick={() => insert(value)} className="min-h-11 border border-border bg-white px-2 font-mono text-sm text-heading hover:border-primary hover:text-primary">{label}</button>)}
          </div>
        </div>

        {error && <div className="border-b border-error bg-error/5 px-5 py-4 text-sm text-error" role="alert">{error}</div>}

        {result && (
          <div aria-live="polite" className="animate-fade-in">
            <section className="border-b border-border p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-mono text-xs uppercase text-body">Result · {result.type}</p><p className="mt-3 break-words font-mono text-sm text-body">{result.expression}</p></div>
                <button type="button" onClick={() => void copyAnswer()} className="flex min-h-11 items-center gap-2 border border-border px-3 text-sm text-body hover:border-primary hover:text-primary">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? "Copied" : "Copy answer"}</button>
              </div>
              <div className="mt-7 overflow-x-auto border-l-2 border-primary bg-secondary-background px-5 py-6 text-2xl text-heading sm:text-3xl"><MathDisplay latex={result.latex} display="block" showCopy={false} /></div>
              <p className="mt-3 break-all font-mono text-sm text-body">= {result.answer}</p>
            </section>
            <section className="border-b border-border p-5 sm:p-8">
              <h3 className="text-xl font-normal text-heading">Steps</h3>
              <div className="mt-4 divide-y divide-border border-y border-border">
                {result.steps.map((step, index) => <details key={step} open={index === 0} className="group py-4"><summary className="cursor-pointer list-none font-medium text-heading"><span className="mr-3 font-mono text-xs text-primary">0{index + 1}</span>{step}</summary></details>)}
              </div>
            </section>
            {result.graph && <CalculusGraph {...result.graph} />}
          </div>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-normal text-heading">Try These Examples</h2>
        <div className="mt-4 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => <button key={example.label} type="button" onClick={() => chooseExample(example)} className="min-h-28 border-b border-r border-border bg-white p-4 text-left transition-colors hover:bg-secondary-background"><span className="text-xs text-primary">{example.label}</span><span className="mt-3 block font-mono text-sm text-heading">{example.input}</span></button>)}
        </div>
      </section>
    </div>
  );
}
