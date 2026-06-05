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
  const payment = store.payments().find((p) => p.id === id);
  if (!payment) return notFound("Payment");
  return NextResponse.json({ payment });
}
