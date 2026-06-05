"use client";

import {
  ActivityIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileCheck2Icon,
  FileXIcon,
  GavelIcon,
  ShieldCheckIcon,
  UserPlus2Icon,
  XCircleIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useActivity } from "@/features/activity/api";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/format";
import type { Activity, ActivityKind } from "@/types";

const ICONS: Record<ActivityKind, LucideIcon> = {
  "claim.submitted": GavelIcon,
  "claim.assigned": UserPlus2Icon,
  "claim.transitioned": CheckCircle2Icon,
  "policy.activated": ShieldCheckIcon,
  "policy.cancelled": XCircleIcon,
  "payment.failed": CreditCardIcon,
  "payment.retried": CreditCardIcon,
  "payment.succeeded": CheckCircle2Icon,
  "document.approved": FileCheck2Icon,
  "document.rejected": FileXIcon,
  "customer.updated": UserPlus2Icon,
  "renewal.reminder": ActivityIcon,
};

const TONES: Record<ActivityKind, string> = {
  "claim.submitted": "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  "claim.assigned": "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  "claim.transitioned": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "policy.activated": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "policy.cancelled": "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  "payment.failed": "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  "payment.retried": "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  "payment.succeeded": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "document.approved": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "document.rejected": "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  "customer.updated": "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  "renewal.reminder": "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
};

type ActivityFeedProps = {
  limit?: number;
  compact?: boolean;
};

function ActivityItem({ item, compact }: { item: Activity; compact: boolean }) {
  const Icon = ICONS[item.kind] ?? ActivityIcon;
  return (
    <div className="flex items-start gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50">
      <div
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl shadow-sm",
          TONES[item.kind],
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-snug", compact ? "text-foreground/90" : "text-foreground")}>
          {item.message}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.actorName ? `${item.actorName} - ` : null}
          {formatRelative(item.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed({ limit = 20, compact = false }: ActivityFeedProps) {
  const { data, isLoading, isError, refetch } = useActivity(limit);

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 6 : 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-2">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        icon={ActivityIcon}
        title="No activity yet"
        description="Workflow events will appear here once operations start moving."
      />
    );
  }

  const items: Activity[] = data.items;

  return (
    <ul className="divide-y" data-testid="activity-feed">
      {items.map((item) => (
        <li key={item.id} data-testid="activity-item">
          <ActivityItem item={item} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
