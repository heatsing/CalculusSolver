"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { label: "Calculus Solver", href: "/calculus-solver" },
  { label: "Algebra Solver", href: "/algebra-solver" },
  { label: "Calculators", href: "/calculators" },
  { label: "Examples", href: "/examples" },
  { label: "Guides", href: "/guides" }
];

export function Header(): React.JSX.Element {
  function scrollToSolver(): void {
    const element = document.getElementById("solver-input");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.querySelector("textarea")?.focus();
    } else {
      window.location.href = "/#solver-input";
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3 border-r border-border pr-6 text-base font-medium text-heading md:h-16">
          <span className="flex h-8 w-8 items-center justify-center bg-heading font-mono text-lg text-white">∫</span>
          <span>Calculus Solver</span>
        </Link>

        <nav className="hidden h-full items-center md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex h-full items-center border-l border-transparent px-4 text-sm text-body transition-colors hover:border-primary hover:bg-secondary-background hover:text-heading">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button onClick={scrollToSolver}>Solve now <ArrowRight className="h-4 w-4" /></Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <SheetClose key={link.href} asChild>
                  <Link href={link.href} className="border-b border-border px-2 py-4 text-base text-body hover:bg-secondary-background hover:text-heading">{link.label}</Link>
                </SheetClose>
              ))}
              <SheetClose asChild><Button onClick={scrollToSolver} className="mt-6 w-full">Solve now</Button></SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
