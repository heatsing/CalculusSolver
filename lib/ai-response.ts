import { solverResultSchema, type SolverResultResponse } from "@/lib/solver-schema";

export type ParsedAiResponse =
  | { success: true; data: SolverResultResponse }
  | { success: false; error: string };

export function cleanJsonContent(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function parseSolverAiResponse(content: string): ParsedAiResponse {
  const cleaned = cleanJsonContent(content);
  let value: unknown;
  try {
    value = JSON.parse(cleaned);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON syntax"
    };
  }

  const parsed = solverResultSchema.safeParse(value);
  if (!parsed.success) {
    const summary = parsed.error.issues
      .slice(0, 8)
      .map((issue) => `${issue.path.join(".") || "response"}: ${issue.message}`)
      .join("; ");
    return { success: false, error: summary };
  }

  return { success: true, data: parsed.data };
}
