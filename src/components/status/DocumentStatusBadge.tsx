import { StatusBadge } from "./StatusBadge";
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_TONE } from "@/lib/constants";
import type { DocumentStatus } from "@/types";

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <StatusBadge tone={DOCUMENT_STATUS_TONE[status]}>{DOCUMENT_STATUS_LABELS[status]}</StatusBadge>
  );
}
