import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Activity } from "@/types";

export type ActivityListResponse = { items: Activity[]; total: number };

export const activityKey = {
  all: ["activity"] as const,
  list: (limit: number) => ["activity", "list", limit] as const,
};

export function useActivity(limit = 40) {
  return useQuery({
    queryKey: activityKey.list(limit),
    queryFn: () =>
      apiClient.get<ActivityListResponse>("/api/activity", { query: { limit } }),
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });
}
