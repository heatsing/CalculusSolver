"use client";

import * as React from "react";
import { InlineMath, BlockMath } from "react-katex";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeLatex } from "@/lib/latex-utils";
import "katex/dist/katex.min.css";

export interface MathDisplayProps {
  latex: string;
  display?: "inline" | "block";
  className?: string;
  showCopy?: boolean;
  fallback?: React.ReactNode;
}

function CopyButton({ latex }: { latex: string }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "absolute right-2 top-2 inline-flex h-7 items-center justify-center rounded-md border border-border bg-white/90 px-2 text-body shadow-sm transition-opacity",
        "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
        "hover:bg-white hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      )}
      aria-label="Copy LaTeX"
      title="Copy LaTeX"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function MathDisplay({
  latex,
  display = "block",
  className,
  showCopy = display === "block",
  fallback = null
}: MathDisplayProps): React.JSX.Element {
  const cleanLatex = sanitizeLatex(latex);
  if (!cleanLatex || cleanLatex.length === 0) {
    return <>{fallback}</>;
  }

  const containerClass = cn(
    display === "block" && "group relative",
    className
  );

  const errorFallback = (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg bg-secondary-background p-3 font-mono text-sm text-body",
        className
      )}
    >
      {latex}
    </pre>
  );

  try {
    if (display === "inline") {
      return (
        <span className={containerClass}>
          <InlineMath math={cleanLatex} renderError={() => errorFallback} />
        </span>
      );
    }

    return (
      <div className={containerClass}>
        <BlockMath math={cleanLatex} renderError={() => errorFallback} />
        {showCopy && <CopyButton latex={cleanLatex} />}
      </div>
    );
  } catch {
    return errorFallback;
  }
}
