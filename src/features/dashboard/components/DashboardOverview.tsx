"use client";

import {
  ShieldCheckIcon,
  FileWarningIcon,
  CreditCardIcon,
  FilesIcon,
  ClockIcon,
  UsersIcon,
} from "lucide-react";
import { useOverview } from "@/features/dashboard/api";
import { useCurrentUser } from "@/hooks/use-can";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { StatCardSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { CLAIM_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const FUNNEL_COLORS = [
  "bg-chart-1/15 text-chart-1 border-chart-1/20",
  "bg-chart-2/20 text-amber-800 border-amber-300/40 dark:text-amber-300",
  "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-300",
  "bg-red-500/12 text-red-700 border-red-500/20 dark:text-red-300",
  "bg-violet-500/12 text-violet-700 border-violet-500/20 dark:text-violet-300",
];

export function DashboardOverview() {
  const user = useCurrentUser();
  const overview = useOverview();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <header className="card-surface relative overflow-hidden p-6 sm:p-8">
        <div className="pattern-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative space-y-2">
          <p className="text-sm font-medium text-primary">Good morning, {firstName}</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Operations overview</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Live snapshot of pending work, payment health, and recent activity across your portfolio.
          </p>
        </div>
      </header>

      {overview.isError ? (
        <ErrorState onRetry={() => void overview.refetch()} />
      ) : overview.isLoading || !overview.data ? (
        <StatCardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            featured
            label="Active policies"
            value={overview.data.metrics.activePolicies.toLocaleString()}
            helper="Currently in force across all coverage types"
            icon={ShieldCheckIcon}
            tone="success"
            href="/policies?status=active"
          />
          <StatCard
            label="Pending claims"
            value={overview.data.metrics.pendingClaims.toLocaleString()}
            helper="Submitted or under review — waiting on a reviewer"
            icon={FileWarningIcon}
            tone="warning"
            href="/claims?status=submitted&status=under_review"
          />
          <StatCard
            label="Failed payments"
            value={overview.data.metrics.failedPayments.toLocaleString()}
            helper="Retry or reconcile to keep premium collection on track"
            icon={CreditCardIcon}
            tone="danger"
            href="/payments?status=failed"
          />
          <StatCard
            label="Incomplete documents"
            value={overview.data.metrics.incompleteDocuments.toLocaleString()}
            helper="KYC and supporting docs awaiting review or upload"
            icon={FilesIcon}
            tone="warning"
            href="/documents?status=under_review"
          />
          <StatCard
            label="Expiring within 30 days"
            value={overview.data.metrics.expiringSoon.toLocaleString()}
            helper="Renewal reminders to send out"
            icon={ClockIcon}
            tone="warning"
            href="/policies?status=active"
          />
          <StatCard
            label="Customers on file"
            value={overview.data.metrics.totalCustomers.toLocaleString()}
            helper="Across active, inactive, and flagged accounts"
            icon={UsersIcon}
            href="/customers"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card-surface lg:col-span-2">
          <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold">Claims funnel</h2>
              <p className="text-xs text-muted-foreground">
                Breakdown by status across all submitted claims.
              </p>
            </div>
          </header>
          {overview.isLoading || !overview.data ? (
            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded-lg bg-muted" />
                  <div className="h-8 w-12 animate-pulse rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-5">
              {Object.entries(overview.data.claimsByStatus).map(([status, count], index) => (
                <div
                  key={status}
                  className={cn(
                    "rounded-xl border px-4 py-3",
                    FUNNEL_COLORS[index % FUNNEL_COLORS.length],
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
                    {CLAIM_STATUS_LABELS[status as keyof typeof CLAIM_STATUS_LABELS]}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">{count}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card-surface flex flex-col">
          <header className="border-b border-border/60 px-5 py-4">
            <h2 className="text-base font-semibold">Recent activity</h2>
            <p className="text-xs text-muted-foreground">Latest operational events.</p>
          </header>
          <div className="flex-1 px-4 pb-4 pt-2">
            <ActivityFeed limit={12} compact />
          </div>
        </section>
      </div>
    </div>
  );
}
