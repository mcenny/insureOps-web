"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangleIcon } from "lucide-react";
import { DataTable, type TableFilter } from "@/components/tables/DataTable";
import { useTableQuery } from "@/components/tables/use-table-query";
import { usePayments } from "@/features/payments/api";
import { PaymentStatusBadge } from "@/components/status/PaymentStatusBadge";
import { RetryPaymentAction } from "./RetryPaymentAction";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate, formatRelative, titleCase } from "@/lib/format";
import type { Payment } from "@/types";

const SORTABLE = {
  reference: true,
  customerName: true,
  amount: true,
  updatedAt: true,
};

const FILTERS: TableFilter[] = [
  {
    type: "select",
    key: "status",
    label: "Statuses",
    options: Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    type: "select",
    key: "method",
    label: "Method",
    options: [
      { value: "card", label: "Card" },
      { value: "bank_transfer", label: "Bank transfer" },
      { value: "wallet", label: "Wallet" },
    ],
  },
];

const FILTER_DEFS = FILTERS.map((f) => ({ key: f.key }));

export function PaymentsTable() {
  const { query } = useTableQuery({ filters: FILTER_DEFS });
  const { data, isLoading, isFetching, isError, refetch } = usePayments(query);

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium">{row.original.reference}</span>
            <Link
              href={`/policies/${row.original.policyId}`}
              className="text-xs text-muted-foreground hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.original.policyNumber}
            </Link>
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
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <PaymentStatusBadge status={row.original.status} />
            {row.original.status === "failed" ? (
              <AlertTriangleIcon className="size-3.5 text-destructive" aria-label="Failed payment" />
            ) : null}
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{formatCurrency(row.original.amount)}</span>
        ),
      },
      {
        id: "method",
        header: "Method",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{titleCase(row.original.method)}</span>
        ),
      },
      {
        id: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground" title={formatDate(row.original.updatedAt)}>
            {formatRelative(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <RetryPaymentAction payment={row.original} />,
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
      searchPlaceholder="Search reference, policy, or customer"
      emptyTitle="No payments found"
      emptyDescription="Try a different search or clear the filters."
      skeletonColumns={7}
    />
  );
}
