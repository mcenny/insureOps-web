import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { listQueryToParams } from "@/lib/api/list-query";
import type { Claim, ClaimStatus, Customer, ListQuery, Paginated, Policy, User } from "@/types";
import { activityKey } from "@/features/activity/api";

export type ClaimListResponse = Paginated<Claim>;
export type ClaimDetailResponse = {
  claim: Claim;
  policy?: Policy;
  customer?: Customer;
};

export const claimsKey = {
  all: ["claims"] as const,
  list: (query: ListQuery) => ["claims", "list", query] as const,
  detail: (id: string) => ["claims", "detail", id] as const,
};

export function useClaims(query: ListQuery) {
  return useQuery({
    queryKey: claimsKey.list(query),
    queryFn: () =>
      apiClient.get<ClaimListResponse>("/api/claims", { query: listQueryToParams(query) }),
    placeholderData: keepPreviousData,
  });
}

export function useClaim(id: string | undefined) {
  return useQuery({
    queryKey: claimsKey.detail(id ?? ""),
    queryFn: () => apiClient.get<ClaimDetailResponse>(`/api/claims/${id}`),
    enabled: !!id,
  });
}

type ActorInput = Pick<User, "id" | "name" | "role">;

export function useTransitionClaim(claimId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { to: ClaimStatus; note?: string; actor: ActorInput }) => {
      return apiClient.post<{ claim: Claim }>(`/api/claims/${claimId}/transition`, {
        body: input,
      });
    },
    onMutate: async ({ to }) => {
      await qc.cancelQueries({ queryKey: claimsKey.detail(claimId) });
      const previous = qc.getQueryData<ClaimDetailResponse>(claimsKey.detail(claimId));
      if (previous?.claim) {
        qc.setQueryData<ClaimDetailResponse>(claimsKey.detail(claimId), {
          ...previous,
          claim: { ...previous.claim, status: to, updatedAt: new Date().toISOString() },
        });
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(claimsKey.detail(claimId), ctx.previous);
      }
    },
    onSuccess: ({ claim }) => {
      qc.setQueryData<ClaimDetailResponse>(claimsKey.detail(claimId), (prev) =>
        prev ? { ...prev, claim } : prev,
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: claimsKey.all });
      qc.invalidateQueries({ queryKey: activityKey.all });
    },
  });
}

export function useAssignClaim(claimId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { reviewerId: string; actor: ActorInput }) => {
      return apiClient.post<{ claim: Claim }>(`/api/claims/${claimId}/assign`, { body: input });
    },
    onSuccess: ({ claim }) => {
      qc.setQueryData<ClaimDetailResponse>(claimsKey.detail(claimId), (prev) =>
        prev ? { ...prev, claim } : prev,
      );
      qc.invalidateQueries({ queryKey: claimsKey.all });
      qc.invalidateQueries({ queryKey: activityKey.all });
    },
  });
}
