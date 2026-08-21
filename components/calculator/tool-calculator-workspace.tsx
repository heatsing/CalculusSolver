"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Check, Delete, Loader2, RotateCcw } from "lucide-react";
import { useSolver } from "@/hooks/use-solver";
import { toSolverMode, withOperationHint } from "@/lib/calculator-mode";
import { getCalculatorWorkspaceKeys, getCalculatorWorkspaceProfile, type CalculatorWorkspaceKey } from "@/data/calculator-workspace-profiles";

const ToolCalculatorResult = dynamic(
  () => import("@/components/calculator/tool-calculator-result").then((module) => module.ToolCalculatorResult),
  { ssr: false, loading: () => <div className="mt-5 min-h-40 animate-pulse rounded-xl bg-[#eef5fd]" aria-hidden="true" /> }
);

const toneClasses: Record<NonNullable<CalculatorWorkspaceKey["tone"]>, string> = {
  number: "border-[#36536d] bg-[#203a50] text-white hover:bg-[#294963]",
  function: "border-[#36536d] bg-[#29465e] text-[#f5f9ff] hover:bg-[#355873]",
  special: "border-[#315675] bg-[#274b67] text-[#eaf5ff] hover:bg-[#356382]",
  operator: "border-[#a65300] bg-[#a65300] text-white hover:bg-[#b85d00]"
};

export function ToolCalculatorWorkspace({ title, mode }: { title: string; mode: string }): React.JSX.Element {
  const profile = React.useMemo(() => getCalculatorWorkspaceProfile(mode, title), [mode, title]);
  const keys = React.useMemo(() => getCalculatorWorkspaceKeys(profile), [profile]);
  const [input, setInput] = React.useState(profile.initial);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { state, solve, reset } = useSolver();

  React.useEffect(() => {
    setInput(profile.initial);
    reset();
  // `reset` is intentionally omitted because the hook returns a new function each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function focusAt(position: number): void {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(position, position);
    });
  }

  function insert(value: string): void {
    const element = inputRef.current;
    const start = element?.selectionStart ?? input.length;
    const end = element?.selectionEnd ?? input.length;
    setInput(input.slice(0, start) + value + input.slice(end));
    reset();
    focusAt(start + value.length);
  }

  function applyKey(item: CalculatorWorkspaceKey): void {
    if (item.behavior === "replace") {
      setInput(item.value);
      reset();
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    insert(item.value);
  }

  function backspace(): void {
    const element = inputRef.current;
    const start = element?.selectionStart ?? input.length;
    const end = element?.selectionEnd ?? input.length;
    if (start !== end) {
      setInput(input.slice(0, start) + input.slice(end));
      reset();
      focusAt(start);
      return;
    }
    if (start > 0) {
      setInput(input.slice(0, start - 1) + input.slice(start));
      reset();
      focusAt(start - 1);
    }
  }

  async function calculate(): Promise<void> {
    if (!input.trim() || state.status === "loading") return;
    await solve(withOperationHint(input.trim(), mode), toSolverMode(mode));
  }

  function clear(): void {
    setInput("");
    reset();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const screenAnswer = state.status === "loading" ? "Calculating…"
    : state.status === "success" ? state.result.answer
      : state.status === "error" ? "Check input" : "Ready";

  return (
    <section aria-label={`${title} interactive calculator`}>
      <form onSubmit={(event) => { event.preventDefault(); void calculate(); }} aria-busy={state.status === "loading"} className="mx-auto max-w-[780px] rounded-[30px] border-4 border-[#182d3f] bg-[linear-gradient(145deg,#173149,#0b1d2c)] p-3 shadow-[0_24px_65px_rgba(14,35,58,.28),inset_0_1px_0_rgba(255,255,255,.16)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3 px-1 text-white">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">{profile.label} mode</p><p className="mt-1 text-sm font-semibold text-white/90">Exact answer · Step-by-step</p></div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-blue-100">ONLINE</span>
        </div>

        <div className="rounded-2xl border border-[#8ba0a0] bg-[linear-gradient(145deg,#e7eeea,#cfdcd7)] p-4 shadow-[inset_0_2px_5px_rgba(24,45,63,.22)] sm:p-5">
          <label htmlFor={`tool-input-${mode}`} className="block text-xs font-bold uppercase tracking-wider text-[#536b72]">{profile.inputLabel}</label>
          <textarea ref={inputRef} id={`tool-input-${mode}`} value={input} onChange={(event) => { setInput(event.target.value); reset(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void calculate(); } }} rows={2} spellCheck={false} className="mt-2 w-full resize-none bg-transparent font-mono text-lg font-semibold leading-7 text-[#10283c] outline-none sm:text-xl" placeholder={profile.placeholder} aria-describedby={profile.parameter ? `tool-hint-${mode}` : undefined} />
          <div className="mt-2 flex min-h-12 items-end justify-between gap-4 border-t border-dashed border-[#9aaea8] pt-3"><span className="font-mono text-lg text-[#1d3a4d]">=</span><output className={`max-w-[85%] overflow-x-auto text-right font-mono font-bold text-[#10283c] ${state.status === "success" ? "text-xl sm:text-2xl" : "text-sm text-[#536b72]"}`} aria-live="polite">{screenAnswer}</output></div>
        </div>

        <div className="mt-3 flex min-h-9 items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 rounded-lg border border-[#a65300] bg-[#a65300] px-3 py-2 text-xs font-bold text-white">{profile.label}</span>{profile.parameter && <span id={`tool-hint-${mode}`} className="shrink-0 rounded-lg border border-[#36536d] bg-[#203a50] px-3 py-2 text-xs font-bold text-blue-100">{profile.parameter}</span>}</div>

        <div className="mt-3 grid grid-cols-5 gap-1.5 min-[360px]:grid-cols-6 sm:gap-2" aria-label={`${profile.label} keypad`}>
          <button type="button" onClick={clear} aria-label="Clear expression" className="min-h-11 rounded-lg border border-[#b91c1c] bg-[#dc2626] px-1 font-mono text-xs font-semibold text-white shadow-[0_2px_3px_rgba(0,0,0,.28)] hover:bg-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-12 sm:text-sm">C</button>
          <button type="button" onClick={backspace} aria-label="Delete previous character" className="min-h-11 rounded-lg border border-[#36536d] bg-[#29465e] px-1 text-white shadow-[0_2px_3px_rgba(0,0,0,.28)] hover:bg-[#355873] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-12"><Delete className="mx-auto h-4 w-4" /></button>
          {keys.map((item, index) => <button key={`${item.label}-${item.value}-${index}`} type="button" aria-label={item.ariaLabel ?? item.label} onClick={() => applyKey(item)} disabled={state.status === "loading"} className={`min-h-11 rounded-lg border px-1 font-mono text-[11px] font-semibold shadow-[0_2px_3px_rgba(0,0,0,.28)] transition active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 sm:min-h-12 sm:text-sm ${toneClasses[item.tone ?? "function"]}`}>{item.label}</button>)}
          <button type="submit" disabled={!input.trim() || state.status === "loading"} aria-label="Calculate result" className="min-h-11 rounded-lg border border-[#a65300] bg-[#a65300] px-1 font-mono text-sm font-bold text-white shadow-[0_2px_3px_rgba(0,0,0,.28)] hover:bg-[#b85d00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 sm:min-h-12">{state.status === "loading" ? <Loader2 className="mx-auto h-4 w-4 animate-spin motion-reduce:animate-none" /> : "="}</button>
        </div>
      </form>

      <div className="mx-auto mt-4 flex max-w-[780px] flex-wrap items-center justify-center gap-2">{profile.examples.map((example) => <button key={example} type="button" onClick={() => { setInput(example); reset(); requestAnimationFrame(() => inputRef.current?.focus()); }} className="rounded-full border border-[#c5d8ef] bg-white px-4 py-2 font-mono text-xs font-semibold text-[#314567] shadow-sm hover:border-[#0967ed] hover:text-[#0967ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed]">{example}</button>)}<button type="button" onClick={() => { setInput(profile.initial); reset(); }} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#c5d8ef] bg-white px-4 text-xs font-semibold text-[#637392] hover:border-[#0967ed] hover:text-[#0967ed]"><RotateCcw className="h-3.5 w-3.5" />Reset</button></div>

      {state.status === "error" && <div className="mx-auto mt-5 max-w-[780px] rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert"><strong>Could not calculate this problem.</strong><p className="mt-2">{state.message}</p></div>}
      {state.status === "success" && <div className="mx-auto mt-6 max-w-[980px] rounded-2xl border border-[#dbe6f6] bg-[#fbfdff] p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#0a234f]">Step-by-step solution</h2><span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"><Check className="h-3.5 w-3.5" />Solved</span></div><ToolCalculatorResult result={state.result} /></div>}
    </section>
  );
}
