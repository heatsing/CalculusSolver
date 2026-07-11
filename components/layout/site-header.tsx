"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const siteNavLinks = [
  { label: "Calculus Solver", href: "/calculus-solver" },
  { label: "Algebra Solver", href: "/algebra-solver" },
  { label: "Calculators", href: "/calculators" },
  { label: "Examples", href: "/examples" },
  { label: "Guides", href: "/guides" }
] as const;

function isActive(pathname: string, label: string): boolean {
  if (label === "Calculus Solver") return pathname === "/" || pathname === "/calculus-solver" || pathname === "/daily-challenge";
  if (label === "Algebra Solver") return pathname === "/algebra-solver";
  if (label === "Calculators") return pathname === "/calculators" || pathname.includes("calculator") || pathname.includes("solver") && !pathname.includes("algebra") && pathname !== "/calculus-solver";
  if (label === "Examples") return pathname === "/examples";
  return pathname === "/guides";
}

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();
  return <header className="sticky top-0 z-40 h-16 w-full border-b border-[#dbe5f4] bg-white/95 backdrop-blur"><div className="mx-auto flex h-full max-w-[1240px] items-center px-4 sm:px-6 lg:px-8"><Link href="/" className="shrink-0"><BrandLogo compact /></Link><nav className="mx-auto hidden h-full items-center gap-8 md:flex" aria-label="Main navigation">{siteNavLinks.map((link) => { const active = isActive(pathname, link.label); return <Link key={link.label} href={link.href} aria-current={active ? "page" : undefined} className={`flex h-full items-center border-b-2 text-sm transition-colors ${active ? "border-[#0967ed] font-medium text-[#0967ed]" : "border-transparent text-[#314567] hover:border-[#a8c9fa] hover:text-[#0967ed]"}`}>{link.label}</Link>; })}</nav><Link href="/about" className="hidden rounded-lg border border-[#82aff5] px-5 py-2 text-sm text-[#0967ed] hover:bg-[#eff6ff] sm:block">About</Link><Sheet><SheetTrigger asChild className="ml-auto md:hidden"><Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="h-5 w-5" /></Button></SheetTrigger><SheetContent><nav className="mt-8 flex flex-col" aria-label="Mobile navigation">{siteNavLinks.map((link) => { const active = isActive(pathname, link.label); return <SheetClose key={link.label} asChild><Link href={link.href} aria-current={active ? "page" : undefined} className={`border-b border-[#dbe5f4] px-3 py-4 text-base ${active ? "font-semibold text-[#0967ed]" : "text-[#314567] hover:bg-[#eff6ff]"}`}>{link.label}</Link></SheetClose>; })}<SheetClose asChild><Link href="/about" className="mt-6 rounded-lg border border-[#82aff5] px-4 py-3 text-center text-sm text-[#0967ed]">About</Link></SheetClose></nav></SheetContent></Sheet></div></header>;
}
