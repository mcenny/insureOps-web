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
  const customer = store.customers().find((c) => c.id === id);
  if (!customer) return notFound("Customer");

  const policies = store.policies().filter((p) => p.customerId === id);
  const claims = store.claims().filter((c) => c.customerId === id);
  const payments = store.payments().filter((p) => p.customerId === id);
  const documents = store.documents().filter((d) => d.customerId === id);

  return NextResponse.json({ customer, policies, claims, payments, documents });
}
