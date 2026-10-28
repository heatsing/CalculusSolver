import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FractionConverter } from "@/components/fractions/fraction-converter";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { equivalentFractionSlug, indexableFractionCandidates, percentDecimalSlug, type FractionFamily } from "@/data/fraction-pages";

export function FractionHubPage({ family }: { family: FractionFamily }): React.JSX.Element {
  const equivalent = family === "equivalent-fractions";
  const title = equivalent ? "Equivalent Fractions" : "Percent and Decimal";
  const description = equivalent
    ? "Find equivalent fractions, simplify ratios, and verify equal values with multiplication and cross-products."
    : "Convert fractions to decimals and percentages with direct answers and step-by-step division examples.";
  const commonFractions = new Set(["1/2", "1/3", "2/3", "1/4", "3/4", "1/5", "2/5", "3/5", "4/5", "1/8", "3/8", "5/8"]);
  const popular = indexableFractionCandidates.filter((item) => commonFractions.has(`${item.numerator}/${item.denominator}`));
  const grouped = new Map<number, typeof indexableFractionCandidates>();
  for (const item of indexableFractionCandidates) grouped.set(item.denominator, [...(grouped.get(item.denominator) ?? []), item]);
  const denominatorRanges = [
    { label: "Common denominators", range: "2–10", min: 2, max: 10 },
    { label: "Denominators 11–20", range: "11–20", min: 11, max: 20 },
    { label: "Denominators 21–30", range: "21–30", min: 21, max: 30 },
    { label: "Denominators 31–40", range: "31–40", min: 31, max: 40 },
    { label: "Denominators 41–60", range: "41–60", min: 41, max: 60 }
  ] as const;
  const hrefFor = (item: (typeof indexableFractionCandidates)[number]) => `/${equivalent ? equivalentFractionSlug(item) : percentDecimalSlug(item)}`;

  return <div className="min-h-screen bg-[#f8fbff] text-[#071f4a]">
    <Header />
    <main>
      <section className="border-b border-[#dfe9f6] bg-white"><div className="mx-auto grid max-w-[1120px] gap-9 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8"><div><p className="text-sm font-medium text-[#0967ed]">Fraction tools</p><h1 className="mt-3 text-4xl font-bold tracking-[-.035em] sm:text-5xl">{title}</h1><p className="mt-4 max-w-xl text-lg leading-8 text-[#526785]">{description}</p><p className="mt-5 max-w-xl text-sm leading-7 text-[#637392]">Start with the converter, then open a guide when you want to see why the conversion or equivalence works.</p></div><div><FractionConverter /></div></div></section>
      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Common {title} Guides</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#637392]">These benchmark fractions appear often in percentages, measurement, probability, and classroom work.</p><div className="mt-6 grid border-t border-[#d7e2f0] sm:grid-cols-2 lg:grid-cols-3">{popular.map((item, index) => <Link key={hrefFor(item)} href={hrefFor(item)} className={`flex items-center justify-between border-b border-[#d7e2f0] py-4 font-semibold hover:text-[#0967ed] ${index % 2 !== 0 ? "sm:border-l sm:pl-5" : ""} ${index % 3 !== 0 ? "lg:border-l lg:pl-5" : "lg:border-l-0 lg:pl-0"}`}><span>{equivalent ? `Equivalent to ${item.numerator}/${item.denominator}` : `${item.numerator}/${item.denominator} as a percent`}</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>)}</div></section>
      <section className="border-y border-[#dfe9f6] bg-white">
        <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="text-sm font-medium text-[#0967ed]">Full index</p>
              <h2 className="mt-2 text-2xl font-bold">Browse by Denominator</h2>
              <p className="mt-3 max-w-sm leading-7 text-[#5f6f8d]">Open a range, choose a denominator, then select the fraction you want to study.</p>
            </div>
            <div className="divide-y divide-[#d7e2f0] border-y border-[#d7e2f0]">
              {denominatorRanges.map((group, groupIndex) => {
                const entries = [...grouped.entries()].filter(([denominator]) => denominator >= group.min && denominator <= group.max);
                const guideCount = entries.reduce((total, [, items]) => total + items.length, 0);
                return (
                  <details key={group.label} open={groupIndex === 0} className="group py-4">
                    <summary className="cursor-pointer list-none font-bold text-[#071f4a]">
                      <span className="flex items-center justify-between gap-4">
                        <span>{group.label} <span className="ml-2 text-sm font-normal text-[#637392]">{group.range} · {guideCount} guides</span></span>
                        <span className="text-[#0967ed] group-open:rotate-45" aria-hidden="true">+</span>
                      </span>
                    </summary>
                    <div className="mt-5 divide-y divide-[#e4ebf5] border-t border-[#e4ebf5]">
                      {entries.map(([denominator, items]) => (
                        <div key={denominator} className="grid gap-3 py-4 sm:grid-cols-[10rem_1fr] sm:items-start">
                          <p className="text-sm font-semibold text-[#203b67]">Denominator {denominator}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {items.map((item) => <Link key={hrefFor(item)} href={hrefFor(item)} className="border-b border-[#b8cdec] pb-0.5 text-sm font-semibold text-[#526785] hover:border-[#0967ed] hover:text-[#0967ed]">{item.numerator}/{item.denominator}</Link>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-8 border-t border-[#d7e2f0] pt-9 md:grid-cols-[1.2fr_.8fr]"><article><p className="text-sm font-medium text-[#0967ed]">Method</p><h2 className="mt-2 text-xl font-bold">How the math works</h2><p className="mt-3 leading-7 text-[#526785]">{equivalent ? "Equivalent fractions represent the same ratio. Multiply or divide the numerator and denominator by the same non-zero number, then verify equality with cross-products." : "A fraction is division. Divide the numerator by the denominator for the decimal, then multiply by 100 and add the percent sign for the percentage."}</p></article><article className="border-l-4 border-[#0967ed] bg-[#f3f7fc] px-6 py-5"><h2 className="text-lg font-bold">Related fraction tool</h2><p className="mt-2 text-sm leading-6 text-[#526785]">Move between equivalent forms and percent-decimal forms without losing the original fraction context.</p><Link href={equivalent ? "/percent-and-decimal" : "/equivalent-fractions"} className="mt-4 inline-flex items-center gap-2 font-bold text-[#0967ed]">{equivalent ? "Percent and Decimal" : "Equivalent Fractions"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></article></div></section>
    </main>
    <Footer />
  </div>;
}
