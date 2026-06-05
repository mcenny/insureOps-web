"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DEMO_USERS } from "@/features/auth/demo-users";
import { useUserStore } from "@/store/user-store";
import { ROLE_LABELS } from "@/lib/constants";
import { DashboardPreview } from "@/features/marketing/components/DashboardPreview";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LoginScreen() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const hasHydrated = useUserStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated && user) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, user, router]);

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="landing-hero-bg landing-grain relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <BrandMark variant="light" href="/" className="relative" />
        <div className="relative max-w-md space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
            <SparklesIcon className="size-3.5 text-brand-gold" />
            Demo environment
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight text-white">
            Choose a persona. See the product adapt.
          </h1>
          <p className="text-sm leading-relaxed text-white/60">
            Each role unlocks different actions — approve claims, retry payments, or stay view-only.
          </p>
        </div>
        <div className="relative scale-90 opacity-90">
          <DashboardPreview />
        </div>
      </div>

      <div className="dashboard-canvas flex flex-col justify-center p-6 sm:p-10">
        <div className="mx-auto w-full max-w-md space-y-6">
          <BrandMark variant="dark" href="/" className="lg:hidden" />

          <div className="card-surface p-6 sm:p-8">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Pick a demo role</h2>
              <p className="text-sm text-muted-foreground">
                No password. Your choice is saved locally so you can refresh and stay signed in.
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              {DEMO_USERS.map((demo) => (
                <li key={demo.id}>
                  <button
                    type="button"
                    data-testid={`login-as-${demo.id}`}
                    onClick={() => {
                      setUser(demo);
                      router.push("/dashboard");
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border/80 bg-background p-3.5 text-left shadow-sm transition-all hover:border-primary/35 hover:bg-accent/50 hover:shadow-md"
                  >
                    <Avatar className="size-10 shrink-0 ring-2 ring-primary/15">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initialsOf(demo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{demo.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_LABELS[demo.role]} · {demo.email}
                      </p>
                    </div>
                    <ArrowRightIcon className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Fictional data only.{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
