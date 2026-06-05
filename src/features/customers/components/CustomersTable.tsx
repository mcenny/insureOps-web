"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { DataTable, type TableFilter } from "@/components/tables/DataTable";
import { useTableQuery } from "@/components/tables/use-table-query";
import { useCustomers } from "@/features/customers/api";
import { CustomerStatusBadge } from "@/features/customers/components/CustomerStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import type { Customer } from "@/types";

const FILTERS: TableFilter[] = [
  {
    type: "select",
    key: "status",
    label: "Statuses",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "flagged", label: "Flagged" },
    ],
  },
];

const FILTER_DEFS = FILTERS.map((f) => ({ key: f.key }));

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CustomersTable() {
  const router = useRouter();
  const { query } = useTableQuery({ filters: FILTER_DEFS });
  const { data, isLoading, isFetching, isError, refetch } = useCustomers(query);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: "fullName",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">{initialsOf(row.original.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link
                href={`/customers/${row.original.id}`}
                className="block truncate text-sm font-medium hover:underline"
              >
                {row.original.fullName}
              </Link>
              <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">{row.original.phone}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
      },
      {
        id: "createdAt",
        header: "Joined",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/customers/${row.original.id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            Profile
            <ExternalLinkIcon className="size-3" />
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onRetry={() => void refetch()}
      sortable={{ fullName: true, createdAt: true, status: true }}
      filters={FILTERS}
      searchPlaceholder="Search name, email, or phone"
      emptyTitle="No customers found"
      onRowClick={(c) => router.push(`/customers/${c.id}`)}
      skeletonColumns={5}
    />
  );
}
