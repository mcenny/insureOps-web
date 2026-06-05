import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { listQueryToParams } from "@/lib/api/list-query";
import type {
  Claim,
  Customer,
  DocumentRecord,
  ListQuery,
  Paginated,
  Payment,
  Policy,
} from "@/types";

export type CustomerListResponse = Paginated<Customer>;
export type CustomerDetailResponse = {
  customer: Customer;
  policies: Policy[];
  claims: Claim[];
  payments: Payment[];
  documents: DocumentRecord[];
};

export const customersKey = {
  all: ["customers"] as const,
  list: (query: ListQuery) => ["customers", "list", query] as const,
  detail: (id: string) => ["customers", "detail", id] as const,
};

export function useCustomers(query: ListQuery) {
  return useQuery({
    queryKey: customersKey.list(query),
    queryFn: () =>
      apiClient.get<CustomerListResponse>("/api/customers", { query: listQueryToParams(query) }),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customersKey.detail(id ?? ""),
    queryFn: () => apiClient.get<CustomerDetailResponse>(`/api/customers/${id}`),
    enabled: !!id,
  });
}
