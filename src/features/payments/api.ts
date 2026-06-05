import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { listQueryToParams } from "@/lib/api/list-query";
import type { ListQuery, Paginated, Payment, User } from "@/types";
import { activityKey } from "@/features/activity/api";

export type PaymentListResponse = Paginated<Payment>;

export const paymentsKey = {
  all: ["payments"] as const,
  list: (query: ListQuery) => ["payments", "list", query] as const,
  detail: (id: string) => ["payments", "detail", id] as const,
};

export function usePayments(query: ListQuery) {
  return useQuery({
    queryKey: paymentsKey.list(query),
    queryFn: () =>
      apiClient.get<PaymentListResponse>("/api/payments", { query: listQueryToParams(query) }),
    placeholderData: keepPreviousData,
  });
}

type ActorInput = Pick<User, "id" | "name" | "role">;

export function useRetryPayment(paymentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { actor: ActorInput }) => {
      return apiClient.post<{ payment: Payment; outcome: "paid" | "failed" }>(
        `/api/payments/${paymentId}/retry`,
        { body: input },
      );
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: paymentsKey.all });
      const snapshots = qc.getQueriesData<PaymentListResponse>({ queryKey: paymentsKey.all });
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        const items = data.items.map((p) =>
          p.id === paymentId ? { ...p, status: "pending" as const } : p,
        );
        qc.setQueryData(key, { ...data, items });
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => {
        if (data) qc.setQueryData(key, data);
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: paymentsKey.all });
      qc.invalidateQueries({ queryKey: activityKey.all });
    },
  });
}
