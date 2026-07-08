"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Calculus", href: "/calculus-solver" },
  { label: "Algebra", href: "/algebra-solver" },
  { label: "Examples", href: "/examples" }
];

export function Header(): React.JSX.Element {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSolver(): void {
    const element = document.getElementById("solver-input");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      const textarea = element.querySelector("textarea");
      if (textarea) textarea.focus();
    } else {
      window.location.href = "/#solver-input";
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 w-full border-b transition-colors",
        scrolled ? "border-border bg-white/95 backdrop-blur" : "border-transparent bg-white"
      )}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-heading">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-serif text-white">∫</span>
          Calculus Solver
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-body transition-colors hover:text-heading"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button onClick={scrollToSolver}>Solve now</Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-body transition-colors hover:text-heading"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button onClick={scrollToSolver} className="mt-4 w-full">
                  Solve now
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
