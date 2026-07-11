import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const columns = [
  ["Solvers", [["Calculus Solver", "/calculus-solver"], ["Algebra Solver", "/algebra-solver"], ["Daily Challenge", "/daily-challenge"]]],
  ["Tools", [["All Calculators", "/calculators"], ["Derivative Calculator", "/derivative-calculator"], ["Integral Calculator", "/integral-calculator"]]],
  ["Learn", [["Guides", "/guides"], ["Examples", "/examples"], ["About", "/about"]]],
  ["Legal", [["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Contact", "/contact"]]]
] as const;

export function Footer(): React.JSX.Element {
  return <footer className="mt-16 bg-[#061f49] text-white"><div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8"><div><BrandLogo inverse compact /><p className="mt-3 max-w-xs text-sm leading-6 text-blue-100/75">Free step-by-step tools for calculus, algebra, and everyday mathematics.</p></div>{columns.map(([title, links]) => <div key={title}><h2 className="text-sm font-bold">{title}</h2><ul className="mt-3 space-y-2">{links.map(([label, href]) => <li key={href}><Link href={href} className="text-sm text-blue-100/75 hover:text-white">{label}</Link></li>)}</ul></div>)}</div><div className="border-t border-white/10 px-4 py-5 text-center text-xs text-blue-100/60">© {new Date().getFullYear()} Calculus Solver. All rights reserved.</div></footer>;
}
