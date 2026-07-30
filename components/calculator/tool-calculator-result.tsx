"use client";

import * as React from "react";
import { Check, Clipboard } from "lucide-react";
import { MathDisplay } from "@/components/math/math-display";
import { GraphCard } from "@/components/solver/graph-card";
import type { SolverResult } from "@/types/solver";

export function ToolCalculatorResult({ result }: { result: SolverResult }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  async function copyAnswer(): Promise<void> {
    await navigator.clipboard.writeText(result.answer);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-5 animate-fade-in">
      <div className="overflow-x-auto rounded-xl border border-[#dbe6f6] bg-white p-5 text-xl text-[#0a234f]">
        <MathDisplay latex={result.answerLatex || result.answer} display="block" showCopy={false} />
      </div>
      <section className="mt-4 rounded-xl border border-[#dbe6f6] bg-white p-4">
        <h3 className="text-sm font-bold text-[#0a234f]">Step-by-step explanation</h3>
        <ol className="mt-4 space-y-4">
          {result.steps.map((step) => (
            <li key={`${step.number}-${step.title}`} className="flex gap-3 text-sm leading-6 text-[#314567]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0967ed] text-xs font-bold text-white">
                {step.number}
              </span>
              <span>
                <strong className="block text-[#203b67]">{step.title}</strong>
                {step.explanation}
              </span>
            </li>
          ))}
        </ol>
      </section>
      {result.graph.available && (
        <div className="mt-4">
          <GraphCard result={result} />
        </div>
      )}
      <button
        type="button"
        onClick={() => void copyAnswer()}
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#cbd9ed] bg-white px-4 text-sm font-medium text-[#314567] hover:border-[#0967ed] hover:text-[#0967ed]"
      >
        {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        {copied ? "Copied" : "Copy answer"}
      </button>
    </div>
  );
}
