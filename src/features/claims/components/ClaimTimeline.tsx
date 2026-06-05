"use client";

import { CheckCircle2Icon, ClockIcon, MessageSquareTextIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDateTime } from "@/lib/format";
import type { Claim } from "@/types";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ClaimTimeline({ claim }: { claim: Claim }) {
  const events: Array<{
    id: string;
    icon: typeof CheckCircle2Icon;
    title: string;
    description?: string;
    by?: string;
    at: string;
  }> = [
    {
      id: "submitted",
      icon: ClockIcon,
      title: "Claim submitted",
      description: claim.description,
      by: claim.customerName,
      at: claim.submittedAt,
    },
    ...(claim.assignedToName
      ? [
          {
            id: "assigned",
            icon: CheckCircle2Icon,
            title: `Assigned to ${claim.assignedToName}`,
            at: claim.updatedAt,
          },
        ]
      : []),
    ...claim.notes.map((note) => ({
      id: note.id,
      icon: MessageSquareTextIcon,
      title: "Reviewer note",
      description: note.body,
      by: note.authorName,
      at: note.createdAt,
    })),
  ];

  if (events.length === 0) {
    return (
      <EmptyState
        icon={ClockIcon}
        title="No timeline events yet"
        description="Submission, assignment, and review notes will appear here."
      />
    );
  }

  return (
    <ol className="relative space-y-6 pl-6">
      <span className="absolute left-3 top-2 bottom-2 w-px bg-border" aria-hidden />
      {events
        .slice()
        .reverse()
        .map((event) => {
          const Icon = event.icon;
          return (
            <li key={event.id} className="relative">
              <span className="absolute -left-6 top-1 grid size-5 place-items-center rounded-full border bg-background">
                <Icon className="size-3 text-muted-foreground" />
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{event.title}</p>
                  <span className="text-xs text-muted-foreground">{formatDateTime(event.at)}</span>
                </div>
                {event.description ? (
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                ) : null}
                {event.by ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[9px]">{initialsOf(event.by)}</AvatarFallback>
                    </Avatar>
                    {event.by}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
    </ol>
  );
}
