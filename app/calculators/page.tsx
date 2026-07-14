import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { calculatorGroups } from "@/data/calculator-tools";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Calculus Solver – Free Online Math Calculators", description: "Browse calculus, algebra, matrix, fraction, percentage, probability, and other free online calculators.", path: "/calculators" });

export default function CalculatorsPage(): React.JSX.Element {
  return <><Header /><main id="main-content" tabIndex={-1} className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8"><header className="max-w-3xl"><p className="text-sm font-semibold text-primary">All tools</p><h1 className="mt-2 text-4xl font-bold text-heading sm:text-5xl">Online Math Calculators</h1><p className="mt-4 text-lg leading-8 text-body">Choose a focused calculator for the problem you want to solve. Every tool uses the same verified math engine and step-by-step result format.</p></header><div className="mt-10 space-y-10">{calculatorGroups.map((group) => <section key={group.label}><h2 className="text-2xl font-semibold text-heading">{group.label}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.tools.map((tool) => <Link key={tool.href} href={tool.href} className="group flex min-h-16 items-center justify-between rounded-xl border border-[#d9e4f3] bg-white px-5 py-4 font-medium text-heading shadow-sm hover:border-primary"><span>{tool.label}</span><ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" /></Link>)}</div></section>)}</div></main><Footer /></>;
}
