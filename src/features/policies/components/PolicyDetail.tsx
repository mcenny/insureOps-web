"use client";

import Link from "next/link";
import { ArrowLeftIcon, FileWarningIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PolicyStatusBadge } from "@/components/status/PolicyStatusBadge";
import { PaymentStatusBadge } from "@/components/status/PaymentStatusBadge";
import { ClaimStatusBadge } from "@/components/status/ClaimStatusBadge";
import { usePolicy } from "@/features/policies/api";
import { formatCurrency, formatDate, titleCase } from "@/lib/format";

export function PolicyDetail({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = usePolicy(id);

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (isLoading || !data) {
    return <PolicyDetailSkeleton />;
  }

  const { policy, claims, payments } = data;

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground">
          <Link href="/policies">
            <ArrowLeftIcon className="size-4" />
            Back to policies
          </Link>
        </Button>
      </div>

      <header className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {policy.policyNumber}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">{titleCase(policy.type)} cover</h1>
          <p className="text-sm text-muted-foreground">
            Held by{" "}
            <Link
              href={`/customers/${policy.customerId}`}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {policy.customerName}
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PolicyStatusBadge status={policy.status} />
          <PaymentStatusBadge status={policy.paymentStatus} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KeyValue label="Premium" value={formatCurrency(policy.premiumAmount)} />
        <KeyValue label="Start date" value={formatDate(policy.startDate)} />
        <KeyValue label="Expires" value={formatDate(policy.expiryDate)} />
        <KeyValue label="Created" value={formatDate(policy.createdAt)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileWarningIcon className="size-4 text-muted-foreground" />
              Linked claims ({claims.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <EmptyState
                icon={FileWarningIcon}
                title="No claims yet"
                description="Claims filed against this policy will appear here."
              />
            ) : (
              <ul className="divide-y">
                {claims.map((claim) => (
                  <li key={claim.id} className="flex items-center justify-between py-3 text-sm">
                    <Link
                      href={`/claims/${claim.id}`}
                      className="flex flex-col gap-0.5 hover:underline"
                    >
                      <span className="font-medium">{claim.claimNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(claim.claimAmount)} - {formatDate(claim.submittedAt)}
                      </span>
                    </Link>
                    <ClaimStatusBadge status={claim.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CreditCardIcon className="size-4 text-muted-foreground" />
              Payment history ({payments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <EmptyState
                icon={CreditCardIcon}
                title="No payments yet"
                description="Premium payments against this policy will appear here."
              />
            ) : (
              <ul className="divide-y">
                {payments.map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {payment.reference}
                      </p>
                      <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.createdAt)} - {titleCase(payment.method)}
                      </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldCheckIcon className="size-4 text-muted-foreground" />
            Coverage summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          This is fictional demo data. {titleCase(policy.type)} policies in {`InsureOps`} cover a
          generic scope of risks and are used to demonstrate workflow-aware UI patterns. Replace this
          block with a real coverage breakdown when the backend exposes it.
        </CardContent>
      </Card>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function PolicyDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="flex items-start justify-between border-b pb-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </div>
  );
}
