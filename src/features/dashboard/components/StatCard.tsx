import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: "neutral" | "warning" | "danger" | "success";
  href?: string;
  featured?: boolean;
};

const TONES = {
  neutral: "bg-muted/80 text-foreground",
  warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  danger: "bg-red-500/15 text-red-800 dark:text-red-300",
  success: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
};

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
  href,
  featured = false,
}: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border p-5 transition-all duration-200",
        featured
          ? "featured-stat-pattern border-primary/30 bg-primary text-primary-foreground shadow-[0_16px_40px_var(--brand-glow)] hover:shadow-[0_20px_48px_var(--brand-glow)]"
          : "border-border/80 bg-card shadow-card hover:-translate-y-0.5 hover:shadow-[0_16px_40px_oklch(0.2_0.02_250_/_0.1)]",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "grid size-10 place-items-center rounded-xl",
            featured ? "bg-white/15 text-primary-foreground" : TONES[tone],
          )}
        >
          <Icon className="size-[1.125rem]" />
        </div>
        {href ? (
          <ArrowUpRightIcon
            className={cn(
              "size-4 transition-opacity group-hover:opacity-100",
              featured ? "text-primary-foreground/70 opacity-80" : "text-muted-foreground opacity-0",
            )}
          />
        ) : null}
      </div>
      <div>
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.12em]",
            featured ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight">{value}</p>
      </div>
      {helper ? (
        <p
          className={cn(
            "text-xs leading-relaxed",
            featured ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {helper}
        </p>
      ) : null}
      {featured && href ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-foreground/90">
          View policies
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      ) : null}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
