import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { SolveRequest } from "@/lib/solver-schema";

type DeepSeekMessage = {
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
  const timeout = setTimeout(() => controller.abort(), 30000);

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
        response_format: {
          type: "json_object"
        }
      }),
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`DeepSeek request failed: ${response.status}`);
    }

    return (await response.json()) as unknown;
  } finally {
    clearTimeout(timeout);
  }
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
