import Link from "next/link";
import { CheckCircle2, Gift, Zap } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SiteHeader } from "@/components/layout/site-header";

export function CalculatorHeader(): React.JSX.Element {
  return <SiteHeader />;
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
        <div><BrandLogo inverse compact /><p className="mt-2 max-w-xs text-xs leading-5 text-blue-100/75">Making calculus clear, simple, and accessible for everyone.</p></div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-blue-100"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link><Link href="/contact">Contact</Link></div>
      </div>
    </footer>
  );
}

export const calculatorSection = "rounded-2xl border border-[#dbe6f6] bg-white p-5 shadow-sm sm:p-7";
