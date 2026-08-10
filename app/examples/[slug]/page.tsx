import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StaticMath } from "@/components/math/static-math";
import { StructuredData } from "@/components/seo/structured-data";
import { exampleDetails, getExampleDetail, getExampleStaticParams } from "@/data/example-details";
import { breadcrumbStructuredData, createMetadata, learningResourceStructuredData } from "@/lib/seo";

type ExamplePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getExampleStaticParams();
}

export async function generateMetadata({ params }: ExamplePageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = getExampleDetail(slug);
  if (!example) return {};
  return createMetadata({
    title: `${example.title} – Step-by-Step Example`,
    description: example.description,
    path: `/examples/${example.slug}`,
    keywords: [example.problem, example.method.toLowerCase(), `${example.category.toLowerCase()} examples`, "step by step math solution"]
  });
}

export default async function ExamplePage({ params }: ExamplePageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const example = getExampleDetail(slug);
  if (!example) notFound();
  const path = `/examples/${example.slug}`;
  const related = exampleDetails.filter((item) => item.category === example.category && item.slug !== example.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f6f9fe] text-[#0a234f]">
      <StructuredData data={learningResourceStructuredData({ title: example.title, description: example.description, path, category: example.category, difficulty: example.difficulty, updatedAt: example.updatedAt, objectives: [example.method, "Review each transformation", "Verify the final answer"] })} />
      <StructuredData data={breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Examples", path: "/examples" }, { name: example.title, path }])} />
      <Header />
      <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
        <article className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#637392]">
            <Link href="/" className="hover:text-[#0967ed]">Home</Link><span aria-hidden="true">/</span>
            <Link href="/examples" className="hover:text-[#0967ed]">Examples</Link><span aria-hidden="true">/</span>
            <span aria-current="page" className="text-[#203b67]">{example.title}</span>
          </nav>

          <header className="mt-8 rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[#0967ed]"><span>{example.category}</span><span aria-hidden="true">•</span><span>{example.difficulty}</span></div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{example.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#526785]">{example.description}</p>
            <div className="mt-7 overflow-x-auto rounded-xl border border-[#dbe6f6] bg-[#f8fbff] p-6 text-xl"><StaticMath latex={example.problem} display="block" /></div>
            <p className="mt-5 text-sm text-[#637392]"><strong className="text-[#203b67]">Method:</strong> {example.method}</p>
          </header>

          <section className="mt-7 rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">Step-by-step solution</h2>
            <ol className="mt-6 space-y-5">
              {example.steps.map((step, index) => (
                <li key={step.title} className="grid gap-3 sm:grid-cols-[40px_1fr]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0967ed] text-sm font-bold text-white">{index + 1}</span>
                  <div><h3 className="font-bold">{step.title}</h3><p className="mt-1 text-base leading-7 text-[#526785]">{step.explanation}</p>{step.math && <div className="mt-3 overflow-x-auto rounded-lg bg-[#f8fbff] p-4"><StaticMath latex={step.math} display="block" /></div>}</div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-7 rounded-2xl border border-[#a9c9f6] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold"><CheckCircle2 className="h-6 w-6 text-emerald-600" />Final answer</h2>
            <div className="mt-5 overflow-x-auto rounded-xl bg-[#edf6ff] p-6 text-xl"><StaticMath latex={example.answer} display="block" /></div>
            <p className="mt-5 text-base leading-7 text-[#526785]">{example.explanation}</p>
          </section>

          <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold"><AlertTriangle className="h-5 w-5 text-amber-700" />Common mistake</h2>
            <p className="mt-3 leading-7 text-amber-950">{example.commonMistake}</p>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2">
            <Link href={`${example.calculator.href}?q=${encodeURIComponent(example.input)}`} className="group rounded-2xl border border-[#82aff5] bg-white p-6 shadow-sm hover:border-[#0967ed]"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0967ed]">Try the tool</p><h2 className="mt-2 flex items-center justify-between text-xl font-bold">{example.calculator.label}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></h2></Link>
            <Link href={example.guide.href} className="group rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm hover:border-[#82aff5]"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0967ed]">Learn the concept</p><h2 className="mt-2 flex items-center justify-between text-xl font-bold">{example.guide.label}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></h2></Link>
          </section>

          {related.length > 0 && <section className="mt-7 rounded-2xl border border-[#dbe6f6] bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold">Related {example.category} Examples</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/examples/${item.slug}`} className="group flex items-center justify-between rounded-xl border border-[#dbe6f6] p-4 font-semibold text-[#203b67] hover:border-[#82aff5]"><span>{item.title}</span><ArrowRight className="h-4 w-4 shrink-0 text-[#0967ed] transition-transform group-hover:translate-x-1" /></Link>)}</div></section>}
        </article>
      </main>
      <Footer />
    </div>
  );
}
