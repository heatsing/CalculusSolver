import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { SolveRequest } from "@/lib/solver-schema";

export type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callDeepSeek(messages: DeepSeekMessage[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35000);

  try {
    const retryableStatuses = new Set([429, 500, 502, 503]);
    const delays = [0, 500, 1500];
    let lastError: unknown;

    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (delays[attempt] > 0) {
        await wait(delays[attempt] + Math.floor(Math.random() * 150), controller.signal);
      }
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.1,
            max_tokens: 2048,
            response_format: { type: "json_object" }
          }),
          signal: controller.signal,
          cache: "no-store"
        });

        if (response.ok) return (await response.json()) as unknown;
        const error = new Error(`DeepSeek request failed: ${response.status}`);
        if (!retryableStatuses.has(response.status)) throw error;
        lastError = error;
      } catch (error) {
        if (controller.signal.aborted) throw error;
        const networkFailure = error instanceof TypeError;
        const retryableHttp = error instanceof Error && /(?:429|500|502|503)$/.test(error.message);
        if (!networkFailure && !retryableHttp) throw error;
        lastError = error;
      }
    }
    throw lastError instanceof Error ? lastError : new Error("DeepSeek request failed after retries");
  } finally {
    clearTimeout(timeout);
  }
}

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Request aborted", "AbortError"));
    }, { once: true });
  });
}

export function buildRepairMessages(invalidResponse: string, validationErrors: string): DeepSeekMessage[] {
  return [
    {
      role: "system",
      content: "Repair JSON structure only. Never recalculate or change the mathematical answer. Return valid JSON only."
    },
    {
      role: "user",
      content: `The previous response did not match the required JSON schema.\nDo not solve the math problem again.\nDo not change the mathematical answer.\nOnly repair JSON syntax and field structure.\n\nValidation errors:\n${validationErrors}\n\nInvalid response:\n${invalidResponse.slice(0, 12000)}`
    }
  ];
}

export function estimateDeepSeekCost(usage: {
  prompt_tokens?: number;
  completion_tokens?: number;
}): {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
} {
  const inputTokens = usage.prompt_tokens ?? 0;
  const outputTokens = usage.completion_tokens ?? 0;
  const totalTokens = inputTokens + outputTokens;
  const estimatedCostUsd = (inputTokens * 0.27 + outputTokens * 1.1) / 1_000_000;

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCostUsd
  };
}

export function buildDeepSeekMessages({ input, mode }: SolveRequest): DeepSeekMessage[] {
  return [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    {
      role: "user",
      content: buildUserPrompt(input, mode)
    }
  ];
}
