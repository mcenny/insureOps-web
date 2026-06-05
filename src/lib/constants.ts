import type { AdminRole, ClaimStatus, DocumentStatus, PaymentStatus, PolicyStatus } from "@/types";

export const APP_NAME = "InsureOps";
export const APP_DESCRIPTION =
  "Operations dashboard for fictional insurance workflows - customers, policies, claims, payments, and documents.";

export const SIMULATED_LATENCY_MS = {
  min: 180,
  max: 520,
};

export const PAGE_SIZE_DEFAULT = 20;

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super admin",
  operations_manager: "Operations manager",
  claims_reviewer: "Claims reviewer",
  finance_admin: "Finance admin",
  support_agent: "Support agent",
};

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  draft: "Draft",
  active: "Active",
  expired: "Expired",
  cancelled: "Cancelled",
};

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  paid_out: "Paid out",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  not_uploaded: "Not uploaded",
  uploaded: "Uploaded",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
};

type ToneClasses = {
  badge: string;
  dot: string;
};

const TONES = {
  neutral: {
    badge: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  info: {
    badge: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  success: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warning: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
    dot: "bg-red-500",
  },
  violet: {
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
    dot: "bg-violet-500",
  },
} as const satisfies Record<string, ToneClasses>;

type ToneKey = keyof typeof TONES;

export const POLICY_STATUS_TONE: Record<PolicyStatus, ToneKey> = {
  draft: "neutral",
  active: "success",
  expired: "warning",
  cancelled: "danger",
};

export const CLAIM_STATUS_TONE: Record<ClaimStatus, ToneKey> = {
  submitted: "info",
  under_review: "warning",
  approved: "success",
  rejected: "danger",
  paid_out: "violet",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, ToneKey> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "violet",
  cancelled: "neutral",
};

export const DOCUMENT_STATUS_TONE: Record<DocumentStatus, ToneKey> = {
  not_uploaded: "neutral",
  uploaded: "info",
  under_review: "warning",
  approved: "success",
  rejected: "danger",
};

export function toneClasses(tone: ToneKey): ToneClasses {
  return TONES[tone];
}

export type { ToneKey };
