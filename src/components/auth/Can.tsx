"use client";

import type { ReactNode } from "react";
import { useCan } from "@/hooks/use-can";
import type { PermissionAction } from "@/lib/permissions";

type CanProps = {
  action: PermissionAction;
  fallback?: ReactNode;
  children: ReactNode;
};

export function Can({ action, fallback = null, children }: CanProps) {
  const allowed = useCan(action);
  return <>{allowed ? children : fallback}</>;
}
