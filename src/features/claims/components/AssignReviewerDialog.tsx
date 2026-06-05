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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignClaim } from "@/features/claims/api";
import { useReviewers } from "@/features/auth/api";
import { useCurrentUser } from "@/hooks/use-can";
import { ApiClientError } from "@/lib/api/client";
import { ROLE_LABELS } from "@/lib/constants";

const schema = z.object({
  reviewerId: z.string().min(1, "Pick a reviewer"),
});

type AssignReviewerDialogProps = {
  claimId: string;
  trigger: ReactNode;
  currentReviewerId?: string;
};

export function AssignReviewerDialog({
  claimId,
  trigger,
  currentReviewerId,
}: AssignReviewerDialogProps) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const reviewers = useReviewers();
  const mutation = useAssignClaim(claimId);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { reviewerId: currentReviewerId ?? "" },
  });

  const handleSubmit = form.handleSubmit(async ({ reviewerId }) => {
    if (!user) return;
    try {
      await mutation.mutateAsync({
        reviewerId,
        actor: { id: user.id, name: user.name, role: user.role },
      });
      const reviewer = reviewers.data?.items.find((r) => r.id === reviewerId);
      toast.success(`Assigned to ${reviewer?.name ?? "reviewer"}`);
      setOpen(false);
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Could not assign claim";
      toast.error(message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign reviewer</DialogTitle>
          <DialogDescription>
            Pick the team member responsible for reviewing this claim.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="reviewerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewers.isLoading ? (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            Loading reviewers...
                          </div>
                        ) : (
                          reviewers.data?.items.map((reviewer) => (
                            <SelectItem key={reviewer.id} value={reviewer.id}>
                              <span className="flex flex-col text-left">
                                <span className="text-sm font-medium">{reviewer.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {ROLE_LABELS[reviewer.role]}
                                </span>
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Assigning..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
