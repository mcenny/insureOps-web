"use client";

import { useMemo, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon, XIcon } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { TableSkeleton } from "@/components/feedback/LoadingSkeleton";
import { useTableQuery, type TableFilterDef } from "./use-table-query";
import { cn } from "@/lib/utils";
import type { ListQuery, Paginated } from "@/types";

export type TableSelectFilter = {
  type: "select";
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export type TableFilter = TableSelectFilter;

export type SortableMap = Record<string, boolean | undefined>;

type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: Paginated<T> | undefined;
  isLoading: boolean;
  isFetching?: boolean;
  isError: boolean;
  onRetry?: () => void;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  sortable?: SortableMap;
  defaultPageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  toolbarExtra?: ReactNode;
  density?: "comfortable" | "compact";
  skeletonColumns?: number;
  initialQuery?: ListQuery;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isFetching,
  isError,
  onRetry,
  searchPlaceholder = "Search",
  filters = [],
  sortable = {},
  defaultPageSize,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your filters or search.",
  onRowClick,
  toolbarExtra,
  density = "comfortable",
  skeletonColumns,
  initialQuery: _initialQuery,
}: DataTableProps<T>) {
  const filterDefs: TableFilterDef[] = useMemo(
    () => filters.map((f) => ({ key: f.key })),
    [filters],
  );

  const { query, setSearch, setFilter, setPage, toggleSort, apply, reset } = useTableQuery({
    filters: filterDefs,
    defaultPageSize,
  });

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: data ? Math.max(1, Math.ceil(data.total / (data.pageSize || 1))) : 1,
    state: {
      pagination: {
        pageIndex: (query.page ?? 1) - 1,
        pageSize: query.pageSize ?? defaultPageSize ?? 20,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const currentPage = query.page ?? 1;
  const hasActiveFilters =
    !!query.search ||
    !!(query.filters && Object.values(query.filters).some((v) => v !== undefined && v !== "" && (!Array.isArray(v) || v.length > 0))) ||
    !!query.sortBy;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query.search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="rounded-xl border-border/80 bg-card pl-8 shadow-sm"
            />
          </div>
          {filters.map((filter) => {
            const current = query.filters?.[filter.key];
            const value = Array.isArray(current) ? current[0] : current;
            return (
              <Select
                key={filter.key}
                value={value ?? "__all__"}
                onValueChange={(v) => setFilter(filter.key, v === "__all__" ? undefined : v)}
              >
                <SelectTrigger
                  size="sm"
                  className="min-w-[140px]"
                  data-testid={`table-filter-${filter.key}`}
                >
                  <SelectValue placeholder={filter.placeholder ?? filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All {filter.label.toLowerCase()}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
              <XIcon className="size-3.5" />
              Clear
            </Button>
          ) : null}
        </div>
        {toolbarExtra ? <div className="flex items-center gap-2">{toolbarExtra}</div> : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
        {isError ? (
          <div className="p-6">
            <ErrorState onRetry={onRetry} />
          </div>
        ) : isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} columns={skeletonColumns ?? columns.length} />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-6">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <div className={cn("relative", isFetching ? "opacity-90" : null)}>
            <Table>
              <TableHeader className="bg-muted/40 [&_tr]:border-border/60">
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((header) => {
                      const colId = header.column.id;
                      const isSortable = !!sortable[colId];
                      const isSorted = query.sortBy === colId;
                      const Arrow =
                        isSorted && query.sortDir === "asc"
                          ? ArrowUpIcon
                          : isSorted && query.sortDir === "desc"
                            ? ArrowDownIcon
                            : ChevronsUpDownIcon;
                      return (
                        <TableHead key={header.id} className="text-xs">
                          {header.isPlaceholder ? null : isSortable ? (
                            <button
                              type="button"
                              onClick={() => toggleSort(colId)}
                              className={cn(
                                "inline-flex items-center gap-1 rounded px-1 py-0.5 -ml-1 text-xs font-medium uppercase tracking-wide hover:text-foreground",
                                isSorted ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <Arrow className="size-3" />
                            </button>
                          ) : (
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      onRowClick
                        ? "cursor-pointer transition-colors hover:bg-muted/40"
                        : null,
                    )}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(density === "compact" ? "py-2" : "py-3")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {data ? (
        <div className="flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span>
              {data.total === 0
                ? "0 results"
                : `Showing ${(currentPage - 1) * data.pageSize + 1}-${Math.min(
                    currentPage * data.pageSize,
                    data.total,
                  )} of ${data.total}`}
            </span>
            <Select
              value={String(data.pageSize)}
              onValueChange={(v) => apply({ pageSize: Number(v) })}
            >
              <SelectTrigger size="sm" className="h-7 min-w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeftIcon className="size-4" />
              Prev
            </Button>
            <span className="text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
