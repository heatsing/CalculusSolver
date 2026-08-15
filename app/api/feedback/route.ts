import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";
import { readJsonRequest } from "@/lib/api-security";

const schema = z.object({
  value: z.enum(["up", "down"]),
  operation: z.string().max(40),
  verification: z.string().max(40)
});

export async function POST(request: Request): Promise<NextResponse> {
  const bodyResult = await readJsonRequest(request, 2 * 1024);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.message }, { status: bodyResult.status });
  }
  if (isRateLimited(`feedback:${getClientKey(request)}`, 20)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const parsed = schema.safeParse(bodyResult.data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  console.info("solver_feedback", JSON.stringify({ ...parsed.data, receivedAt: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
