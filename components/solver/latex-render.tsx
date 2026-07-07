"use client";

import * as React from "react";
import { MathDisplay } from "@/components/math/math-display";

export function LatexInline({ latex }: { latex: string }): React.JSX.Element {
  return <MathDisplay latex={latex} display="inline" />;
}

export function LatexBlock({ latex }: { latex: string }): React.JSX.Element {
  return <MathDisplay latex={latex} display="block" />;
}

export { MathDisplay } from "@/components/math/math-display";
