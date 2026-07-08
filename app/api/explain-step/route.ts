import { NextResponse } from "next/server";
import { z } from "zod";
import { callDeepSeek } from "@/lib/deepseek";
import { EXPLAIN_STEP_PROMPT, buildExplainStepPrompt } from "@/lib/prompts";

const explainStepRequestSchema = z.object({
  input: z.string().trim().min(1).max(2000),
  step: z.object({
    number: z.number(),
    title: z.string(),
    explanation: z.string(),
    rule: z.string().optional(),
    latexBefore: z.string().optional(),
    latexAfter: z.string().optional()
  })
});

const explainStepResponseSchema = z.object({
  explanation: z.string(),
  latexExample: z.string().nullable().optional(),
  commonMistake: z.string().nullable().optional(),
  keyTakeaway: z.string().nullable().optional()
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as unknown;
    const parsed = explainStepRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "Invalid request format." } },
        { status: 400 }
      );
    }

    const { input, step } = parsed.data;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to explain step.";
    return NextResponse.json(
      { error: { code: "EXPLAIN_FAILED", message } },
      { status: 500 }
    );
  }
}
