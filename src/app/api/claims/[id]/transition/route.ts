import { NextResponse } from "next/server";
import { z } from "zod";
import { appendClaimNote, recordActivity, store, updateClaim } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";
import { badRequest, notFound } from "@/lib/api/http";
import { claimTransitionSchema } from "@/lib/validations";
import { canTransition } from "@/features/claims/utils";
import type { AdminRole } from "@/types";

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

const bodySchema = claimTransitionSchema.extend({ actor: actorSchema });

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
    return badRequest("Invalid transition request", { issues: parsed.error.issues });
  }

  const { to, note, actor } = parsed.data;
  if (!canTransition(claim.status, to, actor.role as AdminRole)) {
    return badRequest(
      `Cannot transition ${claim.status} -> ${to} as ${actor.role}`,
      { from: claim.status, to, role: actor.role },
    );
  }

  const updated = updateClaim(id, { status: to });
  if (note) {
    appendClaimNote(id, {
      id: `note_${Date.now()}`,
      authorId: actor.id,
      authorName: actor.name,
      body: note,
      createdAt: new Date().toISOString(),
    });
  }
  recordActivity({
    kind: "claim.transitioned",
    message: `Claim ${claim.claimNumber} marked ${to.replace("_", " ")}`,
    actorId: actor.id,
    actorName: actor.name,
    subjectId: claim.id,
    subjectLabel: claim.claimNumber,
  });

  return NextResponse.json({ claim: updated });
}
