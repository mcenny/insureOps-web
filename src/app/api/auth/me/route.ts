import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoUser } from "@/features/auth/demo-users";
import { simulatedLatency } from "@/lib/api/latency";
import { badRequest, notFound } from "@/lib/api/http";

const querySchema = z.object({
  userId: z.string().min(1),
});

/** Demo auth endpoint — real backend would use session cookies instead of userId. */
export async function GET(request: Request) {
  await simulatedLatency(80, 200);
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ userId: searchParams.get("userId") ?? "" });
  if (!parsed.success) {
    return badRequest("userId query parameter is required");
  }
  const user = getDemoUser(parsed.data.userId);
  if (!user) return notFound("User");
  return NextResponse.json({ user });
}
