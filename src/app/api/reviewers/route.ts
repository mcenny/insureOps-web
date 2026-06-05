import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/features/auth/demo-users";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET() {
  await simulatedLatency(80, 200);
  const reviewers = DEMO_USERS.filter(
    (u) => u.role === "claims_reviewer" || u.role === "operations_manager" || u.role === "super_admin",
  );
  return NextResponse.json({ items: reviewers });
}
