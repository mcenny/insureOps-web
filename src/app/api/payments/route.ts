import { NextResponse, type NextRequest } from "next/server";
import { paginate, parseListQuery, store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency();
  const query = parseListQuery(request.nextUrl.searchParams, ["status", "method"]);
  const result = paginate({
    items: store.payments(),
    query,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
    search: (p, term) =>
      p.reference.toLowerCase().includes(term) ||
      p.customerName.toLowerCase().includes(term) ||
      p.policyNumber.toLowerCase().includes(term),
    filter: (p, filters) => {
      const status = filters.status;
      const method = filters.method;
      if (status) {
        const list = Array.isArray(status) ? status : [status];
        if (!list.includes(p.status)) return false;
      }
      if (method) {
        const list = Array.isArray(method) ? method : [method];
        if (!list.includes(p.method)) return false;
      }
      return true;
    },
    sort: (p, field) => {
      switch (field) {
        case "reference":
          return p.reference;
        case "amount":
          return p.amount;
        case "createdAt":
          return new Date(p.createdAt).getTime();
        case "updatedAt":
          return new Date(p.updatedAt).getTime();
        default:
          return undefined;
      }
    },
  });
  return NextResponse.json(result);
}
