"use client";

import Link from "next/link";
import { ArrowLeftIcon, FileTextIcon, ShieldCheckIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ClaimStatusBadge } from "@/components/status/ClaimStatusBadge";
import { useClaim } from "@/features/claims/api";
import { ClaimWorkflowActions } from "./ClaimWorkflowActions";
import { ClaimTimeline } from "./ClaimTimeline";
import { formatCurrency, formatDate, titleCase } from "@/lib/format";

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClaimDetail({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useClaim(id);

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (isLoading || !data) {
    return <ClaimDetailSkeleton />;
  }

  const { claim, policy, customer } = data;

  return (
    <div className="space-y-6" data-testid="claim-detail">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground">
        <Link href="/claims">
          <ArrowLeftIcon className="size-4" />
          Back to claims
        </Link>
      </Button>

      <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {claim.claimNumber}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {formatCurrency(claim.claimAmount)} claim
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{claim.description}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <ClaimStatusBadge status={claim.status} />
          <p className="text-xs text-muted-foreground">
            Last updated {formatDate(claim.updatedAt, "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </header>

      <ClaimWorkflowActions claim={claim} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimTimeline claim={claim} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <UserIcon className="size-4 text-muted-foreground" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Link
                href={`/customers/${claim.customerId}`}
                className="flex items-center gap-3 hover:underline"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">{initialsOf(claim.customerName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{claim.customerName}</p>
                  {customer ? (
                    <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                  ) : null}
                </div>
              </Link>
              {customer ? (
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Phone: {customer.phone}</p>
                  <p>Joined: {formatDate(customer.createdAt)}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {policy ? (
                <>
                  <Link
                    href={`/policies/${policy.id}`}
                    className="font-mono text-sm hover:underline"
                  >
                    {policy.policyNumber}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {titleCase(policy.type)} - premium {formatCurrency(policy.premiumAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cover: {formatDate(policy.startDate)} to {formatDate(policy.expiryDate)}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Policy not found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileTextIcon className="size-4 text-muted-foreground" />
                Reviewer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {claim.assignedToName ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {initialsOf(claim.assignedToName)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{claim.assignedToName}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Awaiting assignment.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ClaimDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3 border-b pb-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-3/4 max-w-md" />
      </div>
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-lg lg:col-span-2" />
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
