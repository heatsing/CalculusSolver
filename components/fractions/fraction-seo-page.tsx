import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FractionConverter } from "@/components/fractions/fraction-converter";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/seo/structured-data";
import {
  equivalentFractionSlug,
  fractionPageMetadata,
  percentDecimalSlug,
  relatedFractionCandidates,
  type FractionCandidate,
  type FractionFamily
} from "@/data/fraction-pages";
import {
  formatFractionDecimal,
  formatPercent,
  fractionToPercent,
  generateEquivalentFractions,
  gcd,
  hasTerminatingDecimal,
  simplifyFraction,
  toMixedNumber
} from "@/lib/fractions";
import { breadcrumbStructuredData, faqPageStructuredData, webPageStructuredData } from "@/lib/seo";

export function FractionSeoPage({ family, candidate }: { family: FractionFamily; candidate: FractionCandidate }): React.JSX.Element {
  const { numerator: n, denominator: d } = candidate;
  const fraction = `${n}/${d}`;
  const simplified = simplifyFraction(n, d);
  const simplifiedText = `${simplified.numerator}/${simplified.denominator}`;
  const decimal = formatFractionDecimal(n, d);
  const percent = formatPercent(fractionToPercent(n, d));
  const equivalents = generateEquivalentFractions(n, d, 6);
  const terminating = hasTerminatingDecimal(n, d);
  const decimalDisplay = terminating ? decimal : `approximately ${decimal.replace("…", "")}`;
  const percentDisplay = terminating ? percent : `approximately ${percent}`;
  const profile = buildValueContext(candidate);
  const meta = fractionPageMetadata(family, candidate);
  const isEquivalent = family === "equivalent-fractions";
  const hub = isEquivalent ? "/equivalent-fractions" : "/percent-and-decimal";
  const hubName = isEquivalent ? "Equivalent Fractions" : "Percent and Decimal";
  const crossLink = isEquivalent ? `/${percentDecimalSlug(candidate)}` : `/${equivalentFractionSlug(candidate)}`;
  const crossLabel = isEquivalent ? `See ${fraction} as a percent and decimal` : `Find fractions equivalent to ${fraction}`;
  const directAnswer = isEquivalent
    ? `${equivalents[0].numerator}/${equivalents[0].denominator}, ${equivalents[1].numerator}/${equivalents[1].denominator}, and ${equivalents[2].numerator}/${equivalents[2].denominator} are equivalent to ${fraction}.`
    : `${fraction} is ${decimalDisplay} as a decimal and ${percentDisplay} as a percentage.`;
  const faq = buildFaq(family, candidate, decimalDisplay, percentDisplay, simplifiedText, equivalents[0]);
  const related = relatedFractionCandidates(candidate);

  return <div className="min-h-screen bg-[#f8fbff] text-[#071f4a]">
    <StructuredData data={[
      webPageStructuredData({ name: meta.h1, description: meta.description, path: meta.path, updatedAt: "2026-08-22" }),
      breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: hubName, path: hub }, { name: fraction, path: meta.path }]),
      faqPageStructuredData(faq)
    ]} />
    <Header />
    <main>
      <section className="border-b border-[#dfe9f6] bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-[#5f6f8d]"><Link href="/" className="hover:text-[#0967ed]">Home</Link><span className="mx-2">/</span><Link href={hub} className="hover:text-[#0967ed]">{hubName}</Link><span className="mx-2">/</span><span>{fraction}</span></nav>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">{meta.h1}</h1>
          <div className="mt-6 border-l-4 border-[#0967ed] bg-[#f2f7fe] px-5 py-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Direct answer</p><p className="mt-2 text-xl font-bold leading-8">{directAnswer}</p></div>
          <div className="mt-8"><FractionConverter initialNumerator={n} initialDenominator={d} /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
        {isEquivalent ? (
          <div className="grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:gap-14">
            <article>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Equivalent-fraction method</p>
              <h2 className="mt-2 text-2xl font-bold">How to Find Fractions Equivalent to {fraction}</h2>
              <EquivalentSteps n={n} d={d} equivalents={equivalents} />
            </article>
            <FractionFacts fraction={fraction} simplifiedText={simplifiedText} n={n} d={d} terminating={terminating} />
          </div>
        ) : (
          <PercentCalculation n={n} d={d} fraction={fraction} decimal={decimal} percent={percent} terminating={terminating} />
        )}
      </section>

      {isEquivalent ? (
        <section className="border-y border-[#dfe9f6] bg-white">
          <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Scale and verify</p>
            <h2 className="mt-2 text-2xl font-bold">Equivalent Fraction Table for {fraction}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#5f6f8d]">Multiply the numerator and denominator by the same non-zero whole number. The written numbers change, but the ratio stays equal.</p>
            <div className="mt-7 overflow-x-auto border-y border-[#d9e5f4]"><table className="w-full min-w-[620px] text-left"><thead className="bg-[#f2f7fe]"><tr><th className="px-5 py-3">Multiplier</th><th className="px-5 py-3">Calculation</th><th className="px-5 py-3">Equivalent fraction</th><th className="px-5 py-3">Cross-product check</th></tr></thead><tbody className="divide-y divide-[#d9e5f4]">{equivalents.map((item, index) => <tr key={item.denominator}><td className="px-5 py-3">× {index + 2}</td><td className="px-5 py-3">({n} × {index + 2}) / ({d} × {index + 2})</td><td className="px-5 py-3 font-bold text-[#0967ed]">{item.numerator}/{item.denominator}</td><td className="px-5 py-3">{n} × {item.denominator} = {d} × {item.numerator}</td></tr>)}</tbody></table></div>
          </div>
        </section>
      ) : (
        <section className="border-y border-[#dfe9f6] bg-white">
          <div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <article>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Read the decimal</p>
              <h2 className="mt-2 text-2xl font-bold">Why the Decimal {terminating ? "Terminates" : "Repeats"}</h2>
              <p className="mt-4 leading-7 text-[#405577]">After reducing {fraction} to {simplifiedText}, its denominator {terminating ? "contains no prime factors other than 2 or 5. That is why the division ends after a finite number of decimal places." : "contains a prime factor other than 2 or 5. The division therefore continues in a repeating pattern, so the displayed decimal and percent are rounded approximations."}</p>
            </article>
            <article className="border-t border-[#d9e5f4] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Check the scale</p>
              <h2 className="mt-2 text-2xl font-bold">Decimal and Percent Describe the Same Value</h2>
              <p className="mt-4 leading-7 text-[#405577]">A percent measures parts per hundred. Moving from the decimal to the percent changes the scale by a factor of 100; it does not change the underlying proportion represented by {fraction}.</p>
              <Link href={crossLink} className="mt-5 inline-flex items-center gap-2 font-bold text-[#0967ed]">{crossLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </article>
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:px-8">
        <article><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Use the result</p><h2 className="mt-2 text-2xl font-bold">Where {fraction} Appears</h2><p className="mt-4 leading-7 text-[#405577]">{profile.use}</p><p className="mt-4 border-l-2 border-[#a9c7f2] pl-4 text-sm leading-6 text-[#405577]"><strong className="text-[#071f4a]">Learning tip:</strong> {profile.tip}</p></article>
        <article className="border-t border-[#d9e5f4] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"><h2 className="text-2xl font-bold">{isEquivalent ? "Other Forms of the Same Value" : "Conversion Summary"}</h2><dl className="mt-4 divide-y divide-[#e7eef8]">{[["Fraction", fraction], ["Simplified fraction", simplifiedText], ["Decimal", decimalDisplay], ["Percent", percentDisplay]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3"><dt className="text-[#5f6f8d]">{label}</dt><dd className="text-right font-bold">{value}</dd></div>)}</dl>{isEquivalent && <Link href={crossLink} className="mt-5 inline-flex items-center gap-2 font-bold text-[#0967ed]">{crossLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}</article>
      </section>

      <section className="border-y border-[#dfe9f6] bg-white"><div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Related Fraction Guides</h2><div className="mt-6 grid border-y border-[#d9e5f4] sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => { const href = isEquivalent ? `/${equivalentFractionSlug(item)}` : `/${percentDecimalSlug(item)}`; return <Link key={href} href={href} className="flex items-center justify-between border-b border-[#d9e5f4] px-4 py-4 font-semibold hover:bg-[#f8fbff] hover:text-[#0967ed] sm:border-r">{item.numerator}/{item.denominator} {isEquivalent ? "equivalents" : "as percent"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>; })}</div></div></section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Frequently Asked Questions</h2><div className="mt-6 divide-y divide-[#d9e5f4] border-y border-[#d9e5f4]">{faq.map((item) => <details key={item.question} className="py-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 max-w-4xl leading-7 text-[#5f6f8d]">{item.answer}</p></details>)}</div></section>
    </main>
    <Footer />
  </div>;
}

function buildValueContext(candidate: FractionCandidate): { use: string; tip: string } {
  const { numerator: n, denominator: d } = candidate;
  const divisor = gcd(n, d);
  const multiplier = 2 + ((n + d) % 4);
  const collectionSize = d * multiplier;
  const selectedItems = n * multiplier;
  const isPowerOfTwo = (d & (d - 1)) === 0;

  if (n === d) {
    return {
      use: `${n}/${d} describes all ${d} parts of a whole. It is the useful reference point for checking that a fraction, decimal, and percent all represent exactly one complete unit.`,
      tip: `When the two terms match, divide both by ${d}; the result is 1, or 100%.`
    };
  }

  if (n > d) {
    return {
      use: `Suppose a recipe is written for ${d} servings but must make ${n} servings. Each ingredient is multiplied by ${n}/${d}, which is ${toMixedNumber(n, d)} times the original amount.`,
      tip: divisor > 1
        ? `Reduce both terms by their greatest common factor, ${divisor}, before writing the result as a mixed number.`
        : `Separate ${Math.floor(n / d)} whole group${Math.floor(n / d) === 1 ? "" : "s"} and keep the remaining ${n % d}/${d} to read this improper fraction quickly.`
    };
  }

  let use: string;
  if (d === 60) {
    use = `${n}/60 can describe ${n} minutes out of an hour. That time context makes the percentage useful for schedules, study sessions, and elapsed-time comparisons.`;
  } else if (d === 24) {
    use = `${n}/24 represents ${n} hours out of a full day. The decimal and percent forms make it easier to compare how much of the day an activity occupies.`;
  } else if (d === 12) {
    use = `${n}/12 can represent ${n} months out of a year or ${n} items from a dozen. Both contexts use the same proportion even though the units differ.`;
  } else if (d === 7) {
    use = `${n}/7 describes ${n} days in a seven-day week. Its percentage is useful when comparing weekly routines or attendance.`;
  } else if (isPowerOfTwo && d >= 4) {
    use = `${n}/${d} belongs to the halving family used in recipes and fractional measurements. Repeatedly dividing a whole into halves produces denominators such as 4, 8, 16, and 32.`;
  } else if (d % 10 === 0) {
    use = `${n}/${d} is well suited to progress and survey data because its denominator can be rescaled to 100. The percent form states the same share on a familiar hundred-point scale.`;
  } else if (n === 1) {
    use = `If one item is chosen from ${d} equally likely items, the probability is 1/${d}. Its decimal and percent forms make that single-outcome chance easier to compare with other events.`;
  } else {
    use = `In a collection of ${collectionSize} items split into ${d} equal groups, choosing ${n} groups gives ${selectedItems} items. That concrete count represents exactly ${n}/${d} of the collection.`;
  }

  if (divisor > 1) {
    return { use, tip: `${n} and ${d} share the factor ${divisor}. Divide both terms by ${divisor} first; the smaller fraction is easier to convert and compare.` };
  }
  if (hasTerminatingDecimal(n, d)) {
    return { use, tip: `The fraction is already reduced and its denominator has only 2 and/or 5 as prime factors, so long division ends instead of repeating.` };
  }
  return { use, tip: `The complement is ${d - n}/${d}. Adding it to ${n}/${d} returns one whole, which is a quick way to check the scale of the answer.` };
}

function EquivalentSteps({ n, d, equivalents }: { n: number; d: number; equivalents: { numerator: number; denominator: number }[] }): React.JSX.Element {
  return <ol className="mt-6 space-y-5">{[["Choose a multiplier", "Use the same non-zero number for both terms; start with 2."], ["Multiply both terms", `${n} × 2 = ${equivalents[0].numerator} and ${d} × 2 = ${equivalents[0].denominator}.`], ["Verify the ratio", `${n} × ${equivalents[0].denominator} and ${d} × ${equivalents[0].numerator} both equal ${n * equivalents[0].denominator}.`]].map(([title, text], index) => <li key={title} className="flex gap-4"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0967ed]" aria-hidden="true" /><div><h3 className="font-bold">{index + 1}. {title}</h3><p className="mt-1 leading-7 text-[#5f6f8d]">{text}</p></div></li>)}</ol>;
}

function PercentCalculation({ n, d, fraction, decimal, percent, terminating }: { n: number; d: number; fraction: string; decimal: string; percent: string; terminating: boolean }): React.JSX.Element {
  const decimalEquation = terminating ? `${n} ÷ ${d} = ${decimal}` : `${n} ÷ ${d} ≈ ${decimal.replace("…", "")}`;
  const percentEquation = terminating ? `${decimal} × 100 = ${percent}` : `(${n} ÷ ${d}) × 100 ≈ ${percent}`;
  const stages = [
    { label: "Start with division", value: `${fraction} = ${n} ÷ ${d}`, note: "A fraction bar means divide the numerator by the denominator." },
    { label: "Write the decimal", value: decimalEquation, note: terminating ? "The reduced denominator allows the division to end." : "The decimal repeats, so the displayed value is rounded." },
    { label: "Convert to percent", value: percentEquation, note: "Multiplying by 100 expresses the same proportion per hundred." }
  ];
  return <article><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Fraction → decimal → percent</p><h2 className="mt-2 text-2xl font-bold">Convert {fraction} in Three Calculations</h2><div className="mt-7 grid border-y border-[#d9e5f4] md:grid-cols-3">{stages.map((stage, index) => <section key={stage.label} className="border-b border-[#d9e5f4] py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f6f8d]">Step {index + 1}</p><h3 className="mt-2 font-bold">{stage.label}</h3><p className="mt-4 font-mono text-lg font-bold text-[#0967ed]">{stage.value}</p><p className="mt-3 text-sm leading-6 text-[#5f6f8d]">{stage.note}</p></section>)}</div></article>;
}

function FractionFacts({ fraction, simplifiedText, n, d, terminating }: { fraction: string; simplifiedText: string; n: number; d: number; terminating: boolean }): React.JSX.Element {
  const facts = [
    ["Simplest form", simplifiedText, gcd(n, d) === 1 ? `${fraction} is already in lowest terms.` : `Divide both terms by ${gcd(n, d)}.`],
    ["Decimal type", terminating ? "Terminating" : "Repeating", terminating ? "The reduced denominator contains only factors of 2 and/or 5." : "The reduced denominator contains another prime factor."],
    ...(n > d ? [["Mixed number", toMixedNumber(n, d), "The same value written as wholes plus a proper fraction."]] : [])
  ];
  return <aside className="border-t border-[#d9e5f4] pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-label={`Facts about ${fraction}`}><h2 className="text-lg font-bold">At a glance</h2><dl className="mt-3 divide-y divide-[#e7eef8]">{facts.map(([title, value, detail]) => <div key={title} className="py-4"><dt className="text-xs font-bold uppercase tracking-wider text-[#5f6f8d]">{title}</dt><dd className="mt-1 text-xl font-bold text-[#0967ed]">{value}</dd><dd className="mt-1 text-sm leading-6 text-[#5f6f8d]">{detail}</dd></div>)}</dl></aside>;
}

function buildFaq(family: FractionFamily, item: FractionCandidate, decimal: string, percent: string, simplified: string, firstEquivalent: { numerator: number; denominator: number }) {
  const f = `${item.numerator}/${item.denominator}`;
  const divisor = gcd(item.numerator, item.denominator);
  const propertyQuestion = item.numerator > item.denominator
    ? { question: `How do I write ${f} as a mixed number?`, answer: `${f} is ${toMixedNumber(item.numerator, item.denominator)}. Divide ${item.numerator} by ${item.denominator}; the quotient is the whole-number part and the remainder becomes the new numerator.` }
    : item.numerator === item.denominator
      ? { question: `Why does ${f} equal one whole?`, answer: `Its numerator counts all ${item.denominator} of the ${item.denominator} equal parts, so ${item.numerator} ÷ ${item.denominator} = 1.` }
      : divisor > 1
        ? { question: `What common factor simplifies ${f}?`, answer: `${item.numerator} and ${item.denominator} share ${divisor} as their greatest common factor. Dividing both terms by ${divisor} gives ${simplified}.` }
        : { question: `What fraction completes ${f} to one whole?`, answer: `${item.denominator - item.numerator}/${item.denominator} is the complement because the numerators add to the denominator: ${item.numerator} + ${item.denominator - item.numerator} = ${item.denominator}.` };

  return family === "equivalent-fractions" ? [
    { question: `What fraction is equivalent to ${f}?`, answer: `${firstEquivalent.numerator}/${firstEquivalent.denominator} is one equivalent fraction because both terms were multiplied by 2.` },
    { question: `Is ${f} already simplified?`, answer: simplified === f ? `Yes. ${f} is in lowest terms because its terms share no factor greater than 1.` : `No. Divide the terms by ${gcd(item.numerator, item.denominator)} to get ${simplified}.` },
    { question: `How can I check an equivalent fraction for ${f}?`, answer: "Cross-multiply. If the two cross-products are equal, the fractions represent the same value." },
    { question: `What are the decimal and percent forms of ${f}?`, answer: `${f} equals ${decimal} as a decimal and ${percent} as a percentage.` },
    propertyQuestion
  ] : [
    { question: `What is ${f} as a decimal?`, answer: `Divide ${item.numerator} by ${item.denominator}. The decimal form is ${decimal}.` },
    { question: `What is ${f} as a percent?`, answer: `Multiply its decimal value by 100. The result is ${percent}.` },
    { question: `Does the decimal for ${f} terminate?`, answer: hasTerminatingDecimal(item.numerator, item.denominator) ? "Yes. Its simplified denominator has no prime factors other than 2 or 5." : "No. Its decimal repeats because the reduced denominator contains a prime factor other than 2 or 5." },
    { question: `What is ${f} in simplest form?`, answer: `${f} simplifies to ${simplified}. This does not change its decimal or percentage value.` },
    propertyQuestion
  ];
}
