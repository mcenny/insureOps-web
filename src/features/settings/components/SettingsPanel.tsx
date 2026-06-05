"use client";

import { ShieldCheckIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { DEMO_USERS } from "@/features/auth/demo-users";
import { useUserStore } from "@/store/user-store";
import { APP_NAME, ROLE_LABELS } from "@/lib/constants";
import { permissionsFor } from "@/lib/permissions";
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SettingsPanel() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const signOut = useUserStore((s) => s.signOut);

  if (!user) return null;

  const perms = permissionsFor(user.role);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signed in as</CardTitle>
          <CardDescription>Demo session stored in your browser only.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
          </div>
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheckIcon className="size-4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Switch demo role</CardTitle>
          <CardDescription>
            Permissions update immediately across {APP_NAME}. Compare how claims, payments, and
            documents behave per role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <RoleSwitcher />
          </div>
          <Separator />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Other demo personas
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {DEMO_USERS.filter((d) => d.id !== user.id).map((demo) => (
              <li
                key={demo.id}
                className="rounded-lg border px-3 py-2 text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">{demo.name}</span>
                <span className="block text-xs">{ROLE_LABELS[demo.role]}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions for this role</CardTitle>
          <CardDescription>Actions your current persona can perform in the UI.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {perms.map((action) => (
              <li
                key={action}
                className="rounded-full border bg-muted/50 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {action}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API configuration</CardTitle>
          <CardDescription>
            Point <code className="text-xs">NEXT_PUBLIC_API_BASE_URL</code> at your backend repo to
            swap off the in-memory mock API routes in this project.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Unset (default): requests go to <code className="text-xs">/api/*</code> in this Next.js
            app.
          </p>
          <p className="mt-2">
            Set to your API origin: hooks and components stay the same; remove{" "}
            <code className="text-xs">src/app/api</code> when the real backend is ready.
          </p>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          signOut();
          router.push("/login");
        }}
      >
        <LogOutIcon className="size-4" />
        Sign out
      </Button>
    </div>
  );
}
