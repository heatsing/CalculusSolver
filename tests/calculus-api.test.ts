import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/calculus/route";

async function solve(input: string, operation: "auto" | "derivative" | "integral" | "limit" | "series") {
  const response = await POST(new Request("http://localhost/api/calculus", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `test-${input}-${operation}` },
    body: JSON.stringify({ input, operation })
  }));
  return { status: response.status, body: await response.json() as { answer?: string; error?: string; steps?: string[] } };
}

describe("calculus calculator API", () => {
  it("solves scientific arithmetic and derivatives", async () => {
    const arithmetic = await solve("sqrt(16) + 3^2", "auto");
    expect(arithmetic.status).toBe(200);
    expect(arithmetic.body.answer).toBe("13");

    const derivative = await solve("d/dx (x^3 * sin(x))", "derivative");
    expect(derivative.status).toBe(200);
    expect(derivative.body.answer).toContain("cos(x)*x^3");
    expect(derivative.body.steps?.length).toBeGreaterThanOrEqual(3);
  });

  it("supports definite integrals and limits entered by the specialized keys", async () => {
    const integral = await solve("x^2 from 0 to 1", "integral");
    expect(integral.status).toBe(200);
    expect(integral.body.answer).toBe("1/3");
    expect(integral.body.answer).not.toContain("+ C");

    const limit = await solve("lim x->0 sin(x)/x", "limit");
    expect(limit.status).toBe(200);
    expect(limit.body.answer).toBe("1");
  });

  it("rejects an invalid empty problem", async () => {
    const response = await solve("", "auto");
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/valid calculus expression/i);
  });
});
