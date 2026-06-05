"use client";

import { useUserStore } from "@/store/user-store";
import { hasPermission, type PermissionAction } from "@/lib/permissions";

export function useCan(action: PermissionAction): boolean {
  const role = useUserStore((s) => s.user?.role);
  return hasPermission(role, action);
}

export function useCurrentUser() {
  return useUserStore((s) => s.user);
}
