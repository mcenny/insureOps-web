import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { User } from "@/types";

export type AuthMeResponse = { user: User };

export const authMeKey = (userId: string) => ["auth", "me", userId] as const;

export function useAuthMe(userId: string | undefined) {
  return useQuery({
    queryKey: authMeKey(userId ?? ""),
    queryFn: () =>
      apiClient.get<AuthMeResponse>("/api/auth/me", { query: { userId: userId! } }),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}

export type ReviewersResponse = { items: User[] };

export const reviewersKey = {
  all: ["reviewers"] as const,
};

export function useReviewers() {
  return useQuery({
    queryKey: reviewersKey.all,
    queryFn: () => apiClient.get<ReviewersResponse>("/api/reviewers"),
    staleTime: 5 * 60_000,
  });
}
