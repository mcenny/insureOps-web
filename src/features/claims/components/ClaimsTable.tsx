"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { DataTable, type TableFilter } from "@/components/tables/DataTable";
import { useTableQuery } from "@/components/tables/use-table-query";
import { useClaims } from "@/features/claims/api";
import { ClaimStatusBadge } from "@/components/status/ClaimStatusBadge";
import { CLAIM_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate, formatRelative } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Claim } from "@/types";

const SORTABLE = {
  claimNumber: true,
  customerName: true,
  claimAmount: true,
  submittedAt: true,
  updatedAt: true,
};

const FILTERS: TableFilter[] = [
  {
    type: "select",
    key: "status",
    label: "Statuses",
    options: Object.entries(CLAIM_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    type: "select",
    key: "assignedTo",
    label: "Assignment",
    options: [
      { value: "unassigned", label: "Unassigned" },
      { value: "user_daniel", label: "Daniel Okafor" },
      { value: "user_amina", label: "Amina Yusuf" },
      { value: "user_philemon", label: "Philemon Eniola" },
    ],
  },
];

const FILTER_DEFS = FILTERS.map((f) => ({ key: f.key }));

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClaimsTable() {
  const router = useRouter();
  const { query } = useTableQuery({ filters: FILTER_DEFS });
  const { data, isLoading, isFetching, isError, refetch } = useClaims(query);

  const columns = useMemo<ColumnDef<Claim>[]>(
    () => [
      {
        id: "claimNumber",
        header: "Claim",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Link
              href={`/claims/${row.original.id}`}
              className="text-sm font-medium hover:underline"
              data-testid={`claim-link-${row.original.claimNumber}`}
            >
              {row.original.claimNumber}
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              {row.original.policyNumber}
            </span>
          </div>
        ),
      },
      {
        id: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <Link
            href={`/customers/${row.original.customerId}`}
            className="text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.customerName}
          </Link>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <ClaimStatusBadge status={row.original.status} />,
      },
      {
        id: "claimAmount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{formatCurrency(row.original.claimAmount)}</span>
        ),
      },
      {
        id: "assignedTo",
        header: "Reviewer",
        cell: ({ row }) =>
          row.original.assignedToName ? (
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">
                  {initialsOf(row.original.assignedToName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{row.original.assignedToName}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          ),
      },
      {
        id: "submittedAt",
        header: "Submitted",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground" title={formatDate(row.original.submittedAt)}>
            {formatRelative(row.original.submittedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/claims/${row.original.id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            Open
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
      sortable={SORTABLE}
      filters={FILTERS}
      searchPlaceholder="Search claim, customer, or policy"
      emptyTitle="No claims found"
      emptyDescription="Adjust filters or wait for new submissions."
      onRowClick={(c) => router.push(`/claims/${c.id}`)}
      skeletonColumns={7}
    />
  );
}
