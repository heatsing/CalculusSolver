import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Calculator, Clock3 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StructuredData } from "@/components/seo/structured-data";
import { guideCategories, guides } from "@/data/guides";
import { collectionPageStructuredData, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Calculus and Algebra Guides", description: "Learn derivatives, integrals, limits, equations, factoring, and algebra with concise guides and worked examples.", path: "/guides" });

export default function GuidesPage(): React.JSX.Element {
  const featured = guides[0];
  return (
    <div className="min-h-screen bg-[#f6f9fe] text-[#0a234f]">
      <StructuredData data={collectionPageStructuredData(guides.map((guide) => ({ name: guide.title, description: guide.description, path: `/guides/${guide.slug}` })))} />
      <Header />
      <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
        <header className="border-b border-[#dbe6f6] bg-white">
          <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-[#0967ed]">Learning center</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Calculus and Algebra Guides</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#526785]">Learn the method with clear concepts and worked examples, then use a focused calculator to check your understanding.</p>
          </div>
        </header>

        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
          <section className="grid overflow-hidden rounded-2xl border border-[#a9c9f6] bg-white shadow-sm lg:grid-cols-[1.25fr_.75fr]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">Featured guide</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight">{featured.title}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#526785]">{featured.description}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium text-[#526785]"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#0967ed]" />{featured.readingMinutes} min</span><span className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#0967ed]" />{featured.difficulty}</span></div>
              <div className="mt-7 flex flex-wrap gap-3"><Link href={`/guides/${featured.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#0967ed] px-5 py-3 text-sm font-bold text-white hover:bg-[#0757c9]">Read guide <ArrowRight className="h-4 w-4" /></Link><Link href={featured.calculator.href} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#82aff5] bg-white px-5 py-3 text-sm font-bold text-[#0967ed] hover:bg-[#eff6ff]"><Calculator className="h-4 w-4" />Open calculator</Link></div>
            </div>
            <div className="border-t border-[#dbe6f6] bg-[#edf6ff] p-7 lg:border-l lg:border-t-0 sm:p-9">
              <p className="text-sm font-bold text-[#203b67]">A simple learning path</p>
              <ol className="mt-5 space-y-5">{[["1", "Learn the idea", "Read the rule and understand when it applies."], ["2", "Follow the example", "Work through each transformation in order."], ["3", "Check a new problem", "Use the calculator after attempting it yourself."]].map(([number, title, text]) => <li key={number} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0967ed] shadow-sm">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#526785]">{text}</p></div></li>)}</ol>
            </div>
          </section>

          <div className="mt-12 space-y-12">
            {guideCategories.map((category) => {
              const categoryGuides = guides.filter((guide) => guide.category === category);
              return (
                <section key={category} aria-labelledby={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-end justify-between gap-4 border-b border-[#dbe6f6] pb-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0967ed]">Topic collection</p><h2 id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`} className="mt-1 text-3xl font-bold">{category}</h2></div><span className="text-sm text-[#637392]">{categoryGuides.length} {categoryGuides.length === 1 ? "guide" : "guides"}</span></div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {categoryGuides.map((guide) => (
                      <article key={guide.slug} className="flex min-h-64 flex-col rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#82aff5] hover:shadow-md">
                        <div className="flex items-start justify-between gap-4"><BookOpen className="h-7 w-7 text-[#0967ed]" /><span className="rounded-full bg-[#edf6ff] px-3 py-1 text-xs font-semibold text-[#075bc7]">{guide.difficulty}</span></div>
                        <h3 className="mt-5 text-xl font-bold">{guide.shortTitle}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-[#526785]">{guide.description}</p>
                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf1f7] pt-4"><span className="inline-flex items-center gap-2 text-xs font-medium text-[#637392]"><Clock3 className="h-4 w-4" />{guide.readingMinutes} min read</span><div className="flex items-center gap-4"><Link href={guide.calculator.href} className="text-xs font-semibold text-[#526785] hover:text-[#0967ed]">Calculator</Link><Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#0967ed] hover:text-[#0757c9]">Read guide <ArrowRight className="h-4 w-4" /></Link></div></div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="mt-12 flex flex-col gap-5 rounded-2xl border border-[#dbe6f6] bg-white p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-bold">Ready for more practice?</h2><p className="mt-2 text-sm leading-6 text-[#526785]">Browse solved problems across calculus and algebra, organized by topic.</p></div>
            <Link href="/examples" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-[#82aff5] px-5 py-3 text-sm font-bold text-[#0967ed] hover:bg-[#eff6ff]">View worked examples <ArrowRight className="h-4 w-4" /></Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
