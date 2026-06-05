import { StatusBadge } from "./StatusBadge";
import { POLICY_STATUS_LABELS, POLICY_STATUS_TONE } from "@/lib/constants";
import type { PolicyStatus } from "@/types";

export function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  return <StatusBadge tone={POLICY_STATUS_TONE[status]}>{POLICY_STATUS_LABELS[status]}</StatusBadge>;
}
