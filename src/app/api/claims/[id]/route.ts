import { NextResponse } from "next/server";
import { store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";
import { notFound } from "@/lib/api/http";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulatedLatency();
  const { id } = await params;
  const claim = store.claims().find((c) => c.id === id);
  if (!claim) return notFound("Claim");
  const policy = store.policies().find((p) => p.id === claim.policyId);
  const customer = store.customers().find((c) => c.id === claim.customerId);
  return NextResponse.json({ claim, policy, customer });
}
