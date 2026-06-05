"use client";

import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";

type ActivitySheetProps = {
  trigger: ReactNode;
};

export function ActivitySheet({ trigger }: ActivitySheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>
            Operational events from across the dashboard. Updates as workflows progress.
          </SheetDescription>
        </SheetHeader>
        <div className="-mt-2 flex-1 overflow-y-auto px-2 pb-4">
          <ActivityFeed limit={40} compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
