import katex from "katex";
import { sanitizeLatex } from "@/lib/latex-utils";
import "katex/dist/katex.min.css";

export type StaticMathProps = {
  latex: string;
  display?: "inline" | "block";
  className?: string;
};

export function StaticMath({
  latex,
  display = "block",
  className
}: StaticMathProps): React.JSX.Element {
  const cleanLatex = sanitizeLatex(latex);

  if (!cleanLatex) {
    return <span className={className}>{latex}</span>;
  }

  const html = katex.renderToString(cleanLatex, {
    displayMode: display === "block",
    throwOnError: false,
    output: "htmlAndMathml",
    strict: "ignore"
  });

  const Component = display === "block" ? "div" : "span";
  return <Component className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
