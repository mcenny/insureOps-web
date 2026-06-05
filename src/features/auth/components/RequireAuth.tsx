"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const hasHydrated = useUserStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/login");
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-5 animate-spin" />
          Loading workspace&hellip;
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
