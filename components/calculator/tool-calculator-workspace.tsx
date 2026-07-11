"use client";

import * as React from "react";
import { Check, Clipboard, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { MathDisplay } from "@/components/math/math-display";
import { GraphCard } from "@/components/solver/graph-card";
import { useSolver } from "@/hooks/use-solver";
import { toSolverMode, withOperationHint } from "@/lib/calculator-mode";

type WorkspacePreset = {
  label: string;
  inputLabel: string;
  placeholder: string;
  initial: string;
  keys: readonly (readonly [string, string])[];
  examples: readonly string[];
  parameter?: string;
};

const algebraKeys = [["x", "x"], ["x²", "x^2"], ["xⁿ", "x^"], ["+", "+"], ["−", "-"], ["×", "*"], ["÷", "/"], ["=", "="], ["(", "("], [")", ")"], ["√", "sqrt("], ["|x|", "abs("]] as const;
const calculusKeys = [["x", "x"], ["x²", "x^2"], ["xⁿ", "x^"], ["√", "sqrt("], ["sin", "sin("], ["cos", "cos("], ["tan", "tan("], ["ln", "ln("], ["eˣ", "e^("], ["π", "pi"], ["(", "("], [")", ")"]] as const;
const numericKeys = [["7", "7"], ["8", "8"], ["9", "9"], ["÷", "/"], ["4", "4"], ["5", "5"], ["6", "6"], ["×", "*"], ["1", "1"], ["2", "2"], ["3", "3"], ["−", "-"], ["0", "0"], [".", "."], ["(", "("], ["+", "+"]] as const;

function presetFor(mode: string, title: string): WorkspacePreset {
  if (mode === "derivative") return { label: "Derivative", inputLabel: "Enter your function", placeholder: "For example x^3 * sin(x)", initial: "x^3 * sin(x)", keys: calculusKeys, examples: ["x^2 + 3x", "sin(x) * e^x", "ln(x) / x"], parameter: "Variable: x" };
  if (mode === "integral") return { label: "Integral", inputLabel: "Enter an integrand", placeholder: "For example x^2 * cos(x)", initial: "x^2 * cos(x)", keys: calculusKeys, examples: ["sin(x)", "x^2 from 0 to 1", "e^x * cos(x)"], parameter: "Variable: x" };
  if (mode === "limit") return { label: "Limit", inputLabel: "Enter a limit", placeholder: "For example sin(x)/x as x approaches 0", initial: "sin(x)/x as x approaches 0", keys: calculusKeys, examples: ["sin(x)/x as x approaches 0", "(x^2-1)/(x-1) as x approaches 1", "1/x as x approaches Infinity"], parameter: "Variable: x" };
  if (mode === "gradient") return { label: "Gradient", inputLabel: "Enter a multivariable function", placeholder: "For example x^2 + y^2", initial: "x^2 + y^2", keys: [...calculusKeys, ["y", "y"]], examples: ["x^2 + y^2", "x*y + y^2", "sin(x) * cos(y)"], parameter: "Variables: x, y" };
  if (mode === "graph") return { label: "Graph", inputLabel: "Enter a function to plot", placeholder: "For example x^2 - 4*x + 3", initial: "x^2 - 4*x + 3", keys: calculusKeys, examples: ["x^2", "sin(x)", "1/x"], parameter: "Variable: x" };
  if (mode === "factoring") return { label: "Factor", inputLabel: "Enter an expression", placeholder: "For example x^2 - 5*x + 6", initial: "x^2 - 5*x + 6", keys: algebraKeys, examples: ["x^2 - 9", "x^2 - 5*x + 6", "2*x^2 + 4*x"] };
  if (mode === "simplify") return { label: "Simplify", inputLabel: "Enter an expression", placeholder: "For example (x^2 - 1)/(x - 1)", initial: "(x^2 - 1)/(x - 1)", keys: algebraKeys, examples: ["3*x + 2*x - 4", "(x^2 - 1)/(x - 1)", "2*(x + 3) - x"] };
  if (mode === "equation" || mode === "algebra") {
    const quadratic = title.toLowerCase().includes("quadratic");
    return { label: quadratic ? "Quadratic" : "Equation", inputLabel: quadratic ? "Enter a quadratic equation" : "Enter an equation", placeholder: quadratic ? "For example x^2 - 5*x + 6 = 0" : "For example 2*x + 5 = 17", initial: quadratic ? "x^2 - 5*x + 6 = 0" : "2*x + 5 = 17", keys: algebraKeys, examples: quadratic ? ["x^2 - 5*x + 6 = 0", "x^2 - 9 = 0", "2*x^2 + 3*x - 2 = 0"] : ["2*x + 5 = 17", "x^2 = 16", "x + y = 5 and x - y = 1"], parameter: "Solve for: x" };
  }
  if (mode === "fractions") return { label: "Fractions", inputLabel: "Enter a fraction expression", placeholder: "For example 1/2 + 1/3", initial: "1/2 + 1/3", keys: numericKeys, examples: ["1/2 + 1/3", "3/4 * 2/5", "7/8 - 1/4"] };
  if (mode === "matrix") return { label: "Matrix", inputLabel: "Enter a matrix operation", placeholder: "For example det([[1,2],[3,4]])", initial: "det([[1,2],[3,4]])", keys: [["[", "["], ["]", "]"], [",", ","], ["+", "+"], ["−", "-"], ["×", "*"], ["det", "det("], ["inv", "inv("], ["(", "("], [")", ")"]], examples: ["det([[1,2],[3,4]])", "transpose([[1,2],[3,4]])", "[[1,2],[3,4]] + [[2,0],[1,2]]"] };
  if (mode === "average") return { label: "Average", inputLabel: "Enter numbers", placeholder: "For example 4, 8, 12", initial: "4, 8, 12", keys: numericKeys, examples: ["4, 8, 12", "10, 15, 20, 25", "2.5, 3.5, 5"] };
  if (mode === "percentage") return { label: "Percentage", inputLabel: "Enter a percentage problem", placeholder: "For example 15% of 200", initial: "15% of 200", keys: [...numericKeys, ["%", "%"], ["of", " of "]], examples: ["15% of 200", "25% of 80", "12.5% of 240"] };
  if (mode === "probability") return { label: "Probability", inputLabel: "Enter favorable and total outcomes", placeholder: "For example 3 out of 10", initial: "3 out of 10", keys: numericKeys, examples: ["3 out of 10", "1 out of 6", "12 out of 52"] };
  if (mode === "roots") return { label: "Roots", inputLabel: "Enter a radical expression", placeholder: "For example sqrt(81)", initial: "sqrt(81)", keys: [...numericKeys, ["√", "sqrt("], ["∛", "cbrt("]], examples: ["sqrt(81)", "sqrt(144)", "cbrt(27)"] };
  if (mode === "logarithms") return { label: "Logarithms", inputLabel: "Enter a logarithm", placeholder: "For example log10(1000)", initial: "log10(1000)", keys: [...numericKeys, ["log", "log10("], ["ln", "ln("], ["e", "e"]], examples: ["log10(1000)", "ln(e^2)", "log(8, 2)"] };
  if (mode === "lcm") return { label: "LCM", inputLabel: "Enter integers", placeholder: "For example 4 and 6", initial: "4 and 6", keys: numericKeys, examples: ["4 and 6", "12 and 18", "8, 12, 20"] };
  if (mode === "exponents") return { label: "Exponents", inputLabel: "Enter an exponent expression", placeholder: "For example 2^10", initial: "2^10", keys: [...numericKeys, ["x²", "^2"], ["xⁿ", "^"]], examples: ["2^10", "9^(1/2)", "5^0"] };
  return { label: "Calculate", inputLabel: "Enter an expression", placeholder: "For example 2 + 3 * 4", initial: "2 + 3 * 4", keys: numericKeys, examples: ["2 + 3 * 4", "sqrt(144)", "sin(pi/2)"] };
}

export function ToolCalculatorWorkspace({ title, mode }: { title: string; mode: string }): React.JSX.Element {
  const preset = React.useMemo(() => presetFor(mode, title), [mode, title]);
  const [input, setInput] = React.useState(preset.initial);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { state, solve, reset } = useSolver();

  function insert(value: string): void {
    const element = inputRef.current;
    const start = element?.selectionStart ?? input.length;
    const end = element?.selectionEnd ?? input.length;
    const next = input.slice(0, start) + value + input.slice(end);
    setInput(next);
    reset();
    requestAnimationFrame(() => { element?.focus(); element?.setSelectionRange(start + value.length, start + value.length); });
  }

  async function calculate(): Promise<void> {
    if (!input.trim() || state.status === "loading") return;
    await solve(withOperationHint(input.trim(), mode), toSolverMode(mode));
  }

  function clear(): void { setInput(""); reset(); inputRef.current?.focus(); }

  async function copyAnswer(): Promise<void> {
    if (state.status !== "success") return;
    await navigator.clipboard.writeText(state.result.answer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dbe6f6] bg-white shadow-[0_12px_40px_rgba(42,88,155,.09)]">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={(event) => { event.preventDefault(); void calculate(); }} className="min-w-0 border-b border-[#dbe6f6] p-5 lg:border-b-0 lg:border-r sm:p-6">
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#dbe6f6] pb-3">
            <span className="rounded-md bg-[#eaf3ff] px-4 py-2 text-sm font-semibold text-[#075bc7]">{preset.label}</span>
            <span className="px-3 py-2 text-xs font-medium text-[#637392]">Exact answer</span>
            <span className="px-3 py-2 text-xs font-medium text-[#637392]">Step-by-step</span>
          </div>
          <label htmlFor={`tool-input-${mode}`} className="mt-5 block text-sm font-semibold text-[#203b67]">{preset.inputLabel}</label>
          <textarea ref={inputRef} id={`tool-input-${mode}`} value={input} onChange={(event) => { setInput(event.target.value); reset(); }} rows={4} className="mt-2 w-full resize-none rounded-xl border border-[#b9d1f2] bg-white px-4 py-4 font-mono text-base leading-7 text-[#0a234f] outline-none transition focus:border-[#0967ed] focus:ring-2 focus:ring-blue-100" placeholder={preset.placeholder} />
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {preset.keys.map(([label, value]) => <button key={`${label}-${value}`} type="button" onClick={() => insert(value)} className="min-h-11 rounded-lg border border-[#dbe6f6] bg-[#fbfdff] px-2 font-mono text-sm font-medium text-[#203b67] shadow-sm transition hover:border-[#8eb9f8] hover:bg-[#eff6ff] hover:text-[#0967ed]">{label}</button>)}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {preset.parameter && <span className="rounded-md border border-[#dbe6f6] bg-[#f8fbff] px-3 py-2 text-xs font-medium text-[#637392]">{preset.parameter}</span>}
            <button type="submit" disabled={!input.trim() || state.status === "loading"} className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0967ed] px-6 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#0757c9] disabled:opacity-60">{state.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{state.status === "loading" ? "Calculating..." : "Calculate"}</button>
            <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#cbd9ed] px-4 text-sm font-medium text-[#314567] hover:bg-[#f4f8fe]"><RotateCcw className="h-4 w-4" />Clear</button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-medium text-[#637392]">Examples:</span>{preset.examples.map((example) => <button key={example} type="button" onClick={() => { setInput(example); reset(); }} className="rounded-md border border-[#b8d2f7] bg-[#f5f9ff] px-3 py-2 font-mono text-xs text-[#314567] hover:border-[#0967ed] hover:text-[#0967ed]">{example}</button>)}</div>
        </form>

        <div className="min-h-[560px] min-w-0 bg-[#fbfdff] p-5 sm:p-6" aria-live="polite" aria-busy={state.status === "loading"}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#0a234f]">Solution</h2>{state.status === "success" && <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><Check className="h-3.5 w-3.5" />Solved</span>}</div>
          {state.status === "idle" && <div className="flex min-h-[470px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-[#0967ed]"><Sparkles className="h-7 w-7" /></span><h3 className="mt-5 font-bold text-[#0a234f]">Your solution will appear here</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#637392]">Enter a problem, use the dedicated math keys, then calculate to see the answer and explanation.</p></div>}
          {state.status === "loading" && <div className="flex min-h-[470px] flex-col items-center justify-center text-center"><Loader2 className="h-9 w-9 animate-spin text-[#0967ed]" /><p className="mt-4 font-semibold text-[#203b67]">Calculating your answer...</p></div>}
          {state.status === "error" && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700" role="alert"><strong>Could not calculate this problem.</strong><p className="mt-2">{state.message}</p></div>}
          {state.status === "success" && <div className="mt-5 animate-fade-in"><div className="overflow-x-auto rounded-xl border border-[#dbe6f6] bg-white p-5 text-xl text-[#0a234f]"><MathDisplay latex={state.result.answerLatex || state.result.answer} display="block" showCopy={false} /></div><section className="mt-4 rounded-xl border border-[#dbe6f6] bg-white p-4"><h3 className="text-sm font-bold text-[#0a234f]">Step-by-step explanation</h3><ol className="mt-4 space-y-4">{state.result.steps.map((step) => <li key={`${step.number}-${step.title}`} className="flex gap-3 text-sm leading-6 text-[#314567]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0967ed] text-xs font-bold text-white">{step.number}</span><span><strong className="block text-[#203b67]">{step.title}</strong>{step.explanation}</span></li>)}</ol></section>{state.result.graph.available && <div className="mt-4"><GraphCard result={state.result} /></div>}<button type="button" onClick={() => void copyAnswer()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#cbd9ed] bg-white px-4 text-sm font-medium text-[#314567] hover:border-[#0967ed] hover:text-[#0967ed]">{copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied ? "Copied" : "Copy answer"}</button></div>}
        </div>
      </div>
    </section>
  );
}
