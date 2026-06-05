"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_SIZE_DEFAULT } from "@/lib/constants";
import type { ListQuery } from "@/types";

export type TableFilterDef = {
  key: string;
  multiple?: boolean;
};

export type UseTableQueryOptions = {
  filters?: TableFilterDef[];
  defaultPageSize?: number;
};

export function useTableQuery(options: UseTableQueryOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultPageSize = options.defaultPageSize ?? PAGE_SIZE_DEFAULT;
  const filterDefs = options.filters ?? [];

  const query: ListQuery = useMemo(() => {
    const filterValues: Record<string, string | string[] | undefined> = {};
    for (const f of filterDefs) {
      const values = searchParams.getAll(f.key).filter(Boolean);
      if (values.length === 0) continue;
      filterValues[f.key] = f.multiple ? values : values[0];
    }
    return {
      search: searchParams.get("search") ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      pageSize: searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : defaultPageSize,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortDir: (searchParams.get("sortDir") as "asc" | "desc" | null) ?? undefined,
      filters: Object.keys(filterValues).length ? filterValues : undefined,
    };
  }, [searchParams, filterDefs, defaultPageSize]);

  const apply = useCallback(
    (patch: Partial<ListQuery>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (patch.search !== undefined) {
        if (patch.search) params.set("search", patch.search);
        else params.delete("search");
        params.delete("page");
      }
      if (patch.page !== undefined) {
        if (patch.page && patch.page > 1) params.set("page", String(patch.page));
        else params.delete("page");
      }
      if (patch.pageSize !== undefined) {
        params.set("pageSize", String(patch.pageSize));
        params.delete("page");
      }
      if ("sortBy" in patch) {
        if (patch.sortBy) {
          params.set("sortBy", patch.sortBy);
          params.set("sortDir", patch.sortDir ?? "asc");
        } else {
          params.delete("sortBy");
          params.delete("sortDir");
        }
      } else if ("sortDir" in patch) {
        if (patch.sortDir) params.set("sortDir", patch.sortDir);
        else params.delete("sortDir");
      }
      if (patch.filters !== undefined) {
        for (const f of filterDefs) {
          params.delete(f.key);
          const value = patch.filters[f.key];
          if (value === undefined || value === "") continue;
          const list = Array.isArray(value) ? value : [value];
          list.forEach((v) => params.append(f.key, String(v)));
        }
        params.delete("page");
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, filterDefs],
  );

  const setSearch = useCallback((value: string) => apply({ search: value }), [apply]);
  const setPage = useCallback((page: number) => apply({ page }), [apply]);
  const setFilter = useCallback(
    (key: string, value: string | string[] | undefined) => {
      apply({ filters: { ...(query.filters ?? {}), [key]: value } });
    },
    [apply, query.filters],
  );
  const toggleSort = useCallback(
    (column: string) => {
      if (query.sortBy !== column) return apply({ sortBy: column, sortDir: "asc" });
      if (query.sortDir === "asc") return apply({ sortBy: column, sortDir: "desc" });
      return apply({ sortBy: undefined, sortDir: undefined });
    },
    [apply, query.sortBy, query.sortDir],
  );
  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    query,
    setSearch,
    setPage,
    setFilter,
    toggleSort,
    apply,
    reset,
  };
}
