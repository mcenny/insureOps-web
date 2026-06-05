import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { listQueryToParams } from "@/lib/api/list-query";
import type { Claim, ListQuery, Paginated, Payment, Policy } from "@/types";

export type PolicyListResponse = Paginated<Policy>;
export type PolicyDetailResponse = {
  policy: Policy;
  claims: Claim[];
  payments: Payment[];
};

export const policiesKey = {
  all: ["policies"] as const,
  list: (query: ListQuery) => ["policies", "list", query] as const,
  detail: (id: string) => ["policies", "detail", id] as const,
};

export function usePolicies(query: ListQuery) {
  return useQuery({
    queryKey: policiesKey.list(query),
    queryFn: () =>
      apiClient.get<PolicyListResponse>("/api/policies", { query: listQueryToParams(query) }),
    placeholderData: keepPreviousData,
  });
}

export function usePolicy(id: string | undefined) {
  return useQuery({
    queryKey: policiesKey.detail(id ?? ""),
    queryFn: () => apiClient.get<PolicyDetailResponse>(`/api/policies/${id}`),
    enabled: !!id,
  });
}
