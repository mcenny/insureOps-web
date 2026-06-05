"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/MobileNav";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { ActivitySheet } from "@/features/activity/components/ActivitySheet";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/config/nav";
import { APP_NAME } from "@/lib/constants";

function breadcrumbLabel(pathname: string) {
  const all = [...PRIMARY_NAV, ...SECONDARY_NAV];
  const match = all.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
  if (match) return match.label;
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Workspace";
}

export function Topbar() {
  const pathname = usePathname();
  const section = breadcrumbLabel(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-[3.75rem] shrink-0 items-center gap-3 border-b border-border/80 bg-card/90 px-4 shadow-elevated backdrop-blur-md supports-[backdrop-filter]:bg-card/75 lg:px-6">
      <MobileNav />
      <nav className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex" aria-label="Breadcrumb">
        <Link href="/dashboard" className="font-display font-semibold text-foreground/90 hover:text-primary">
          {APP_NAME}
        </Link>
        <span className="text-muted-foreground/60" aria-hidden>
          /
        </span>
        <span className="truncate font-medium text-muted-foreground">{section}</span>
      </nav>
      <div className="flex-1 sm:hidden" />
      <div className="hidden flex-1 sm:block" />
      <ActivitySheet
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-border/80 bg-background shadow-sm"
            data-testid="open-activity"
          >
            <ActivityIcon className="size-4 text-primary" />
            <span className="hidden sm:inline">Activity</span>
          </Button>
        }
      />
      <RoleSwitcher />
    </header>
  );
}
