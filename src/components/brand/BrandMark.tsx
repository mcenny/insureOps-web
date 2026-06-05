import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  /** light = on dark backgrounds; dark = on mint/white; sidebar = compact nav */
  variant?: "light" | "dark" | "sidebar";
  showIcon?: boolean;
  showTagline?: boolean;
  href?: string;
  className?: string;
};

export function BrandMark({
  variant = "dark",
  showIcon = true,
  showTagline = false,
  href,
  className,
}: BrandMarkProps) {
  const isSidebar = variant === "sidebar";
  const onDark = variant === "light" || isSidebar;

  const wordmark = (
    <span
      className={cn(
        "font-display font-semibold tracking-tight",
        isSidebar ? "text-sm" : "text-lg",
        onDark ? "text-white" : "text-foreground",
      )}
    >
      <span className="relative inline-block">
        <span
          aria-hidden
          className={cn(
            "absolute -left-0.5 top-1/2 w-[3px] -translate-y-1/2 rotate-[14deg] rounded-full bg-brand-gold",
            isSidebar ? "h-[1.1rem]" : "h-[1.35rem]",
          )}
        />
        I
      </span>
      {BRAND.name.slice(1)}
    </span>
  );

  const content = (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      {showIcon ? (
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-xl bg-primary shadow-[0_4px_14px_var(--brand-glow)]",
            isSidebar ? "size-9" : "size-9",
          )}
        >
          <ShieldCheckIcon
            className={cn("text-primary-foreground", isSidebar ? "size-[1.125rem]" : "size-4")}
          />
        </span>
      ) : null}
      <span className="min-w-0">
        {wordmark}
        {showTagline ? (
          <span
            className={cn(
              "mt-0.5 block truncate text-[10px] font-medium uppercase tracking-widest",
              onDark ? "text-white/50" : "text-muted-foreground",
            )}
          >
            {BRAND.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
