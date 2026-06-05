import type { ListQuery } from "@/types";

export function listQueryToParams(query: ListQuery) {
  const params: Record<string, string | string[] | number | undefined> = {
    search: query.search || undefined,
    page: query.page,
    pageSize: query.pageSize,
    sortBy: query.sortBy,
    sortDir: query.sortDir,
  };
  if (query.filters) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (value === undefined) continue;
      params[key] = value;
    }
  }
  return params;
}
