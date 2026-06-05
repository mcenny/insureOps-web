"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { DataTable, type TableFilter } from "@/components/tables/DataTable";
import { useTableQuery } from "@/components/tables/use-table-query";
import { usePolicies } from "@/features/policies/api";
import { PolicyStatusBadge } from "@/components/status/PolicyStatusBadge";
import { PaymentStatusBadge } from "@/components/status/PaymentStatusBadge";
import {
  POLICY_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import { formatCurrency, formatDate, titleCase } from "@/lib/format";
import type { Policy } from "@/types";

const SORTABLE = {
  policyNumber: true,
  customerName: true,
  premiumAmount: true,
  expiryDate: true,
};

const FILTERS: TableFilter[] = [
  {
    type: "select",
    key: "status",
    label: "Statuses",
    options: Object.entries(POLICY_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    type: "select",
    key: "type",
    label: "Types",
    options: [
      { value: "motor", label: "Motor" },
      { value: "travel", label: "Travel" },
      { value: "home", label: "Home" },
      { value: "health", label: "Health" },
    ],
  },
  {
    type: "select",
    key: "paymentStatus",
    label: "Payment",
    options: Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
];

const FILTER_DEFS = FILTERS.map((f) => ({ key: f.key }));

export function PoliciesTable() {
  const router = useRouter();
  const { query } = useTableQuery({ filters: FILTER_DEFS });
  const { data, isLoading, isFetching, isError, refetch } = usePolicies(query);

  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        id: "policyNumber",
        header: "Policy",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Link
              href={`/policies/${row.original.id}`}
              className="text-sm font-medium hover:underline"
            >
              {row.original.policyNumber}
            </Link>
            <span className="text-xs text-muted-foreground">{titleCase(row.original.type)}</span>
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
        cell: ({ row }) => <PolicyStatusBadge status={row.original.status} />,
      },
      {
        id: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
      },
      {
        id: "premiumAmount",
        header: "Premium",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{formatCurrency(row.original.premiumAmount)}</span>
        ),
      },
      {
        id: "expiryDate",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.expiryDate)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/policies/${row.original.id}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            View
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
      searchPlaceholder="Search policy number or customer"
      emptyTitle="No policies found"
      emptyDescription="Try a different search or clear the filters."
      onRowClick={(p) => router.push(`/policies/${p.id}`)}
      skeletonColumns={7}
    />
  );
}
