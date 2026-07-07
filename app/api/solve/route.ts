import { NextResponse } from "next/server";
import { buildDeepSeekMessages, callDeepSeek } from "@/lib/deepseek";
import { detectOperation, detectPrimaryVariable } from "@/lib/math-parser";
import { computeLocalAnswer, verifyResult } from "@/lib/math-verifier";
import { isRateLimited } from "@/lib/rate-limit";
import { solveRequestSchema, solverResultSchema, type SolverResultResponse } from "@/lib/solver-schema";
import { generateRequestId } from "@/lib/utils";

function createErrorResponse(
  code: string,
  message: string,
  requestId: string,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        requestId
      }
    },
    { status }
  );
}

function snakeToCamelSteps(steps: SolverResultResponse["steps"]): SolverResultResponse["steps"] {
  return steps.map((step) => ({
    number: step.number,
    title: step.title,
    explanation: step.explanation,
    rule: step.rule,
    latex_before: step.latex_before,
    latex_after: step.latex_after
  }));
}

function createLocalFallback(input: string, mode: string): SolverResultResponse {
  const operation = detectOperation(input);
  const variable = detectPrimaryVariable(input);
  const localAnswer = computeLocalAnswer(input, operation, variable);

  return {
    operation: operation as SolverResultResponse["operation"],
    interpreted_problem: input,
    interpreted_latex: input,
    answer: localAnswer,
    answer_latex: localAnswer,
    answer_type: "exact",
    steps: [
      { number: 1, title: "Interpret the problem", explanation: `The input was interpreted as ${operation}.`, rule: "Operation detection" },
      { number: 2, title: "Compute locally", explanation: `Using local symbolic computation, the result is ${localAnswer}.`, rule: "Nerdamer / math.js" }
    ],
    verification: {
      status: "uncertain",
      explanation: "This fallback response was generated without AI because the DeepSeek API key is not configured."
    },
    graph: {
      available: operation === "graph" || operation === "simplify",
      expression: operation === "graph" || operation === "simplify" ? localAnswer : null,
      variable,
      domain: [-10, 10]
    },
    warnings: ["AI unavailable. Results are generated locally and may be limited."]
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const requestId = generateRequestId();

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse("INVALID_REQUEST", "Invalid JSON body.", requestId, 400);
    }

    const parsedRequest = solveRequestSchema.safeParse(body);
    if (!parsedRequest.success) {
      const issues = parsedRequest.error.issues.map((issue) => issue.message).join("; ");
      return createErrorResponse("INVALID_REQUEST", issues, requestId, 400);
    }

    if (isRateLimited()) {
      return createErrorResponse("RATE_LIMITED", "Too many requests. Please slow down.", requestId, 429);
    }

    const { input, mode } = parsedRequest.data;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      const fallback = createLocalFallback(input, mode);
      const localVerification = verifyResult(fallback);
      return NextResponse.json({
        status: "success",
        requestId,
        result: {
          ...fallback,
          localVerification,
          aiVerification: fallback.verification
        }
      });
    }

    const messages = buildDeepSeekMessages({ input, mode });
    const deepseekResponse = await callDeepSeek(messages);

    const choices = (deepseekResponse as { choices?: Array<{ message?: { content?: string } }> }).choices;
    const content = choices?.[0]?.message?.content;
    if (!content) {
      return createErrorResponse("INVALID_AI_RESPONSE", "AI returned an empty response.", requestId, 502);
    }

    let parsedAi: unknown;
    try {
      parsedAi = JSON.parse(content.trim());
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        return createErrorResponse("INVALID_AI_RESPONSE", "AI response was not valid JSON.", requestId, 502);
      }
      try {
        parsedAi = JSON.parse(match[0]);
      } catch {
        return createErrorResponse("INVALID_AI_RESPONSE", "AI response was not valid JSON.", requestId, 502);
      }
    }

    const parsedAiResult = solverResultSchema.safeParse(parsedAi);
    if (!parsedAiResult.success) {
      return createErrorResponse("INVALID_AI_RESPONSE", "AI response did not match the expected format.", requestId, 502);
    }

    const aiResult = parsedAiResult.data;
    const localVerification = verifyResult(aiResult);

    return NextResponse.json({
      status: "success",
      requestId,
      result: {
        ...aiResult,
        steps: snakeToCamelSteps(aiResult.steps),
        localVerification,
        aiVerification: aiResult.verification
      }
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return createErrorResponse("SOLVE_TIMEOUT", "The request timed out. Please try again.", requestId, 504);
    }
    return createErrorResponse("SOLVE_FAILED", "We could not solve this problem. Please check the expression and try again.", requestId, 500);
  }
}
