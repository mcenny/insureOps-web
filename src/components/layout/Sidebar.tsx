"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[15.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-[3.75rem] items-center border-b border-sidebar-border px-5">
        <BrandMark variant="sidebar" showTagline />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/45">
          Main menu
        </p>
        {PRIMARY_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-[1.125rem] shrink-0",
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3 pb-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/45">
          General
        </p>
        {SECONDARY_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-[1.125rem] shrink-0 opacity-70 group-hover:opacity-100" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sidebar-primary">
            <SparklesIcon className="size-4" />
            <span className="text-xs font-semibold">Connect backend</span>
          </div>
          <p className="text-[11px] leading-relaxed text-sidebar-foreground/65">
            Point <code className="rounded bg-sidebar/80 px-1 py-0.5 text-[10px]">NEXT_PUBLIC_API_BASE_URL</code> at
            your API repo when ready.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-3 h-8 w-full rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/settings">
              Learn more
              <ArrowUpRightIcon className="size-3.5" />
            </Link>
          </Button>
        </div>
        <p className="text-center text-[10px] text-sidebar-foreground/40">Fictional demo data only</p>
      </div>
    </aside>
  );
}
