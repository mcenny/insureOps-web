import type { LucideIcon } from "lucide-react";
import {
  ShieldCheckIcon,
  TableIcon,
  WorkflowIcon,
  UserCogIcon,
  ActivityIcon,
  GaugeCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Capability = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type CapabilityGroup = {
  id: string;
  label: string;
  summary: string;
  items: Capability[];
};

const GROUPS: CapabilityGroup[] = [
  {
    id: "visibility",
    label: "Operational visibility",
    summary: "See what needs attention before it becomes a customer problem.",
    items: [
      {
        icon: GaugeCircleIcon,
        title: "Dashboard overview",
        description:
          "Stat cards for active policies, pending claims, failed payments, and documents awaiting review.",
      },
      {
        icon: TableIcon,
        title: "Production-grade tables",
        description:
          "Search, filter, sort, and paginate with URL-synced state plus real empty, loading, and error paths.",
      },
    ],
  },
  {
    id: "workflows",
    label: "Workflow automation",
    summary: "Encode business rules in the UI so invalid actions never ship to production.",
    items: [
      {
        icon: WorkflowIcon,
        title: "State-machine actions",
        description:
          "Claim transitions, document review, and payment retry flows validated on the server and reflected in the client.",
      },
      {
        icon: ActivityIcon,
        title: "Activity feed",
        description:
          "Every mutation appends an audit-style event. The dashboard and global activity sheet stay in sync.",
      },
    ],
  },
  {
    id: "governance",
    label: "Governance & integration",
    summary: "Role-aware surfaces and a clean path to your real backend.",
    items: [
      {
        icon: UserCogIcon,
        title: "Role-aware UI",
        description:
          "Switch demo personas in one click. Approve, retry, and review controls appear only when the role allows it.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Backend-swap ready",
        description:
          "Typed Next.js API routes today. Point NEXT_PUBLIC_API_BASE_URL at your service tomorrow — components unchanged.",
      },
    ],
  },
];

function CapabilityCard({ item }: { item: Capability }) {
  const Icon = item.icon;
  return (
    <article className="bento-card group flex h-full flex-col p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-80" />
      <div className="relative flex h-full flex-col">
        <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </article>
  );
}

export function LandingCapabilities() {
  return (
    <section id="capabilities">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <header className="mx-auto max-w-3xl text-center">
          <p className="brand-eyebrow-dark">Capabilities</p>
          <h2 className="font-display mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for insurance ops, not generic admin panels
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Six focused capabilities grouped by how teams actually work — visibility first, then
            workflows, then who can do what.
          </p>
        </header>

        <div className="mt-16 space-y-14">
          {GROUPS.map((group, index) => (
            <div
              key={group.id}
              className={cn(
                "grid gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12",
                index > 0 && "border-t border-border/60 pt-14",
              )}
            >
              <div className="lg:sticky lg:top-24 lg:self-start">
                <span className="font-mono text-xs font-bold text-primary/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-2 text-xl font-semibold tracking-tight">{group.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.summary}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item) => (
                  <CapabilityCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
