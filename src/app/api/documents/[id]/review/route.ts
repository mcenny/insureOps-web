import { NextResponse } from "next/server";
import { z } from "zod";
import { recordActivity, store, updateDocument } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";
import { badRequest, notFound } from "@/lib/api/http";
import { documentReviewSchema } from "@/lib/validations";

const actorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum([
    "super_admin",
    "operations_manager",
    "claims_reviewer",
    "finance_admin",
    "support_agent",
  ]),
});

const bodySchema = z.object({
  decision: z.enum(["approve", "reject"]),
  rejectionReason: z.string().min(2).max(280).optional(),
  actor: actorSchema,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulatedLatency();
  const { id } = await params;
  const doc = store.documents().find((d) => d.id === id);
  if (!doc) return notFound("Document");

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return badRequest("Invalid review", { issues: parsed.error.issues });
  }
  const { actor } = parsed.data;
  const reviewParse = documentReviewSchema.safeParse({
    decision: parsed.data.decision,
    rejectionReason: parsed.data.rejectionReason,
  });
  if (!reviewParse.success) {
    return badRequest("Invalid review payload", { issues: reviewParse.error.issues });
  }

  const allowedRoles = ["operations_manager", "claims_reviewer", "super_admin"];
  if (!allowedRoles.includes(actor.role)) {
    return badRequest("This role cannot review documents", { role: actor.role });
  }
  if (doc.status === "approved" || doc.status === "rejected") {
    return badRequest(`Document already ${doc.status}`);
  }

  const decision = reviewParse.data.decision;
  const updated = updateDocument(id, {
    status: decision === "approve" ? "approved" : "rejected",
    rejectionReason: decision === "reject" ? reviewParse.data.rejectionReason : undefined,
    reviewedAt: new Date().toISOString(),
    reviewedBy: actor.id,
  });

  recordActivity({
    kind: decision === "approve" ? "document.approved" : "document.rejected",
    message: `Document ${doc.type.replace("_", " ")} for ${doc.customerName} ${decision === "approve" ? "approved" : "rejected"}`,
    actorId: actor.id,
    actorName: actor.name,
    subjectId: doc.id,
    subjectLabel: doc.type,
  });

  return NextResponse.json({ document: updated });
}
