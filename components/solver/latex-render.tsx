"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export function LatexInline({ latex }: { latex: string }): React.JSX.Element {
  try {
    return <InlineMath math={latex} />;
  } catch {
    return <span className="font-mono text-body">{latex}</span>;
  }
}

export function LatexBlock({ latex }: { latex: string }): React.JSX.Element {
  try {
    return <BlockMath math={latex} />;
  } catch {
    return <pre className="overflow-x-auto rounded-lg bg-secondary-background p-3 font-mono text-sm text-body">{latex}</pre>;
  }
}
