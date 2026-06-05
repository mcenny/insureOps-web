import { NextResponse, type NextRequest } from "next/server";
import { store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency(100, 280);
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.max(1, Math.min(Number(limitParam ?? 40) || 40, 200));
  const items = store.activities().slice(0, limit);
  return NextResponse.json({ items, total: store.activities().length });
}
