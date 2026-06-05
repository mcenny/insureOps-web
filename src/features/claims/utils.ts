import type { AdminRole, ClaimStatus } from "@/types";

const TRANSITIONS: Record<ClaimStatus, ClaimStatus[]> = {
  submitted: ["under_review"],
  under_review: ["approved", "rejected"],
  approved: ["paid_out"],
  rejected: [],
  paid_out: [],
};

export function nextStatesFor(status: ClaimStatus): ClaimStatus[] {
  return TRANSITIONS[status] ?? [];
}

const ROLE_ALLOWED: Record<ClaimStatus, AdminRole[]> = {
  submitted: ["claims_reviewer", "operations_manager", "super_admin"],
  under_review: ["claims_reviewer", "super_admin"],
  approved: ["finance_admin", "super_admin"],
  rejected: [],
  paid_out: [],
};

export function canTransition(from: ClaimStatus, to: ClaimStatus, role: AdminRole): boolean {
  if (!TRANSITIONS[from]?.includes(to)) return false;
  return ROLE_ALLOWED[from]?.includes(role) ?? false;
}
