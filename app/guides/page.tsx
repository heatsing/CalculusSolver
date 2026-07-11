import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Calculus and Algebra Guides", description: "Learn derivatives, integrals, limits, equations, factoring, and algebra with concise guides and worked examples.", path: "/guides" });
const guides = [
  ["Derivative rules", "Power, product, quotient, and chain rules with worked examples.", "/derivative-calculator"],
  ["Integration basics", "Antiderivatives, constants of integration, and definite integrals.", "/integral-calculator"],
  ["Understanding limits", "Direct substitution, indeterminate forms, and one-sided limits.", "/limit-calculator"],
  ["Solving equations", "A repeatable process for linear and quadratic equations.", "/equation-solver"],
  ["Factoring polynomials", "Common factors, difference of squares, and quadratic trinomials.", "/factoring-calculator"],
  ["Worked problem library", "Browse solved calculus and algebra examples by topic.", "/examples"]
] as const;

export default function GuidesPage(): React.JSX.Element {
  return <><Header /><main id="main-content" tabIndex={-1} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8"><header className="max-w-3xl"><p className="text-sm font-semibold text-primary">Learning center</p><h1 className="mt-2 text-4xl font-bold text-heading sm:text-5xl">Calculus and Algebra Guides</h1><p className="mt-4 text-lg leading-8 text-body">Build the method first, then use the calculators to check your work. Each guide leads to examples and a focused solving tool.</p></header><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guides.map(([title, description, href]) => <Link key={title} href={href} className="group rounded-xl border border-[#d9e4f3] bg-white p-6 shadow-sm hover:border-primary"><BookOpen className="h-7 w-7 text-primary" /><h2 className="mt-5 text-xl font-semibold text-heading">{title}</h2><p className="mt-2 text-sm leading-6 text-body">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></main><Footer /></>;
}
