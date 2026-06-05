import { StatusBadge } from "./StatusBadge";
import { CLAIM_STATUS_LABELS, CLAIM_STATUS_TONE } from "@/lib/constants";
import type { ClaimStatus } from "@/types";

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return (
    <StatusBadge tone={CLAIM_STATUS_TONE[status]} data-testid={`claim-status-${status}`}>
      {CLAIM_STATUS_LABELS[status]}
    </StatusBadge>
  );
}
