import Link from "next/link";
import {
  ArrowRightIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
} from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { DashboardPreview } from "./DashboardPreview";
import { LandingCapabilities } from "./LandingCapabilities";
import { cn } from "@/lib/utils";

const ROLES = [
  { name: "Claims reviewer", task: "Approve & reject claims", color: "border-l-emerald-500" },
  { name: "Finance admin", task: "Retry failed premiums", color: "border-l-amber-500" },
  { name: "Operations manager", task: "Assign reviewers", color: "border-l-violet-500" },
  { name: "Support agent", task: "View-only customer access", color: "border-l-sky-500" },
];

const STACK = ["Next.js 15", "TypeScript", "TanStack Query", "TanStack Table", "shadcn/ui", "Zustand"];

const WORKFLOW = [
  { step: "01", label: "Submitted", desc: "Customer files claim" },
  { step: "02", label: "Under review", desc: "Reviewer opens case" },
  { step: "03", label: "Approved", desc: "Payout authorised" },
  { step: "04", label: "Paid out", desc: "Finance closes loop" },
];

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Exactly one viewport tall — stack strip and scroll cue live inside the hero */}
      <section className="landing-hero-bg landing-grain relative flex h-dvh flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-ink to-transparent" />

        <header className="relative z-20 shrink-0 border-b border-white/8">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <BrandMark variant="light" href="/" className="landing-reveal" />
            <div className="landing-reveal landing-reveal-delay-1 flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <a href="https://github.com/mcenny/insureops-dashboard" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-brand-gold font-semibold text-brand-ink shadow-lg hover:brightness-105"
              >
                <Link href="/login">
                  Open dashboard
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 items-center px-6">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl">
              <div className="landing-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <SparklesIcon className="size-3.5 text-brand-gold" />
              Portfolio demo — fictional insurance data
            </div>

            <h1 className="landing-reveal landing-reveal-delay-1 font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Operations software that feels{" "}
              <span className="italic text-brand-gold">shipped</span>, not sketched.
            </h1>

            <p className="landing-reveal landing-reveal-delay-2 mt-6 text-lg leading-relaxed text-white/65">
              {APP_NAME} is a workflow-heavy internal dashboard for insurance ops — policies, claims,
              payments, KYC documents, and role-gated actions in one cohesive product surface.
            </p>

            <div className="landing-reveal landing-reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-primary px-6 text-base font-semibold shadow-[0_8px_32px_var(--brand-glow)] hover:bg-primary/90"
              >
                <Link href="/login">
                  Try the dashboard
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard">View overview</Link>
              </Button>
            </div>

            <ul className="landing-reveal landing-reveal-delay-4 mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
              {["No signup required", "5 demo personas", "Mock API included"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-primary" />
                  {item}
                </li>
              ))}
              </ul>
            </div>

            <div className="landing-reveal landing-reveal-delay-2 hidden lg:block lg:justify-self-end">
              <DashboardPreview />
            </div>
          </div>
        </div>

        <div className="relative z-20 shrink-0 border-t border-white/8 px-6 py-4">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/60 sm:px-4 sm:py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href="#capabilities"
          className="relative z-20 mx-auto flex w-fit shrink-0 flex-col items-center gap-1 pb-4 text-xs font-medium text-white/45 transition-colors hover:text-white/70"
          aria-label="Scroll to capabilities"
        >
          <span>Explore capabilities</span>
          <ChevronDownIcon className="size-5 animate-bounce" />
        </a>
      </section>

      <div className="landing-content">
        <LandingCapabilities />

        <section className="border-t border-border/70 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="brand-eyebrow-dark">Workflow</p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight">
                  Claims move through states — the UI enforces the rules.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Transitions are validated server-side and mirrored in the client. Reviewers cannot skip
                  steps; finance marks payout only after approval.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {WORKFLOW.map((item, i) => (
                  <div
                    key={item.step}
                    className="relative rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
                  >
                    <span className="font-mono text-xs font-bold text-primary">{item.step}</span>
                    <p className="mt-2 font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                    {i < WORKFLOW.length - 1 ? (
                      <ArrowRightIcon className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 text-primary/40 sm:block" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="text-center">
              <p className="brand-eyebrow-dark">Permissions</p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Same data. Different powers.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Pick a demo persona at login and watch the interface adapt — not a separate app per role.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ROLES.map((role) => (
                <div
                  key={role.name}
                  className={cn(
                    "rounded-2xl border border-border/80 border-l-4 bg-card p-5 shadow-card transition-transform hover:-translate-y-1",
                    role.color,
                  )}
                >
                  <p className="font-semibold">{role.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{role.task}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center sm:px-14 sm:py-16">
            <div className="featured-stat-pattern pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to walk through a claim approval?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-primary-foreground/75">
                Log in as Daniel Okafor (claims reviewer), filter submitted claims, and approve one in under
                a minute.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 rounded-xl bg-brand-gold px-8 text-base font-bold text-brand-ink hover:brightness-105"
              >
                <Link href="/login">
                  Start the demo
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md leading-relaxed">
              {APP_NAME} is an independent portfolio project. Fictional data and simplified workflows only.
            </p>
            <p>
              Built by{" "}
              <a
                href="https://dev-philemon.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Philemon Eniola
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
