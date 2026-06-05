"use client";

import { CheckIcon, ChevronsUpDownIcon, LogOutIcon, UserCogIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user-store";
import { DEMO_USERS } from "@/features/auth/demo-users";
import { ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RoleSwitcher() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const signOut = useUserStore((s) => s.signOut);
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 rounded-xl px-2 hover:bg-accent/60">
          <Avatar className="size-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              {initialsOf(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden flex-col items-start text-left sm:flex">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-[11px] text-muted-foreground">{ROLE_LABELS[user.role]}</span>
          </span>
          <ChevronsUpDownIcon className="ml-1 size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
          <UserCogIcon className="size-3.5" />
          Switch demo role
        </DropdownMenuLabel>
        {DEMO_USERS.map((demo) => {
          const active = demo.id === user.id;
          return (
            <DropdownMenuItem
              key={demo.id}
              onSelect={() => setUser(demo)}
              className="flex items-start gap-3 py-2.5"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs">{initialsOf(demo.name)}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{demo.name}</span>
                <span className="text-[11px] text-muted-foreground">{ROLE_LABELS[demo.role]}</span>
              </div>
              <CheckIcon
                className={cn("mt-1 size-4 shrink-0", active ? "opacity-100" : "opacity-0")}
              />
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
            router.push("/login");
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOutIcon className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
