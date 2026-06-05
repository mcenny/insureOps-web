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
import { useReviewDocument } from "@/features/documents/api";
import { useCurrentUser } from "@/hooks/use-can";
import { ApiClientError } from "@/lib/api/client";

const rejectFormSchema = z.object({
  rejectionReason: z.string().min(2, "Add a reason (2+ characters)").max(280),
});

type ReviewDocumentDialogProps = {
  documentId: string;
  decision: "approve" | "reject";
  trigger: ReactNode;
};

export function ReviewDocumentDialog({ documentId, decision, trigger }: ReviewDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const mutation = useReviewDocument(documentId);

  const rejectForm = useForm<z.infer<typeof rejectFormSchema>>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: { rejectionReason: "" },
  });

  const submitReview = async (rejectionReason?: string) => {
    if (!user) return;
    try {
      await mutation.mutateAsync({
        decision,
        rejectionReason,
        actor: { id: user.id, name: user.name, role: user.role },
      });
      toast.success(decision === "approve" ? "Document approved" : "Document rejected");
      setOpen(false);
      rejectForm.reset();
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Could not review document";
      toast.error(message);
    }
  };

  const handleRejectSubmit = rejectForm.handleSubmit(async ({ rejectionReason }) => {
    await submitReview(rejectionReason);
  });

  const handleApprove = async () => {
    await submitReview();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) rejectForm.reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{decision === "approve" ? "Approve document" : "Reject document"}</DialogTitle>
          <DialogDescription>
            {decision === "approve"
              ? "Confirm the document meets verification requirements."
              : "Provide a reason so the customer knows what to fix."}
          </DialogDescription>
        </DialogHeader>
        {decision === "reject" ? (
          <Form {...rejectForm}>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <FormField
                control={rejectForm.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection reason</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="e.g. Document expired — please upload a current ID."
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
                    rejectForm.reset();
                  }}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={mutation.isPending}
                  data-testid="document-reject-submit"
                >
                  {mutation.isPending ? "Saving..." : "Reject"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={mutation.isPending}
              data-testid="document-approve-submit"
              onClick={() => void handleApprove()}
            >
              {mutation.isPending ? "Saving..." : "Approve"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
