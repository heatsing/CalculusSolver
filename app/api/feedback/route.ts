import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

const schema = z.object({
  value: z.enum(["up", "down"]),
  operation: z.string().max(40),
  verification: z.string().max(40)
});

export async function POST(request: Request): Promise<NextResponse> {
  if (isRateLimited(`feedback:${getClientKey(request)}`, 20)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  console.info("solver_feedback", JSON.stringify({ ...parsed.data, receivedAt: new Date().toISOString() }));
  return NextResponse.json({ ok: true });
}
