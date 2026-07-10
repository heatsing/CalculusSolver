import { NextResponse } from "next/server";
import { buildDeepSeekMessages, buildRepairMessages, callDeepSeek, estimateDeepSeekCost } from "@/lib/deepseek";
import { parseSolverAiResponse } from "@/lib/ai-response";
import { detectOperation, detectPrimaryVariable, normalizeInput, toMachineExpression } from "@/lib/math-parser";
import { computeLocalAnswer, verifyResult } from "@/lib/math-verifier";
import { checkResultConsistency } from "@/lib/result-consistency";
import { isRateLimited } from "@/lib/rate-limit";
import { solveCache } from "@/lib/request-cache";
import { solveRequestSchema, solverResultSchema, type SolverResultResponse } from "@/lib/solver-schema";
import { generateRequestId } from "@/lib/utils";
import type { SolverResult } from "@/types/solver";

export const dynamic = "force-dynamic";

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

function renumberSteps(steps: SolverResultResponse["steps"]): SolverResultResponse["steps"] {
  return steps.map((step, index) => ({
    ...step,
    number: index + 1
  }));
}

function mapSolverResultResponse(
  response: SolverResultResponse,
  localVerification: SolverResult["localVerification"],
  aiVerification: SolverResult["aiVerification"]
): SolverResult {
  return {
    operation: response.operation,
    interpretedProblem: response.interpreted_problem,
    interpretedLatex: response.interpreted_latex,
    answer: response.answer,
    answerLatex: response.answer_latex,
    answerType: response.answer_type,
    steps: response.steps.map((step) => ({
      number: step.number,
      title: step.title,
      explanation: step.explanation,
      rule: step.rule,
      latexBefore: step.latexBefore,
      latexAfter: step.latexAfter
    })),
    aiVerification,
    localVerification,
    graph: response.graph,
    machine: response.machine,
    warnings: response.warnings
  };
}

async function createLocalFallback(input: string, mode: string): Promise<SolverResultResponse> {
  const operation = detectOperation(input);
  const variable = detectPrimaryVariable(input);
  const localAnswer = await computeLocalAnswer(input, operation, variable);
  let sourceExpression = normalizeInput(input);
  const prefixes: Partial<Record<string, RegExp>> = {
    derivative: /^(?:differentiate|find the derivative of|derivative of)\s*/i,
    integral: /^(?:integrate|find the integral of|integral of)\s*/i,
    solve_equation: /^(?:solve|find [xy])\s*/i,
    factor: /^(?:factor|factorise)\s*/i,
    expand: /^expand\s*/i,
    simplify: /^(?:simplify|reduce)\s*/i,
    graph: /^(?:graph|plot|draw)\s*/i
  };
  if (prefixes[operation]) sourceExpression = sourceExpression.replace(prefixes[operation]!, "").trim();
  if (operation === "integral") sourceExpression = sourceExpression.replace(/\s*d[a-z]\s*$/i, "").trim();
  if (operation === "limit") {
    const limitMatch = sourceExpression.match(/(?:evaluate the )?limit\s+(.+?)\s+(?:as\s+)?[a-z]\s*(?:approaches|->)\s*[^\s]+/i);
    if (limitMatch) sourceExpression = limitMatch[1];
  }
  const machineSource = toMachineExpression(sourceExpression);
  const equationParts = operation === "solve_equation" ? machineSource.split("=") : [];
  const solutions = operation === "solve_equation" ? localAnswer.split(",").map((value) => value.trim()).filter(Boolean) : [];

  return {
    operation: operation as SolverResultResponse["operation"],
    interpreted_problem: input,
    interpreted_latex: input,
    answer: localAnswer,
    answer_latex: localAnswer,
    answer_type: "exact",
    steps: [
      {
        number: 1,
        title: "Interpret the problem",
        explanation: `The input was interpreted as ${operation}.`,
        rule: "Operation detection",
        latexBefore: undefined,
        latexAfter: undefined
      },
      {
        number: 2,
        title: "Compute locally",
        explanation: `Using local symbolic computation, the result is ${localAnswer}.`,
        rule: "Nerdamer / math.js",
        latexBefore: undefined,
        latexAfter: undefined
      }
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
    machine: {
      source_expression: operation !== "graph" ? machineSource : null,
      answer_expression: operation !== "graph" ? localAnswer.replace(/\s*\+\s*C\s*$/i, "") : null,
      variable,
      equation_left: equationParts.length === 2 ? equationParts[0] : null,
      equation_right: equationParts.length === 2 ? equationParts[1] : null,
      solutions,
      lower_bound: null,
      upper_bound: null,
      limit_point: null,
      limit_direction: null
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

    const { input, mode } = parsedRequest.data;
    const cacheKey = `${mode}:${input.trim()}`;
    const cached = solveCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        status: "success",
        requestId,
        result: cached
      });
    }

    if (isRateLimited()) {
      return createErrorResponse("RATE_LIMITED", "Too many requests. Please slow down.", requestId, 429);
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      const fallback = await createLocalFallback(input, mode);
      const localVerification = await verifyResult(fallback);
      const consistencyWarnings = checkResultConsistency(fallback);
      const result = mapSolverResultResponse(
        {
          ...fallback,
          steps: renumberSteps(fallback.steps),
          warnings: [...fallback.warnings, ...consistencyWarnings]
        },
        localVerification,
        fallback.verification
      );
      return NextResponse.json({
        status: "success",
        requestId,
        result
      });
    }

    const messages = buildDeepSeekMessages({ input, mode });
    const deepseekResponse = await callDeepSeek(messages);

    const usage = (deepseekResponse as { usage?: { prompt_tokens?: number; completion_tokens?: number } }).usage;
    if (usage) {
      const cost = estimateDeepSeekCost(usage);
      console.info(
        `DeepSeek cost estimate: $${cost.estimatedCostUsd.toFixed(6)} (${cost.totalTokens} tokens)`
      );
    }

    const choices = (deepseekResponse as { choices?: Array<{ message?: { content?: string } }> }).choices;
    const content = choices?.[0]?.message?.content;
    if (!content) {
      return createErrorResponse("INVALID_AI_RESPONSE", "AI returned an empty response.", requestId, 502);
    }

    let parsedAiResult = parseSolverAiResponse(content);
    if (!parsedAiResult.success) {
      const repairResponse = await callDeepSeek(buildRepairMessages(content, parsedAiResult.error));
      const repairChoices = (repairResponse as { choices?: Array<{ message?: { content?: string } }> }).choices;
      const repairedContent = repairChoices?.[0]?.message?.content;
      if (!repairedContent) {
        return createErrorResponse("INVALID_AI_RESPONSE", "The solver returned an invalid response. Please try again.", requestId, 502);
      }
      parsedAiResult = parseSolverAiResponse(repairedContent);
      if (!parsedAiResult.success) {
        return createErrorResponse("INVALID_AI_RESPONSE", "The solver returned an invalid response. Please try again.", requestId, 502);
      }
    }

    const aiResult = parsedAiResult.data;
    const consistencyWarnings = checkResultConsistency(aiResult);
    const localVerification = await verifyResult(aiResult);

    const result = mapSolverResultResponse(
      {
        ...aiResult,
        steps: renumberSteps(aiResult.steps),
        warnings: [...aiResult.warnings, ...consistencyWarnings]
      },
      localVerification,
      aiResult.verification
    );

    solveCache.set(cacheKey, result);

    return NextResponse.json({
      status: "success",
      requestId,
      result
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return createErrorResponse("SOLVE_TIMEOUT", "The request timed out. Please try again.", requestId, 504);
    }
    return createErrorResponse("SOLVE_FAILED", "We could not solve this problem. Please check the expression and try again.", requestId, 500);
  }
}
