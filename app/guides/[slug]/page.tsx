import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, BarChart3, Calculator, CheckCircle2, Clock3 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MathDisplay } from "@/components/math/math-display";
import { StructuredData } from "@/components/seo/structured-data";
import { getGuide, guides } from "@/data/guides";
import { breadcrumbStructuredData, createMetadata, learningResourceStructuredData } from "@/lib/seo";

type GuidePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return createMetadata({
    title: `${guide.shortTitle} Guide`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: [guide.shortTitle.toLowerCase(), guide.category.toLowerCase(), "math guide", "worked examples"]
  });
}

export default async function GuidePage({ params }: GuidePageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guides.filter((item) => item.category === guide.category && item.slug !== guide.slug).slice(0, 3);
  const path = `/guides/${guide.slug}`;

  return (
    <div className="min-h-screen bg-[#f6f9fe] text-[#0a234f]">
      <StructuredData data={learningResourceStructuredData({ ...guide, path })} />
      <StructuredData data={breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.shortTitle, path }])} />
      <Header />
      <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
        <article>
          <header className="border-b border-[#dbe6f6] bg-white">
            <div className="mx-auto max-w-[1080px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#637392]">
                <Link href="/" className="hover:text-[#0967ed]">Home</Link><span aria-hidden="true">/</span>
                <Link href="/guides" className="hover:text-[#0967ed]">Guides</Link><span aria-hidden="true">/</span>
                <span aria-current="page" className="text-[#203b67]">{guide.shortTitle}</span>
              </nav>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-[#0967ed]">{guide.category} guide</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#526785]">{guide.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium text-[#526785]">
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#0967ed]" />{guide.readingMinutes} min read</span>
                <span className="inline-flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#0967ed]" />{guide.difficulty}</span>
                <span>Updated {guide.updatedAt}</span>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
            <div className="min-w-0 space-y-8">
              <section className="rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold">What you will learn</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {guide.objectives.map((objective) => <li key={objective} className="flex gap-3 text-sm leading-6 text-[#526785]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0967ed]" /><span>{objective}</span></li>)}
                </ul>
              </section>

              {guide.sections.map((section, index) => (
                <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-24 rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0967ed]">Concept {index + 1}</p>
                  <h2 className="mt-2 text-2xl font-bold">{section.heading}</h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-[#526785]">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                  {section.formula && <div className="mt-6 overflow-x-auto rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-5 text-lg"><MathDisplay latex={section.formula} display="block" showCopy={false} /></div>}
                </section>
              ))}

              <section id="worked-example" className="scroll-mt-24 rounded-2xl border border-[#a9c9f6] bg-white p-6 shadow-sm sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0967ed]">Worked example</p>
                <h2 className="mt-2 text-2xl font-bold">{guide.example.problem}</h2>
                <ol className="mt-6 space-y-4">
                  {guide.example.steps.map((step, index) => <li key={step} className="flex gap-4 text-base leading-7 text-[#526785]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0967ed] text-sm font-bold text-white">{index + 1}</span><span>{step}</span></li>)}
                </ol>
                <div className="mt-6 overflow-x-auto rounded-xl bg-[#edf6ff] p-5 text-lg"><p className="mb-2 text-sm font-bold text-[#203b67]">Answer</p><MathDisplay latex={guide.example.answer} display="block" showCopy={false} /></div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><AlertTriangle className="h-6 w-6 text-amber-700" />Common mistakes</h2>
                <ul className="mt-5 space-y-3 text-base leading-7 text-amber-950">{guide.mistakes.map((mistake) => <li key={mistake} className="flex gap-3"><span aria-hidden="true">•</span><span>{mistake}</span></li>)}</ul>
              </section>

              <section className="rounded-2xl bg-[#082d66] p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div><p className="text-sm font-semibold text-blue-200">Check your understanding</p><h2 className="mt-2 text-2xl font-bold text-white">Try a problem with the {guide.calculator.label}</h2></div>
                <Link href={guide.calculator.href} className="mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#0967ed] hover:bg-blue-50 sm:mt-0"><Calculator className="h-4 w-4" />Open calculator</Link>
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-2xl border border-[#dbe6f6] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold">In this guide</h2>
                <ol className="mt-4 space-y-3 text-sm text-[#526785]">{guide.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`} className="hover:text-[#0967ed]">{index + 1}. {section.heading}</a></li>)}<li><a href="#worked-example" className="hover:text-[#0967ed]">Worked example</a></li></ol>
              </section>
              {related.length > 0 && <section className="rounded-2xl border border-[#dbe6f6] bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Related guides</h2><div className="mt-4 space-y-3">{related.map((item) => <Link key={item.slug} href={`/guides/${item.slug}`} className="group flex items-start justify-between gap-3 rounded-lg border border-[#e1e9f4] p-3 text-sm font-semibold text-[#203b67] hover:border-[#82aff5]"><span>{item.shortTitle}</span><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" /></Link>)}</div></section>}
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
