import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ClaimStatus } from "@/types";

export type OverviewResponse = {
  metrics: {
    activePolicies: number;
    pendingClaims: number;
    failedPayments: number;
    incompleteDocuments: number;
    expiringSoon: number;
    totalCustomers: number;
  };
  claimsByStatus: Record<ClaimStatus, number>;
};

export const overviewKey = {
  all: ["overview"] as const,
};

export function useOverview() {
  return useQuery({
    queryKey: overviewKey.all,
    queryFn: () => apiClient.get<OverviewResponse>("/api/overview"),
  });
}
