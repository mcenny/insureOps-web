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
  const document = store.documents().find((d) => d.id === id);
  if (!document) return notFound("Document");
  return NextResponse.json({ document });
}
