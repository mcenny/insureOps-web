"use client";

import Link from "next/link";
import { ArrowLeftIcon, MailIcon, PhoneIcon, CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { PolicyStatusBadge } from "@/components/status/PolicyStatusBadge";
import { ClaimStatusBadge } from "@/components/status/ClaimStatusBadge";
import { PaymentStatusBadge } from "@/components/status/PaymentStatusBadge";
import { DocumentStatusBadge } from "@/components/status/DocumentStatusBadge";
import { useCustomer } from "@/features/customers/api";
import { formatCurrency, formatDate, formatRelative, titleCase } from "@/lib/format";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CustomerProfile({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useCustomer(id);

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (isLoading || !data) {
    return <CustomerProfileSkeleton />;
  }

  const { customer, policies, claims, payments, documents } = data;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground">
        <Link href="/customers">
          <ArrowLeftIcon className="size-4" />
          Back to customers
        </Link>
      </Button>

      <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <Avatar className="size-14">
          <AvatarFallback className="text-base">{initialsOf(customer.fullName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{customer.fullName}</h1>
            <CustomerStatusBadge status={customer.status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MailIcon className="size-3.5" />
              {customer.email}
            </span>
            <span className="flex items-center gap-1">
              <PhoneIcon className="size-3.5" />
              {customer.phone}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-3.5" />
              Joined {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Policies ({policies.length})</TabsTrigger>
          <TabsTrigger value="claims">Claims ({claims.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <Card>
            <CardContent className="pt-6">
              {policies.length === 0 ? (
                <EmptyState title="No policies" description="This customer hasn't bought a policy yet." />
              ) : (
                <ul className="divide-y">
                  {policies.map((policy) => (
                    <li key={policy.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <Link
                          href={`/policies/${policy.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {policy.policyNumber}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {titleCase(policy.type)} - {formatCurrency(policy.premiumAmount)} - expires{" "}
                          {formatDate(policy.expiryDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PolicyStatusBadge status={policy.status} />
                        <PaymentStatusBadge status={policy.paymentStatus} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardContent className="pt-6">
              {claims.length === 0 ? (
                <EmptyState title="No claims" description="No claims filed by this customer yet." />
              ) : (
                <ul className="divide-y">
                  {claims.map((claim) => (
                    <li key={claim.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <Link
                          href={`/claims/${claim.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {claim.claimNumber}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(claim.claimAmount)} - submitted{" "}
                          {formatRelative(claim.submittedAt)}
                        </p>
                      </div>
                      <ClaimStatusBadge status={claim.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="pt-6">
              {payments.length === 0 ? (
                <EmptyState title="No payments" description="No payments recorded yet." />
              ) : (
                <ul className="divide-y">
                  {payments.map((payment) => (
                    <li key={payment.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">
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
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              {documents.length === 0 ? (
                <EmptyState title="No documents" description="No documents uploaded yet." />
              ) : (
                <ul className="divide-y">
                  {documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-medium">{titleCase(doc.type)}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.uploadedAt
                            ? `Uploaded ${formatDate(doc.uploadedAt)}`
                            : "Not yet uploaded"}
                          {doc.rejectionReason ? ` - ${doc.rejectionReason}` : ""}
                        </p>
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CustomerProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="flex items-center gap-4 border-b pb-5">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
