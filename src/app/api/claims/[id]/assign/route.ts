import { NextResponse } from "next/server";
import { z } from "zod";
import { recordActivity, store, updateClaim } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";
import { badRequest, notFound } from "@/lib/api/http";
import { claimAssignSchema } from "@/lib/validations";
import { DEMO_USERS } from "@/features/auth/demo-users";

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

const bodySchema = claimAssignSchema.extend({ actor: actorSchema });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulatedLatency();
  const { id } = await params;
  const claim = store.claims().find((c) => c.id === id);
  if (!claim) return notFound("Claim");

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return badRequest("Invalid assignment", { issues: parsed.error.issues });
  }

  const { reviewerId, actor } = parsed.data;
  if (actor.role !== "operations_manager" && actor.role !== "super_admin") {
    return badRequest("Only operations managers can assign reviewers", { role: actor.role });
  }

  const reviewer = DEMO_USERS.find((u) => u.id === reviewerId);
  if (!reviewer) return badRequest("Unknown reviewer", { reviewerId });

  const updated = updateClaim(id, {
    assignedTo: reviewer.id,
    assignedToName: reviewer.name,
    status: claim.status === "submitted" ? "under_review" : claim.status,
  });

  recordActivity({
    kind: "claim.assigned",
    message: `Claim ${claim.claimNumber} assigned to ${reviewer.name}`,
    actorId: actor.id,
    actorName: actor.name,
    subjectId: claim.id,
    subjectLabel: claim.claimNumber,
  });

  return NextResponse.json({ claim: updated });
}
