import { NextResponse } from "next/server";
import { z } from "zod";
import { callDeepSeek } from "@/lib/deepseek";
import { EXPLAIN_STEP_PROMPT, buildExplainStepPrompt } from "@/lib/prompts";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { readJsonRequest } from "@/lib/api-security";
import { validateMathInputComplexity } from "@/lib/math-security";

const explainStepRequestSchema = z.object({
  input: z.string().trim().min(1).max(2000),
  step: z.object({
    number: z.number().int().min(1).max(100),
    title: z.string().trim().min(1).max(200),
    explanation: z.string().trim().min(1).max(2000),
    rule: z.string().max(200).optional(),
    latexBefore: z.string().max(2000).optional(),
    latexAfter: z.string().max(2000).optional()
  })
});

const explainStepResponseSchema = z.object({
  explanation: z.string().max(8000),
  latexExample: z.string().max(4000).nullable().optional(),
  commonMistake: z.string().max(4000).nullable().optional(),
  keyTakeaway: z.string().max(4000).nullable().optional()
});

export const maxDuration = 45;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyResult = await readJsonRequest(request);
    if (!bodyResult.ok) {
      return NextResponse.json(
        { error: { code: bodyResult.code, message: bodyResult.message } },
        { status: bodyResult.status }
      );
    }
    if (isRateLimited(`explain:${getClientKey(request)}`, 10)) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many explanation requests. Please wait a minute." } },
        { status: 429 }
      );
    }
    const parsed = explainStepRequestSchema.safeParse(bodyResult.data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "Invalid request format." } },
        { status: 400 }
      );
    }

    const { input, step } = parsed.data;
    const complexity = validateMathInputComplexity(input, { maxLength: 2000 });
    if (!complexity.ok) {
      return NextResponse.json(
        { error: { code: "INPUT_TOO_COMPLEX", message: complexity.message } },
        { status: 422 }
      );
    }
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: { code: "AI_UNAVAILABLE", message: "AI step explanations are not available right now." } },
        { status: 503 }
      );
    }

    const response = await callDeepSeek([
      { role: "system", content: EXPLAIN_STEP_PROMPT },
      { role: "user", content: buildExplainStepPrompt(input, step) }
    ]);

    const candidate =
      typeof response === "object" &&
      response !== null &&
      "choices" in response &&
      Array.isArray((response as { choices?: unknown[] }).choices) &&
      (response as { choices: { message?: { content?: string } }[] }).choices[0]?.message?.content
        ? JSON.parse(
            (response as { choices: { message: { content: string } }[] }).choices[0].message.content
          )
        : null;

    const validated = explainStepResponseSchema.safeParse(candidate);

    if (!validated.success) {
      return NextResponse.json(
        { error: { code: "INVALID_AI_RESPONSE", message: "Could not parse AI explanation." } },
        { status: 500 }
      );
    }

    return NextResponse.json({ explanation: validated.data });
  } catch {
    return NextResponse.json(
      { error: { code: "EXPLAIN_FAILED", message: "Could not explain this step. Please try again later." } },
      { status: 500 }
    );
  }
}
