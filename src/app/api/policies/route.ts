import { NextResponse, type NextRequest } from "next/server";
import { paginate, parseListQuery, store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

export async function GET(request: NextRequest) {
  await simulatedLatency();
  const query = parseListQuery(request.nextUrl.searchParams, [
    "status",
    "type",
    "paymentStatus",
  ]);
  const result = paginate({
    items: store.policies(),
    query,
    defaultSortBy: "createdAt",
    defaultSortDir: "desc",
    search: (p, term) =>
      p.policyNumber.toLowerCase().includes(term) ||
      p.customerName.toLowerCase().includes(term),
    filter: (p, filters) => {
      const status = filters.status;
      const type = filters.type;
      const paymentStatus = filters.paymentStatus;
      if (status) {
        const list = Array.isArray(status) ? status : [status];
        if (!list.includes(p.status)) return false;
      }
      if (type) {
        const list = Array.isArray(type) ? type : [type];
        if (!list.includes(p.type)) return false;
      }
      if (paymentStatus) {
        const list = Array.isArray(paymentStatus) ? paymentStatus : [paymentStatus];
        if (!list.includes(p.paymentStatus)) return false;
      }
      return true;
    },
    sort: (p, field) => {
      switch (field) {
        case "policyNumber":
          return p.policyNumber;
        case "customerName":
          return p.customerName;
        case "premiumAmount":
          return p.premiumAmount;
        case "expiryDate":
          return new Date(p.expiryDate).getTime();
        case "startDate":
          return new Date(p.startDate).getTime();
        case "createdAt":
          return new Date(p.createdAt).getTime();
        default:
          return undefined;
      }
    },
  });
  return NextResponse.json(result);
}
