import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FractionConverter } from "@/components/fractions/fraction-converter";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { fractionCandidates, equivalentFractionSlug, percentDecimalSlug, type FractionFamily } from "@/data/fraction-pages";

export function FractionHubPage({ family }: { family: FractionFamily }): React.JSX.Element {
  const equivalent = family === "equivalent-fractions";
  const title = equivalent ? "Equivalent Fractions" : "Percent and Decimal";
  const description = equivalent
    ? "Find equivalent fractions, simplify ratios, and verify equal values with multiplication and cross-products."
    : "Convert fractions to decimals and percentages with direct answers and step-by-step division examples.";
  const popular = fractionCandidates.slice(0, 18);
  const grouped = new Map<number, typeof fractionCandidates>();
  for (const item of fractionCandidates) grouped.set(item.denominator, [...(grouped.get(item.denominator) ?? []), item]);
  const hrefFor = (item: (typeof fractionCandidates)[number]) => `/${equivalent ? equivalentFractionSlug(item) : percentDecimalSlug(item)}`;

  return <div className="min-h-screen bg-[#f8fbff] text-[#071f4a]">
    <Header />
    <main>
      <section className="border-b border-[#dfe9f6] bg-white"><div className="mx-auto max-w-[1120px] px-4 py-12 text-center sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0967ed]">Fraction guide</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5f6f8d]">{description}</p><div className="mx-auto mt-8 max-w-3xl text-left"><FractionConverter /></div></div></section>
      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Popular {title} Guides</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{popular.map((item) => <Link key={hrefFor(item)} href={hrefFor(item)} className="flex items-center justify-between rounded-xl border border-[#d9e5f4] bg-white px-5 py-4 font-semibold hover:border-[#82aff5] hover:text-[#0967ed]">{equivalent ? `Equivalent to ${item.numerator}/${item.denominator}` : `${item.numerator}/${item.denominator} as a percent`}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>)}</div></section>
      <section className="border-y border-[#dfe9f6] bg-white"><div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Browse by Denominator</h2><p className="mt-3 max-w-3xl leading-7 text-[#5f6f8d]">Choose a denominator to open its approved fraction guides. Each answer includes conversions, worked steps, checks, and related examples.</p><div className="mt-6 grid gap-3 md:grid-cols-2">{[...grouped.entries()].map(([denominator, items]) => <details key={denominator} className="rounded-xl border border-[#d9e5f4] bg-[#f8fbff] px-5 py-4"><summary className="cursor-pointer font-bold">Fractions with denominator {denominator} <span className="text-sm font-normal text-[#5f6f8d]">({items.length})</span></summary><div className="mt-4 flex flex-wrap gap-2">{items.map((item) => <Link key={hrefFor(item)} href={hrefFor(item)} className="rounded-lg border border-[#cbdcf3] bg-white px-3 py-2 text-sm font-semibold hover:border-[#0967ed] hover:text-[#0967ed]">{item.numerator}/{item.denominator}</Link>)}</div></details>)}</div></div></section>
      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-6 md:grid-cols-2"><article className="rounded-2xl border border-[#d9e5f4] bg-white p-6"><h2 className="text-xl font-bold">How the math works</h2><p className="mt-3 leading-7 text-[#5f6f8d]">{equivalent ? "Equivalent fractions represent the same ratio. Multiply or divide the numerator and denominator by the same non-zero number, then verify equality with cross-products." : "A fraction is division. Divide the numerator by the denominator for the decimal, then multiply by 100 and add the percent sign for the percentage."}</p></article><article className="rounded-2xl border border-[#d9e5f4] bg-white p-6"><h2 className="text-xl font-bold">Explore the related cluster</h2><p className="mt-3 leading-7 text-[#5f6f8d]">Move between equivalent forms and percent-decimal forms without losing the original fraction context.</p><Link href={equivalent ? "/percent-and-decimal" : "/equivalent-fractions"} className="mt-4 inline-flex items-center gap-2 font-bold text-[#0967ed]">{equivalent ? "Percent and Decimal" : "Equivalent Fractions"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></article></div></section>
    </main>
    <Footer />
  </div>;
}
