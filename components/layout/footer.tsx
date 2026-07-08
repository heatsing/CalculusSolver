import Link from "next/link";

const productLinks = [
  { label: "Calculus Solver", href: "/calculus-solver" },
  { label: "Algebra Solver", href: "/algebra-solver" },
  { label: "Derivative Calculator", href: "/derivative-calculator" },
  { label: "Integral Calculator", href: "/integral-calculator" },
  { label: "Limit Calculator", href: "/limit-calculator" },
  { label: "Equation Solver", href: "/equation-solver" },
  { label: "Examples", href: "/examples" }
];

const resourceLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" }
];

export function Footer(): React.JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-secondary-background">
      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-heading">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm text-white">∫</span>
              Calculus Solver
            </Link>
            <p className="mt-3 text-sm text-body">
              Step-by-step math solutions for calculus, algebra, and more.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-heading">Product</h3>
            <ul className="mt-4 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-body hover:text-heading">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-heading">Legal</h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-body hover:text-heading">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-body">
          © {year} Calculus Solver. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
