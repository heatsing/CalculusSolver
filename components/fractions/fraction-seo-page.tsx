import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FractionConverter } from "@/components/fractions/fraction-converter";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/seo/structured-data";
import {
  equivalentFractionSlug,
  fractionPageMetadata,
  fractionProfile,
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

const profileContext: Record<string, { use: string; tip: string }> = {
  improper: { use: "This value is greater than one whole, so it is useful for rates, recipe scaling, and measurements that exceed one unit.", tip: "Convert an improper fraction to a mixed number when a real-world measurement is easier to read that way." },
  whole: { use: "The numerator and denominator are equal, so the fraction represents one complete unit or 100 percent.", tip: "Equal numerator and denominator values always simplify to 1." },
  reducible: { use: "Because the numerator and denominator share a factor, this example is especially useful for practicing reduction before conversion.", tip: "Simplify first to make the decimal division and equivalence check easier." },
  "place-value": { use: "A power-of-ten denominator connects directly to decimal place value, percentages, money, and metric measurements.", tip: "For tenths and hundredths, the denominator often tells you where to place the decimal point." },
  benchmark: { use: "This fraction converts to a familiar benchmark percentage, which helps with estimation, discounts, grades, and progress tracking.", tip: "Memorize common benchmark fractions so you can estimate an answer before calculating." },
  general: { use: "This fraction is a practical example for comparing proportions, probabilities, ratios, and parts of a collection.", tip: "Check your decimal by multiplying it by the denominator; the result should return the numerator." }
};

export function FractionSeoPage({ family, candidate }: { family: FractionFamily; candidate: FractionCandidate }): React.JSX.Element {
  const { numerator: n, denominator: d } = candidate;
  const fraction = `${n}/${d}`;
  const simplified = simplifyFraction(n, d);
  const simplifiedText = `${simplified.numerator}/${simplified.denominator}`;
  const decimal = formatFractionDecimal(n, d);
  const percent = formatPercent(fractionToPercent(n, d));
  const equivalents = generateEquivalentFractions(n, d, 6);
  const profile = profileContext[fractionProfile(candidate)];
  const meta = fractionPageMetadata(family, candidate);
  const isEquivalent = family === "equivalent-fractions";
  const hub = isEquivalent ? "/equivalent-fractions" : "/percent-and-decimal";
  const hubName = isEquivalent ? "Equivalent Fractions" : "Percent and Decimal";
  const crossLink = isEquivalent ? `/${percentDecimalSlug(candidate)}` : `/${equivalentFractionSlug(candidate)}`;
  const crossLabel = isEquivalent ? `See ${fraction} as a percent and decimal` : `Find fractions equivalent to ${fraction}`;
  const directAnswer = isEquivalent
    ? `${equivalents[0].numerator}/${equivalents[0].denominator}, ${equivalents[1].numerator}/${equivalents[1].denominator}, and ${equivalents[2].numerator}/${equivalents[2].denominator} are equivalent to ${fraction}.`
    : `${fraction} is ${decimal} as a decimal and ${percent} as a percentage.`;
  const faq = buildFaq(family, candidate, decimal, percent, simplifiedText, equivalents[0]);
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
          <div className="mt-6 rounded-2xl border border-[#a9c7f2] bg-[#f2f7fe] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0967ed]">Direct answer</p><p className="mt-2 text-xl font-bold leading-8">{directAnswer}</p></div>
          <div className="mt-8"><FractionConverter initialNumerator={n} initialDenominator={d} /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <article className="rounded-2xl border border-[#d9e5f4] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">{isEquivalent ? `How to Find Fractions Equivalent to ${fraction}` : `How to Convert ${fraction}`}</h2>
            {isEquivalent ? <EquivalentSteps n={n} d={d} equivalents={equivalents} /> : <ConversionSteps n={n} d={d} decimal={decimal} percent={percent} />}
          </article>
          <aside className="space-y-4">
            <Info title="Simplest form" value={simplifiedText} detail={gcd(n, d) === 1 ? `${fraction} is already in lowest terms.` : `Divide both terms by ${gcd(n, d)}.`} />
            <Info title="Decimal type" value={hasTerminatingDecimal(n, d) ? "Terminating" : "Repeating"} detail={hasTerminatingDecimal(n, d) ? "Its reduced denominator contains only factors of 2 and/or 5." : "The decimal continues, so an ellipsis is shown."} />
            {n > d && <Info title="Mixed number" value={toMixedNumber(n, d)} detail="This is the same value written as wholes plus a proper fraction." />}
          </aside>
        </div>
      </section>

      <section className="border-y border-[#dfe9f6] bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Equivalent Fraction Table for {fraction}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#5f6f8d]">Multiply the numerator and denominator by the same non-zero whole number. The written numbers change, but the ratio stays equal.</p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-[#d9e5f4]"><table className="w-full min-w-[560px] text-left"><thead className="bg-[#f2f7fe]"><tr><th className="px-5 py-3">Multiplier</th><th className="px-5 py-3">Calculation</th><th className="px-5 py-3">Equivalent fraction</th><th className="px-5 py-3">Cross-product check</th></tr></thead><tbody className="divide-y divide-[#d9e5f4]">{equivalents.map((item, index) => <tr key={item.denominator}><td className="px-5 py-3">× {index + 2}</td><td className="px-5 py-3">({n} × {index + 2}) / ({d} × {index + 2})</td><td className="px-5 py-3 font-bold text-[#0967ed]">{item.numerator}/{item.denominator}</td><td className="px-5 py-3">{n} × {item.denominator} = {d} × {item.numerator}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-[#d9e5f4] bg-white p-6"><h2 className="text-2xl font-bold">Where {fraction} Appears</h2><p className="mt-4 leading-7 text-[#405577]">{profile.use}</p><p className="mt-4 rounded-xl bg-[#f2f7fe] p-4 text-sm leading-6 text-[#405577]"><strong className="text-[#071f4a]">Learning tip:</strong> {profile.tip}</p></article>
        <article className="rounded-2xl border border-[#d9e5f4] bg-white p-6"><h2 className="text-2xl font-bold">Compare Every Form</h2><ul className="mt-4 space-y-3">{[["Fraction", fraction], ["Simplified fraction", simplifiedText], ["Decimal", decimal], ["Percent", percent]].map(([label, value]) => <li key={label} className="flex items-center justify-between gap-4 border-b border-[#e7eef8] pb-3"><span className="text-[#5f6f8d]">{label}</span><strong>{value}</strong></li>)}</ul><Link href={crossLink} className="mt-5 inline-flex items-center gap-2 font-bold text-[#0967ed]">{crossLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></article>
      </section>

      <section className="border-y border-[#dfe9f6] bg-white"><div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Related Fraction Guides</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => { const href = isEquivalent ? `/${equivalentFractionSlug(item)}` : `/${percentDecimalSlug(item)}`; return <Link key={href} href={href} className="flex items-center justify-between rounded-xl border border-[#d9e5f4] px-5 py-4 font-semibold hover:border-[#82aff5] hover:text-[#0967ed]">{item.numerator}/{item.denominator} {isEquivalent ? "equivalents" : "as percent"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>; })}</div></div></section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Frequently Asked Questions</h2><div className="mt-6 divide-y divide-[#d9e5f4] rounded-2xl border border-[#d9e5f4] bg-white">{faq.map((item) => <details key={item.question} className="px-5 py-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-7 text-[#5f6f8d]">{item.answer}</p></details>)}</div></section>
    </main>
    <Footer />
  </div>;
}

function EquivalentSteps({ n, d, equivalents }: { n: number; d: number; equivalents: { numerator: number; denominator: number }[] }): React.JSX.Element {
  return <ol className="mt-6 space-y-5">{[["Choose a multiplier", "Use the same non-zero number for both terms; start with 2."], ["Multiply both terms", `${n} × 2 = ${equivalents[0].numerator} and ${d} × 2 = ${equivalents[0].denominator}.`], ["Verify the ratio", `${n} × ${equivalents[0].denominator} and ${d} × ${equivalents[0].numerator} both equal ${n * equivalents[0].denominator}.`]].map(([title, text], index) => <li key={title} className="flex gap-4"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0967ed]" aria-hidden="true" /><div><h3 className="font-bold">{index + 1}. {title}</h3><p className="mt-1 leading-7 text-[#5f6f8d]">{text}</p></div></li>)}</ol>;
}

function ConversionSteps({ n, d, decimal, percent }: { n: number; d: number; decimal: string; percent: string }): React.JSX.Element {
  return <ol className="mt-6 space-y-5">{[["Divide the numerator by the denominator", `${n} ÷ ${d} = ${decimal}.`], ["Multiply the decimal by 100", `${decimal.replace("…", "")} × 100 gives ${percent}.`], ["Add the percent sign", `The final percent form of ${n}/${d} is ${percent}.`]].map(([title, text], index) => <li key={title} className="flex gap-4"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0967ed]" aria-hidden="true" /><div><h3 className="font-bold">{index + 1}. {title}</h3><p className="mt-1 leading-7 text-[#5f6f8d]">{text}</p></div></li>)}</ol>;
}

function Info({ title, value, detail }: { title: string; value: string; detail: string }): React.JSX.Element {
  return <div className="rounded-2xl border border-[#d9e5f4] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#5f6f8d]">{title}</p><p className="mt-2 text-2xl font-bold text-[#0967ed]">{value}</p><p className="mt-2 text-sm leading-6 text-[#5f6f8d]">{detail}</p></div>;
}

function buildFaq(family: FractionFamily, item: FractionCandidate, decimal: string, percent: string, simplified: string, firstEquivalent: { numerator: number; denominator: number }) {
  const f = `${item.numerator}/${item.denominator}`;
  return family === "equivalent-fractions" ? [
    { question: `What fraction is equivalent to ${f}?`, answer: `${firstEquivalent.numerator}/${firstEquivalent.denominator} is one equivalent fraction because both terms were multiplied by 2.` },
    { question: `Is ${f} already simplified?`, answer: simplified === f ? `Yes. ${f} is in lowest terms because its terms share no factor greater than 1.` : `No. Divide the terms by ${gcd(item.numerator, item.denominator)} to get ${simplified}.` },
    { question: `How can I check an equivalent fraction for ${f}?`, answer: "Cross-multiply. If the two cross-products are equal, the fractions represent the same value." },
    { question: `What are the decimal and percent forms of ${f}?`, answer: `${f} equals ${decimal} as a decimal and ${percent} as a percentage.` }
  ] : [
    { question: `What is ${f} as a decimal?`, answer: `Divide ${item.numerator} by ${item.denominator}. The decimal form is ${decimal}.` },
    { question: `What is ${f} as a percent?`, answer: `Multiply its decimal value by 100. The result is ${percent}.` },
    { question: `Does the decimal for ${f} terminate?`, answer: hasTerminatingDecimal(item.numerator, item.denominator) ? "Yes. Its simplified denominator has no prime factors other than 2 or 5." : "No. Its decimal repeats because the reduced denominator contains a prime factor other than 2 or 5." },
    { question: `What is ${f} in simplest form?`, answer: `${f} simplifies to ${simplified}. This does not change its decimal or percentage value.` }
  ];
}
