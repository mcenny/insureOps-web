import { NextResponse, type NextRequest } from "next/server";
import { paginate, parseListQuery, store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency();
  const query = parseListQuery(request.nextUrl.searchParams, ["status"]);
  const result = paginate({
    items: store.customers(),
    query,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
    search: (c, term) =>
      c.fullName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term),
    filter: (c, filters) => {
      const status = filters.status;
      if (status) {
        const list = Array.isArray(status) ? status : [status];
        if (!list.includes(c.status)) return false;
      }
      return true;
    },
    sort: (c, field) => {
      switch (field) {
        case "fullName":
          return c.fullName;
        case "createdAt":
          return new Date(c.createdAt).getTime();
        case "status":
          return c.status;
        default:
          return undefined;
      }
    },
  });
  return NextResponse.json(result);
}
