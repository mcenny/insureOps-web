import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { listQueryToParams } from "@/lib/api/list-query";
import type { DocumentRecord, ListQuery, Paginated, User } from "@/types";
import { activityKey } from "@/features/activity/api";

export type DocumentListResponse = Paginated<DocumentRecord>;

export const documentsKey = {
  all: ["documents"] as const,
  list: (query: ListQuery) => ["documents", "list", query] as const,
  detail: (id: string) => ["documents", "detail", id] as const,
};

export function useDocuments(query: ListQuery) {
  return useQuery({
    queryKey: documentsKey.list(query),
    queryFn: () =>
      apiClient.get<DocumentListResponse>("/api/documents", { query: listQueryToParams(query) }),
    placeholderData: keepPreviousData,
  });
}

type ActorInput = Pick<User, "id" | "name" | "role">;

export function useReviewDocument(documentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      decision: "approve" | "reject";
      rejectionReason?: string;
      actor: ActorInput;
    }) => {
      return apiClient.post<{ document: DocumentRecord }>(
        `/api/documents/${documentId}/review`,
        { body: input },
      );
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: documentsKey.all });
      const snapshots = qc.getQueriesData<DocumentListResponse>({ queryKey: documentsKey.all });
      snapshots.forEach(([key, data]) => {
        if (!data) return;
        const items = data.items.map((d) =>
          d.id === documentId
            ? {
                ...d,
                status: vars.decision === "approve" ? ("approved" as const) : ("rejected" as const),
                rejectionReason: vars.decision === "reject" ? vars.rejectionReason : undefined,
              }
            : d,
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
      qc.invalidateQueries({ queryKey: documentsKey.all });
      qc.invalidateQueries({ queryKey: activityKey.all });
    },
  });
}
