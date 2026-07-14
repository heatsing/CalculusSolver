"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const siteNavLinks = [
  { label: "Calculus Solver", href: "/" },
  { label: "Calculus Calculator", href: "/calculus-calculator" },
  { label: "Derivative Calculator", href: "/derivative-calculator" },
  { label: "Integral Calculator", href: "/integral-calculator" },
  { label: "Limit Calculator", href: "/limit-calculator" },
  { label: "Algebra Solver", href: "/algebra-solver" }
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href;
}

export function SiteHeader(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-[#dbe5f4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1320px] items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Calculus Solver home">
          <BrandLogo compact />
        </Link>
        <nav className="mx-auto hidden h-full items-center gap-4 lg:flex xl:gap-6" aria-label="Main navigation">
          {siteNavLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full items-center border-b-2 text-[13px] font-medium tracking-[.005em] transition-colors xl:text-sm ${active ? "border-[#0967ed] font-semibold text-[#0967ed]" : "border-transparent text-[#20385f] hover:border-[#a8c9fa] hover:text-[#0967ed]"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Sheet>
          <SheetTrigger asChild className="ml-auto lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="mt-8 flex flex-col" aria-label="Mobile navigation">
              {siteNavLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <SheetClose key={link.label} asChild>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`border-b border-[#dbe5f4] px-3 py-4 text-base font-medium tracking-[.005em] ${active ? "font-semibold text-[#0967ed]" : "text-[#20385f] hover:bg-[#eff6ff]"}`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
