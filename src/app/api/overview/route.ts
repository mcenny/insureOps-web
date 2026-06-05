import { NextResponse } from "next/server";
import { store } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";

const DAY = 86_400_000;

export async function GET() {
  await simulatedLatency();
  const now = Date.now();
  const policies = store.policies();
  const claims = store.claims();
  const payments = store.payments();
  const documents = store.documents();

  const activePolicies = policies.filter((p) => p.status === "active").length;
  const pendingClaims = claims.filter(
    (c) => c.status === "submitted" || c.status === "under_review",
  ).length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;
  const incompleteDocuments = documents.filter(
    (d) =>
      d.status === "not_uploaded" || d.status === "uploaded" || d.status === "under_review",
  ).length;
  const expiringSoon = policies.filter((p) => {
    if (p.status !== "active") return false;
    const diff = new Date(p.expiryDate).getTime() - now;
    return diff > 0 && diff <= 30 * DAY;
  }).length;

  const claimsByStatus = {
    submitted: claims.filter((c) => c.status === "submitted").length,
    under_review: claims.filter((c) => c.status === "under_review").length,
    approved: claims.filter((c) => c.status === "approved").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
    paid_out: claims.filter((c) => c.status === "paid_out").length,
  };

  return NextResponse.json({
    metrics: {
      activePolicies,
      pendingClaims,
      failedPayments,
      incompleteDocuments,
      expiringSoon,
      totalCustomers: store.customers().length,
    },
    claimsByStatus,
  });
}
