import { NextResponse, type NextRequest } from "next/server";
import { paginate, parseListQuery, store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency();
  const query = parseListQuery(request.nextUrl.searchParams, ["status", "type"]);
  const result = paginate({
    items: store.documents(),
    query,
    defaultSortBy: "uploadedAt",
    defaultSortDir: "desc",
    search: (d, term) =>
      d.customerName.toLowerCase().includes(term) || d.type.toLowerCase().includes(term),
    filter: (d, filters) => {
      const status = filters.status;
      const type = filters.type;
      if (status) {
        const list = Array.isArray(status) ? status : [status];
        if (!list.includes(d.status)) return false;
      }
      if (type) {
        const list = Array.isArray(type) ? type : [type];
        if (!list.includes(d.type)) return false;
      }
      return true;
    },
    sort: (d, field) => {
      switch (field) {
        case "customerName":
          return d.customerName;
        case "type":
          return d.type;
        case "uploadedAt":
          return d.uploadedAt ? new Date(d.uploadedAt).getTime() : 0;
        case "reviewedAt":
          return d.reviewedAt ? new Date(d.reviewedAt).getTime() : 0;
        default:
          return undefined;
      }
    },
  });
  return NextResponse.json(result);
}
