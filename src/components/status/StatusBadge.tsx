import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toneClasses, type ToneKey } from "@/lib/constants";

type StatusBadgeProps = {
  tone: ToneKey;
  children: ReactNode;
  className?: string;
  withDot?: boolean;
  "data-testid"?: string;
};

export function StatusBadge({
  tone,
  children,
  className,
  withDot = true,
  "data-testid": testId,
}: StatusBadgeProps) {
  const classes = toneClasses(tone);
  return (
    <span
      data-testid={testId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        classes.badge,
        className,
      )}
    >
      {withDot ? <span className={cn("size-1.5 rounded-full", classes.dot)} aria-hidden /> : null}
      {children}
    </span>
  );
}
