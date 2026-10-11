import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getCalculatorPage } from "@/data/calculator-pages";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => createElement("a", { href, ...props }, children)
}));

import { HomeStartHere, homeStartHereCalculators } from "@/components/marketing/home-start-here";

const requiredHrefs = ["/derivative-calculator", "/limit-calculator", "/integral-calculator", "/calculus-calculator"];

describe("homepage start-here calculators", () => {
  it("renders visible links to the core solvers", () => {
    const html = renderToStaticMarkup(createElement(HomeStartHere));

    expect(readFileSync("components/marketing/calculus-home-page.tsx", "utf8")).toContain("<HomeStartHere />");
    expect(html).toContain('aria-label="Popular calculators"');
    expect(html).toContain("Start here");
    expect(html).toContain("derivative, limit, integral, or calculus calculator");
    for (const href of requiredHrefs) {
      expect(html).toContain(`href="${href}"`);
    }
    for (const calculator of homeStartHereCalculators) {
      expect(html).toContain(`href="${calculator.href}"`);
      expect(html).toContain(calculator.label);
      if (calculator.href === "/calculus-calculator") continue;
      expect(getCalculatorPage(calculator.href.slice(1))?.metadata.path).toBe(calculator.href);
    }
  });
});
