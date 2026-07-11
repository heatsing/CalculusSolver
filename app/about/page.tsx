import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "About Calculus Solver", description: "Learn how Calculus Solver combines symbolic mathematics and optional AI explanations to support math learning.", path: "/about" });

export default function AboutPage(): React.JSX.Element {
  return <><Header /><main id="main-content" tabIndex={-1} className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm font-semibold text-primary">About</p><h1 className="mt-2 text-4xl font-bold text-heading sm:text-5xl">Math answers you can inspect</h1><div className="mt-8 space-y-8 text-base leading-8 text-body"><section><h2 className="text-2xl font-semibold text-heading">What we are building</h2><p className="mt-3">Calculus Solver is a free educational workspace for calculus, algebra, and everyday mathematics. The goal is not only to return an answer, but to show the method and make the result easier to verify.</p></section><section><h2 className="text-2xl font-semibold text-heading">How answers are produced</h2><p className="mt-3">Supported problems are computed with symbolic and numerical math engines. When AI explanations are configured, they add plain-language guidance; local verification remains separate and is shown with the result.</p></section><section><h2 className="text-2xl font-semibold text-heading">Important limitation</h2><p className="mt-3">This tool supports learning and checking work, but it is not a formal proof system. Always review assumptions, domains, constants, and notation for high-stakes coursework.</p></section></div></main><Footer /></>;
}
