"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  formatFractionDecimal,
  formatPercent,
  fractionToPercent,
  generateEquivalentFractions,
  simplifyFraction
} from "@/lib/fractions";

export function FractionConverter({ initialNumerator = 1, initialDenominator = 2 }: {
  initialNumerator?: number;
  initialDenominator?: number;
}): React.JSX.Element {
  const [numerator, setNumerator] = useState(String(initialNumerator));
  const [denominator, setDenominator] = useState(String(initialDenominator));
  const parsedNumerator = Number(numerator);
  const parsedDenominator = Number(denominator);
  const valid = Number.isInteger(parsedNumerator) && Number.isInteger(parsedDenominator) && parsedDenominator !== 0;
  const result = useMemo(() => {
    if (!valid) return null;
    return {
      simplified: simplifyFraction(parsedNumerator, parsedDenominator),
      decimal: formatFractionDecimal(parsedNumerator, parsedDenominator),
      percent: formatPercent(fractionToPercent(parsedNumerator, parsedDenominator)),
      equivalents: generateEquivalentFractions(parsedNumerator, parsedDenominator, 3)
    };
  }, [parsedNumerator, parsedDenominator, valid]);

  return (
    <div className="rounded-2xl border border-[#cbdcf3] bg-white p-5 shadow-[0_12px_35px_rgba(7,31,74,0.08)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[#071f4a]">Fraction Converter</h2>
        <button type="button" onClick={() => { setNumerator(String(initialNumerator)); setDenominator(String(initialDenominator)); }} className="inline-flex items-center gap-2 rounded-lg border border-[#cbdcf3] px-3 py-2 text-sm font-semibold text-[#405577] hover:bg-[#f2f7fe]">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
        </button>
      </div>
      <p className="mt-2 text-sm text-[#5f6f8d]">Enter whole-number numerator and denominator values. Results update instantly.</p>
      <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <label className="text-sm font-semibold text-[#071f4a]">Numerator<input value={numerator} onChange={(event) => setNumerator(event.target.value)} inputMode="numeric" className="mt-2 w-full rounded-xl border border-[#b9cde9] px-4 py-3 text-lg outline-none focus:border-[#0967ed] focus:ring-2 focus:ring-[#0967ed]/20" aria-label="Numerator" /></label>
        <span className="mt-6 hidden text-[#0967ed] sm:block"><ArrowRight aria-hidden="true" /></span>
        <label className="text-sm font-semibold text-[#071f4a]">Denominator<input value={denominator} onChange={(event) => setDenominator(event.target.value)} inputMode="numeric" className="mt-2 w-full rounded-xl border border-[#b9cde9] px-4 py-3 text-lg outline-none focus:border-[#0967ed] focus:ring-2 focus:ring-[#0967ed]/20" aria-label="Denominator" /></label>
      </div>
      {!valid || !result ? <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Use integers and make sure the denominator is not zero.</p> : (
        <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-live="polite">
          <Result label="Simplified" value={`${result.simplified.numerator}/${result.simplified.denominator}`} />
          <Result label="Decimal" value={result.decimal} />
          <Result label="Percent" value={result.percent} />
          <div className="rounded-xl bg-[#f2f7fe] p-4 sm:col-span-3"><span className="text-xs font-bold uppercase tracking-wider text-[#5f6f8d]">Equivalent fractions</span><p className="mt-2 font-semibold text-[#071f4a]">{result.equivalents.map((item) => `${item.numerator}/${item.denominator}`).join(" · ")}</p></div>
        </div>
      )}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }): React.JSX.Element {
  return <div className="rounded-xl border border-[#d9e5f4] p-4"><span className="text-xs font-bold uppercase tracking-wider text-[#5f6f8d]">{label}</span><p className="mt-2 text-xl font-bold text-[#0967ed]">{value}</p></div>;
}
