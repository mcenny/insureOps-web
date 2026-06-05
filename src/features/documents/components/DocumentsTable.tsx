"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, FileIcon, XIcon } from "lucide-react";
import { DataTable, type TableFilter } from "@/components/tables/DataTable";
import { useTableQuery } from "@/components/tables/use-table-query";
import { useDocuments } from "@/features/documents/api";
import { DocumentStatusBadge } from "@/components/status/DocumentStatusBadge";
import { ReviewDocumentDialog } from "./ReviewDocumentDialog";
import { Can } from "@/components/auth/Can";
import { Button } from "@/components/ui/button";
import { DOCUMENT_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatRelative, titleCase } from "@/lib/format";
import type { DocumentRecord } from "@/types";

const SORTABLE = {
  customerName: true,
  type: true,
  status: true,
};

const FILTERS: TableFilter[] = [
  {
    type: "select",
    key: "status",
    label: "Statuses",
    options: Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    type: "select",
    key: "type",
    label: "Types",
    options: [
      { value: "identity", label: "Identity" },
      { value: "proof_of_address", label: "Proof of address" },
      { value: "vehicle_document", label: "Vehicle document" },
      { value: "claim_evidence", label: "Claim evidence" },
    ],
  },
];

const FILTER_DEFS = FILTERS.map((f) => ({ key: f.key }));

function canReview(status: DocumentRecord["status"]) {
  return status === "uploaded" || status === "under_review";
}

export function DocumentsTable() {
  const { query } = useTableQuery({ filters: FILTER_DEFS });
  const { data, isLoading, isFetching, isError, refetch } = useDocuments(query);

  const columns = useMemo<ColumnDef<DocumentRecord>[]>(
    () => [
      {
        id: "type",
        header: "Document",
        cell: ({ row }) => (
          <div className="flex items-start gap-2">
            <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border bg-muted/50">
              <FileIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{titleCase(row.original.type)}</span>
              <span className="text-xs text-muted-foreground">Preview placeholder</span>
            </div>
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
        cell: ({ row }) => <DocumentStatusBadge status={row.original.status} />,
      },
      {
        id: "uploadedAt",
        header: "Uploaded",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.uploadedAt ? formatRelative(row.original.uploadedAt) : "—"}
          </span>
        ),
      },
      {
        id: "reviewedAt",
        header: "Reviewed",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.reviewedAt ? formatDate(row.original.reviewedAt) : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          if (!canReview(row.original.status)) return null;
          return (
            <Can action="document:review">
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <ReviewDocumentDialog
                  documentId={row.original.id}
                  decision="approve"
                  trigger={
                    <Button size="sm" variant="outline" className="gap-1" data-testid="document-approve">
                      <CheckIcon className="size-3.5" />
                      Approve
                    </Button>
                  }
                />
                <ReviewDocumentDialog
                  documentId={row.original.id}
                  decision="reject"
                  trigger={
                    <Button size="sm" variant="ghost" className="gap-1 text-destructive" data-testid="document-reject">
                      <XIcon className="size-3.5" />
                      Reject
                    </Button>
                  }
                />
              </div>
            </Can>
          );
        },
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
      searchPlaceholder="Search customer or document type"
      emptyTitle="No documents found"
      emptyDescription="Try a different search or clear the filters."
      skeletonColumns={6}
    />
  );
}
