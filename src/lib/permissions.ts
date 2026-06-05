import type { AdminRole } from "@/types";

export type PermissionAction =
  | "claim:view"
  | "claim:approve"
  | "claim:reject"
  | "claim:assign"
  | "claim:advance_review"
  | "claim:mark_paid_out"
  | "policy:view"
  | "policy:cancel"
  | "payment:view"
  | "payment:retry"
  | "payment:reconcile"
  | "document:view"
  | "document:review"
  | "customer:view"
  | "customer:edit"
  | "settings:manage_roles";

const MATRIX: Record<AdminRole, PermissionAction[]> = {
  super_admin: [
    "claim:view",
    "claim:approve",
    "claim:reject",
    "claim:assign",
    "claim:advance_review",
    "claim:mark_paid_out",
    "policy:view",
    "policy:cancel",
    "payment:view",
    "payment:retry",
    "payment:reconcile",
    "document:view",
    "document:review",
    "customer:view",
    "customer:edit",
    "settings:manage_roles",
  ],
  operations_manager: [
    "claim:view",
    "claim:assign",
    "claim:advance_review",
    "policy:view",
    "policy:cancel",
    "payment:view",
    "document:view",
    "document:review",
    "customer:view",
    "customer:edit",
  ],
  claims_reviewer: [
    "claim:view",
    "claim:approve",
    "claim:reject",
    "claim:advance_review",
    "policy:view",
    "payment:view",
    "document:view",
    "document:review",
    "customer:view",
  ],
  finance_admin: [
    "claim:view",
    "claim:mark_paid_out",
    "policy:view",
    "payment:view",
    "payment:retry",
    "payment:reconcile",
    "customer:view",
  ],
  support_agent: [
    "claim:view",
    "policy:view",
    "payment:view",
    "document:view",
    "customer:view",
  ],
};

export function hasPermission(role: AdminRole | undefined, action: PermissionAction): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(action) ?? false;
}

export function permissionsFor(role: AdminRole | undefined): readonly PermissionAction[] {
  if (!role) return [];
  return MATRIX[role] ?? [];
}
