"use client";

import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/Can";
import { useRetryPayment } from "@/features/payments/api";
import { useCurrentUser } from "@/hooks/use-can";
import { ApiClientError } from "@/lib/api/client";
import type { Payment } from "@/types";

type RetryPaymentActionProps = {
  payment: Payment;
  size?: "sm" | "default";
};

export function RetryPaymentAction({ payment, size = "sm" }: RetryPaymentActionProps) {
  const user = useCurrentUser();
  const mutation = useRetryPayment(payment.id);

  if (payment.status !== "failed") return null;

  const handleRetry = async () => {
    if (!user) return;
    try {
      const result = await mutation.mutateAsync({
        actor: { id: user.id, name: user.name, role: user.role },
      });
      if (result.outcome === "paid") {
        toast.success(`Payment ${payment.reference} succeeded on retry`);
      } else {
        toast.error(`Payment ${payment.reference} failed again`);
      }
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Could not retry payment";
      toast.error(message);
    }
  };

  return (
    <Can action="payment:retry">
      <Button
        variant="outline"
        size={size}
        className="gap-1.5"
        disabled={mutation.isPending}
        data-testid={`retry-payment-${payment.id}`}
        onClick={(e) => {
          e.stopPropagation();
          void handleRetry();
        }}
      >
        <RefreshCwIcon className={mutation.isPending ? "size-3.5 animate-spin" : "size-3.5"} />
        {mutation.isPending ? "Retrying..." : "Retry"}
      </Button>
    </Can>
  );
}
