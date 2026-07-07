import { all, create } from "mathjs";

const math = create(all as NonNullable<typeof all>, {});

export type GraphPoint = { x: number; y: number };

export function sampleGraph(
  expression: string,
  variable: string,
  domain: [number, number],
  pointCount = 200
): GraphPoint[] {
  try {
    const compiled = math.compile(expression);
    const points: GraphPoint[] = [];
    const [min, max] = domain;
    const step = (max - min) / pointCount;

    for (let i = 0; i <= pointCount; i++) {
      const x = min + i * step;
      try {
        const y = compiled.evaluate({ [variable]: x });
        if (typeof y === "number" && Number.isFinite(y) && Math.abs(y) < 1_000_000) {
          points.push({ x: Number(x.toFixed(6)), y: Number(y.toFixed(6)) });
        }
      } catch {
        // Skip discontinuities and domain errors.
      }
    }

    return points;
  } catch {
    return [];
  }
}

export function sanitizeGraphExpression(expression: string): string | null {
  if (!expression || expression.includes("=") || expression.includes(";")) {
    return null;
  }
  const cleaned = expression
    .replace(/\u00B2/g, "^2")
    .replace(/\u00B3/g, "^3")
    .replace(/\u2212/g, "-")
    .replace(/\u03C0/g, "pi")
    .replace(/\u221A/g, "sqrt")
    .replace(/\{([a-zA-Z])\}/g, "$1")
    .replace(/\[([a-zA-Z])\]/g, "$1")
    .trim();
  if (!cleaned) return null;
  return cleaned;
}
