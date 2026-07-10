import Link from "next/link";

const productLinks = [
  { label: "Calculus Solver", href: "/calculus-solver" },
  { label: "Algebra Solver", href: "/algebra-solver" },
  { label: "Calculus Calculator", href: "/calculus-calculator" },
  { label: "Derivative Calculator", href: "/derivative-calculator" },
  { label: "Integral Calculator", href: "/integral-calculator" },
  { label: "Limit Calculator", href: "/limit-calculator" },
  { label: "Equation Solver", href: "/equation-solver" },
  { label: "Examples", href: "/examples" }
];

const resourceLinks = [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }];

export function Footer(): React.JSX.Element {
  return (
    <footer className="mt-24 border-t border-[#393939] bg-heading text-white">
      <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex min-h-11 items-center gap-3 text-lg font-medium text-white">
              <span className="flex h-8 w-8 items-center justify-center bg-white font-mono text-heading">∫</span>
              Calculus Solver
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#c6c6c6]">Step-by-step math solutions for calculus, algebra, and more.</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Product</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {productLinks.map((link) => <li key={link.href}><Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-[#c6c6c6] hover:text-white sm:min-h-0">{link.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => <li key={link.label}><Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-[#c6c6c6] hover:text-white sm:min-h-0">{link.label}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#393939] pt-6 text-sm text-[#8d8d8d]">© {new Date().getFullYear()} Calculus Solver. All rights reserved.</div>
      </div>
    </footer>
  );
}
