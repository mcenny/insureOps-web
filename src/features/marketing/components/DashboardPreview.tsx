import {
  LayoutDashboardIcon,
  ShieldCheckIcon,
  FileWarningIcon,
  CreditCardIcon,
  FilesIcon,
} from "lucide-react";

const NAV = [
  { icon: LayoutDashboardIcon, active: true },
  { icon: ShieldCheckIcon, active: false },
  { icon: FileWarningIcon, active: false },
  { icon: CreditCardIcon, active: false },
  { icon: FilesIcon, active: false },
];

const STATS = [
  { label: "Active policies", value: "84", featured: true },
  { label: "Pending claims", value: "12", featured: false },
  { label: "Failed payments", value: "3", featured: false },
];

const ROWS = [
  { id: "CLM-2026-0042", status: "Submitted", tone: "sky" },
  { id: "CLM-2026-0038", status: "Under review", tone: "amber" },
  { id: "CLM-2026-0031", status: "Approved", tone: "emerald" },
];

export function DashboardPreview() {
  return (
    <div className="landing-float relative mx-auto w-full max-w-[32rem] lg:max-w-none">
      <div
        className="landing-glow-ring relative overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.18_0.025_255)]"
        aria-hidden
      >
        <div className="flex h-[340px] sm:h-[380px]">
          <div className="flex w-[4.5rem] shrink-0 flex-col gap-2 border-r border-white/8 bg-[oklch(0.16_0.025_255)] p-2.5">
            <div className="mb-2 grid size-8 place-items-center rounded-lg bg-primary">
              <ShieldCheckIcon className="size-4 text-primary-foreground" />
            </div>
            {NAV.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={
                    item.active
                      ? "grid size-8 place-items-center rounded-lg bg-[oklch(0.82_0.14_95)] text-[oklch(0.2_0.03_255)]"
                      : "grid size-8 place-items-center rounded-lg text-white/35"
                  }
                >
                  <Icon className="size-3.5" />
                </div>
              );
            })}
          </div>

          <div className="flex min-w-0 flex-1 flex-col bg-[oklch(0.97_0.008_95)]">
            <div className="flex h-10 items-center gap-2 border-b border-black/5 px-3">
              <div className="h-2 w-16 rounded-full bg-black/10" />
              <div className="ml-auto flex gap-1.5">
                <div className="size-6 rounded-full bg-primary/20" />
                <div className="h-6 w-14 rounded-md bg-black/8" />
              </div>
            </div>

            <div className="flex-1 space-y-3 p-3">
              <div className="grid grid-cols-3 gap-2">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className={
                      stat.featured
                        ? "col-span-1 rounded-xl bg-primary p-2.5 text-primary-foreground"
                        : "rounded-xl border border-black/6 bg-white p-2.5 shadow-sm"
                    }
                  >
                    <p
                      className={
                        stat.featured
                          ? "text-[8px] font-semibold uppercase tracking-wider opacity-75"
                          : "text-[8px] font-medium uppercase tracking-wider text-black/45"
                      }
                    >
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-lg font-bold leading-none">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-black/6 bg-white p-2 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-black/80">Claims queue</p>
                  <div className="h-5 w-12 rounded-md bg-black/6" />
                </div>
                <div className="space-y-1.5">
                  {ROWS.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1.5"
                    >
                      <span className="font-mono text-[9px] font-medium text-black/70">{row.id}</span>
                      <span
                        className={
                          row.tone === "sky"
                            ? "rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[8px] font-semibold text-sky-700"
                            : row.tone === "amber"
                              ? "rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-semibold text-amber-800"
                              : "rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700"
                        }
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-primary/30 bg-primary px-4 py-3 shadow-[0_12px_40px_var(--brand-glow)] sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/75">
          Live demo
        </p>
        <p className="text-sm font-bold text-primary-foreground">5 roles · 1 click</p>
      </div>
    </div>
  );
}
