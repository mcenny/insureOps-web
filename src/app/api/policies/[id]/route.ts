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
  const policy = store.policies().find((p) => p.id === id);
  if (!policy) return notFound("Policy");
  const claims = store.claims().filter((c) => c.policyId === id);
  const payments = store.payments().filter((p) => p.policyId === id);
  return NextResponse.json({ policy, claims, payments });
}
