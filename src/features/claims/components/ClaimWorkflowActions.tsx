"use client";

import { CheckIcon, XIcon, UserPlus2Icon, GavelIcon, BadgeCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClaimTransitionDialog } from "./ClaimTransitionDialog";
import { AssignReviewerDialog } from "./AssignReviewerDialog";
import { useCurrentUser } from "@/hooks/use-can";
import { canTransition, nextStatesFor } from "@/features/claims/utils";
import type { Claim } from "@/types";

export function ClaimWorkflowActions({ claim }: { claim: Claim }) {
  const user = useCurrentUser();
  if (!user) return null;

  const candidates = nextStatesFor(claim.status);
  const allowed = candidates.filter((next) => canTransition(claim.status, next, user.role));
  const canAssign = user.role === "operations_manager" || user.role === "super_admin";

  if (allowed.length === 0 && !canAssign) {
    return (
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        No actions available for your role on a {claim.status.replace("_", " ")} claim.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canAssign ? (
        <AssignReviewerDialog
          claimId={claim.id}
          currentReviewerId={claim.assignedTo}
          trigger={
            <Button variant="outline" size="sm">
              <UserPlus2Icon />
              {claim.assignedTo ? "Reassign" : "Assign reviewer"}
            </Button>
          }
        />
      ) : null}
      {allowed.map((next) => {
        if (next === "under_review") {
          return (
            <ClaimTransitionDialog
              key={next}
              claimId={claim.id}
              toStatus={next}
              title="Move to under review"
              description="Acknowledge the claim and add an opening note."
              trigger={
                <Button size="sm" variant="outline" data-testid="claim-start-review">
                  <GavelIcon />
                  Start review
                </Button>
              }
            />
          );
        }
        if (next === "approved") {
          return (
            <ClaimTransitionDialog
              key={next}
              claimId={claim.id}
              toStatus={next}
              title="Approve claim"
              trigger={
                <Button size="sm" data-testid="claim-approve">
                  <CheckIcon />
                  Approve
                </Button>
              }
            />
          );
        }
        if (next === "rejected") {
          return (
            <ClaimTransitionDialog
              key={next}
              claimId={claim.id}
              toStatus={next}
              variant="destructive"
              title="Reject claim"
              description="Explain why the claim cannot be paid out. The note becomes part of the audit trail."
              trigger={
                <Button size="sm" variant="destructive">
                  <XIcon />
                  Reject
                </Button>
              }
            />
          );
        }
        if (next === "paid_out") {
          return (
            <ClaimTransitionDialog
              key={next}
              claimId={claim.id}
              toStatus={next}
              title="Mark as paid out"
              description="Confirm the payout has been issued to the customer."
              trigger={
                <Button size="sm">
                  <BadgeCheckIcon />
                  Mark paid out
                </Button>
              }
            />
          );
        }
        return null;
      })}
    </div>
  );
}
