"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTransitionClaim } from "@/features/claims/api";
import { useCurrentUser } from "@/hooks/use-can";
import { CLAIM_STATUS_LABELS } from "@/lib/constants";
import { ApiClientError } from "@/lib/api/client";
import type { ClaimStatus } from "@/types";

const schema = z.object({
  note: z.string().min(2, "Add at least 2 characters").max(500, "Keep notes under 500 characters"),
});

type ClaimTransitionDialogProps = {
  claimId: string;
  toStatus: ClaimStatus;
  trigger: ReactNode;
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
};

export function ClaimTransitionDialog({
  claimId,
  toStatus,
  trigger,
  variant = "default",
  title,
  description,
}: ClaimTransitionDialogProps) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const mutation = useTransitionClaim(claimId);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { note: "" },
  });

  const handleSubmit = form.handleSubmit(async ({ note }) => {
    if (!user) return;
    try {
      await mutation.mutateAsync({
        to: toStatus,
        note,
        actor: { id: user.id, name: user.name, role: user.role },
      });
      toast.success(`Claim marked ${CLAIM_STATUS_LABELS[toStatus].toLowerCase()}`);
      setOpen(false);
      form.reset();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Could not update claim";
      toast.error(message);
    }
  });

  const finalTitle = title ?? `Mark claim ${CLAIM_STATUS_LABELS[toStatus].toLowerCase()}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{finalTitle}</DialogTitle>
          <DialogDescription>
            {description ?? "Leave a short note so the audit trail stays useful."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer note</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="e.g. Documents verified, eligible per policy."
                      data-testid="claim-transition-note"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={variant}
                disabled={mutation.isPending}
                data-testid={`claim-transition-${toStatus}`}
              >
                {mutation.isPending ? "Saving..." : `Mark ${CLAIM_STATUS_LABELS[toStatus].toLowerCase()}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
