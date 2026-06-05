import { NextResponse, type NextRequest } from "next/server";
import { paginate, parseListQuery, store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency();
  const query = parseListQuery(request.nextUrl.searchParams, ["status", "assignedTo"]);
  const result = paginate({
    items: store.claims(),
    query,
    defaultSortBy: "submittedAt",
    defaultSortDir: "desc",
    search: (c, term) =>
      c.claimNumber.toLowerCase().includes(term) ||
      c.customerName.toLowerCase().includes(term) ||
      c.policyNumber.toLowerCase().includes(term),
    filter: (c, filters) => {
      const status = filters.status;
      const assignedTo = filters.assignedTo;
      if (status) {
        const list = Array.isArray(status) ? status : [status];
        if (!list.includes(c.status)) return false;
      }
      if (assignedTo) {
        const list = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
        if (assignedTo === "unassigned") {
          if (c.assignedTo) return false;
        } else if (!c.assignedTo || !list.includes(c.assignedTo)) {
          return false;
        }
      }
      return true;
    },
    sort: (c, field) => {
      switch (field) {
        case "claimNumber":
          return c.claimNumber;
        case "customerName":
          return c.customerName;
        case "claimAmount":
          return c.claimAmount;
        case "submittedAt":
          return new Date(c.submittedAt).getTime();
        case "updatedAt":
          return new Date(c.updatedAt).getTime();
        default:
          return undefined;
      }
    },
  });
  return NextResponse.json(result);
}
