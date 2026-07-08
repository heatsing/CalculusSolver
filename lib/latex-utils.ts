export function sanitizeLatex(latex: string): string {
  if (!latex) return "";

  return latex
    .replace(/^\$+|\$+$/g, "")
    .replace(/^```latex\s*/i, "")
    .replace(/```\s*$/i, "")
    .replace(/\\\[|\\\]/g, "")
    .trim();
}

export function ensureMathMode(latex: string, display: "inline" | "block" = "block"): string {
  const clean = sanitizeLatex(latex);
  if (display === "inline") {
    return clean.startsWith("$") ? clean : `$${clean}$`;
  }
  return clean;
}
