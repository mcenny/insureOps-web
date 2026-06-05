import { NextResponse } from "next/server";
import { z } from "zod";
import { recordActivity, store, updatePayment } from "@/lib/api/server-store";
import { simulatedLatency } from "@/lib/api/latency";
import { badRequest, notFound } from "@/lib/api/http";

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

const bodySchema = z.object({ actor: actorSchema });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await simulatedLatency();
  const { id } = await params;
  const payment = store.payments().find((p) => p.id === id);
  if (!payment) return notFound("Payment");

  const json = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return badRequest("Invalid retry request", { issues: parsed.error.issues });
  }
  const { actor } = parsed.data;
  if (actor.role !== "finance_admin" && actor.role !== "super_admin") {
    return badRequest("Only finance admins can retry payments", { role: actor.role });
  }
  if (payment.status !== "failed") {
    return badRequest(`Payment is ${payment.status}; only failed payments can be retried`);
  }

  updatePayment(id, { status: "pending", failureReason: undefined });
  recordActivity({
    kind: "payment.retried",
    message: `Payment ${payment.reference} retry initiated`,
    actorId: actor.id,
    actorName: actor.name,
    subjectId: payment.id,
    subjectLabel: payment.reference,
  });

  await simulatedLatency(400, 900);

  const outcome: "paid" | "failed" = Math.random() < 0.7 ? "paid" : "failed";
  const updated = updatePayment(id, {
    status: outcome,
    failureReason: outcome === "failed" ? "Retry declined" : undefined,
  });

  recordActivity({
    kind: outcome === "paid" ? "payment.succeeded" : "payment.failed",
    message:
      outcome === "paid"
        ? `Payment ${payment.reference} succeeded on retry`
        : `Payment ${payment.reference} failed again on retry`,
    actorId: actor.id,
    actorName: actor.name,
    subjectId: payment.id,
    subjectLabel: payment.reference,
  });

  return NextResponse.json({ payment: updated, outcome });
}
