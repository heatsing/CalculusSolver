import Link from "next/link";

export const homeStartHereCalculators = [
  { label: "Derivative Calculator", href: "/derivative-calculator" },
  { label: "Limit Calculator", href: "/limit-calculator" },
  { label: "Integral Calculator", href: "/integral-calculator" },
  { label: "Calculus Calculator", href: "/calculus-calculator" },
  { label: "Algebra Solver", href: "/algebra-solver" },
  { label: "Equation Solver", href: "/equation-solver" }
] as const;

export function HomeStartHere(): React.JSX.Element {
  return (
    <nav aria-label="Popular calculators" className="mx-auto mt-6 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0967ed]">Start here</p>
      <p className="mt-2 text-sm leading-6 text-[#5f6f8d]">Open a derivative, limit, integral, or calculus calculator.</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {homeStartHereCalculators.map((calculator) => (
          <li key={calculator.href}>
            <Link
              href={calculator.href}
              className="inline-flex min-h-11 items-center rounded-full border border-[#b9d1f2] bg-white px-4 text-sm font-semibold text-[#0967ed] hover:border-[#0967ed] hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0967ed] focus-visible:ring-offset-2"
            >
              {calculator.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
