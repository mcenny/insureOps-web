import { StatusBadge } from "@/components/status/StatusBadge";
import type { CustomerStatus } from "@/types";

const LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  flagged: "Flagged",
};

const TONES = {
  active: "success",
  inactive: "neutral",
  flagged: "danger",
} as const;

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <StatusBadge tone={TONES[status]}>{LABELS[status]}</StatusBadge>;
}
