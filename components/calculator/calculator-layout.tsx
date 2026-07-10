import Link from "next/link";
import { CheckCircle2, Gift, Menu, Zap } from "lucide-react";

const nav = [
  ["Calculus Solver", "/calculus-solver"],
  ["Algebra Solver", "/algebra-solver"],
  ["Calculators", "/calculators"],
  ["Examples", "/examples"],
  ["Guides", "/guides"]
] as const;

export function CalculatorHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dbe6f6] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 font-bold text-[#0a234f]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0967ed] font-serif text-xl text-white shadow-sm">∫</span>
          <span className="hidden sm:inline">Calculus Calculator</span>
        </Link>
        <nav className="hidden min-w-0 flex-1 items-stretch justify-center self-stretch lg:flex" aria-label="Calculator navigation">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className={`flex items-center border-b-2 px-4 text-xs font-medium transition-colors ${label === "Calculators" ? "border-[#0967ed] text-[#0967ed]" : "border-transparent text-[#314567] hover:border-[#a8c9fa] hover:text-[#0967ed]"}`}>{label}</Link>
          ))}
        </nav>
        <Link href="/about" className="ml-auto hidden rounded-lg border border-[#90b9f8] px-4 py-2 text-xs font-medium text-[#0967ed] hover:bg-[#eff6ff] sm:inline-flex">About</Link>
        <details className="relative ml-auto lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#dbe6f6] text-[#0a234f]" aria-label="Open calculator menu"><Menu className="h-5 w-5" /></summary>
          <nav className="absolute right-0 top-12 w-64 rounded-xl border border-[#dbe6f6] bg-white p-2 shadow-xl" aria-label="Mobile calculator navigation">
            {nav.map(([label, href]) => <Link key={label} href={href} className="block rounded-lg px-3 py-3 text-sm text-[#314567] hover:bg-[#eff6ff] hover:text-[#0967ed]">{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function CalculatorBenefits(): React.JSX.Element {
  const items = [
    [CheckCircle2, "Step-by-step solutions", "Clear, detailed explanations"],
    [Zap, "Instant results", "Accurate answers in seconds"],
    [Gift, "Free to use", "No sign-up required"]
  ] as const;
  return <section className="grid gap-4 rounded-2xl border border-[#dbe6f6] bg-white px-5 py-4 shadow-sm sm:grid-cols-3">{items.map(([Icon, title, text]) => <div key={title} className="flex items-center justify-center gap-4 py-2 sm:justify-start"><Icon className="h-7 w-7 shrink-0 text-[#0967ed]" /><div><h2 className="text-sm font-bold text-[#0a234f]">{title}</h2><p className="mt-0.5 text-xs text-[#637392]">{text}</p></div></div>)}</section>;
}

export function CalculatorFooter(): React.JSX.Element {
  return (
    <footer className="mt-16 bg-[#06265a] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1478ff] font-serif text-xl">∫</span><div><p className="font-bold">Calculus Calculator</p><p className="mt-1 max-w-xs text-xs leading-5 text-blue-100/75">Making calculus clear, simple, and accessible for everyone.</p></div></div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-blue-100"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link><Link href="/contact">Contact</Link></div>
      </div>
    </footer>
  );
}

export const calculatorSection = "rounded-2xl border border-[#dbe6f6] bg-white p-5 shadow-sm sm:p-7";
