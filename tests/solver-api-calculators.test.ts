import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/solve/route";

async function solve(input: string, mode: "auto" | "calculus" | "algebra") {
  const response = await POST(new Request("http://localhost/api/solve", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `profile-${input}` },
    body: JSON.stringify({ input, mode })
  }));
  return { status: response.status, body: await response.json() as { result?: { answer: string; steps: unknown[] }; error?: { message: string } } };
}

describe("data-driven calculator API", () => {
  it.each([
    ["Factor x^2 - 5*x + 6", "algebra", /\(-2\+x\).*\(-3\+x\)/],
    ["Solve x^2 - 5*x + 6 = 0", "algebra", /2.*3|3.*2/],
    ["Calculate the fraction expression 1/2 + 1/3", "auto", /^5\/6$/],
    ["Find the gradient of sin(x) * cos(y)", "calculus", /cos\(x\)\*cos\(y\).*sin\(x\)\*sin\(y\)/],
    ["Calculate the matrix expression det([[1,2],[3,4]])", "auto", /^-2$/],
    ["Calculate the percentage 15% of 200", "auto", /^30$/],
    ["Divide using long division 125 by 4", "auto", /31 remainder 1.*31\.25/],
    ["Analyze the sequence 2, 5, 8, 11", "calculus", /next terms: 14, 17, 20/]
  ] as const)("returns a real result for %s", async (input, mode, expected) => {
    const response = await solve(input, mode);
    expect(response.status, response.body.error?.message).toBe(200);
    expect(response.body.result?.answer).toMatch(expected);
    expect(response.body.result?.steps.length).toBeGreaterThanOrEqual(2);
  });
});
