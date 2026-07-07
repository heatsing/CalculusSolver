import { all, create } from "mathjs";

const math = create(all as NonNullable<typeof all>, {});

const DISALLOWED_KEYWORDS = ["eval", "Function", "constructor", "setTimeout", "setInterval"];
const MAX_EXPRESSION_LENGTH = 200;
const MAX_POINT_COUNT = 1000;

export type GraphPoint = { x: number; y: number };

export function sampleGraph(
  expression: string,
  variable: string,
  domain: [number, number],
  pointCount = 200
): GraphPoint[] {
  try {
    const clampedPointCount = Math.min(Math.max(1, pointCount), MAX_POINT_COUNT);
    const compiled = math.compile(expression);
    const points: GraphPoint[] = [];
    const [min, max] = domain;
    const step = (max - min) / clampedPointCount;

    for (let i = 0; i <= clampedPointCount; i++) {
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
  if (!expression || typeof expression !== "string") {
    return null;
  }
  if (expression.length > MAX_EXPRESSION_LENGTH) {
    return null;
  }

  const lower = expression.toLowerCase();
  for (const keyword of DISALLOWED_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) {
      return null;
    }
  }

  if (/[=;`{}\[\]]/.test(expression)) {
    return null;
  }

  const cleaned = expression
    .replace(/\u00B2/g, "^2")
    .replace(/\u00B3/g, "^3")
    .replace(/\u2212/g, "-")
    .replace(/\u03C0/g, "pi")
    .replace(/\u221A/g, "sqrt")
    .trim();

  if (!cleaned) return null;
  return cleaned;
}
