import { z } from "zod";

export const claimTransitionSchema = z.object({
  to: z.enum(["submitted", "under_review", "approved", "rejected", "paid_out"]),
  note: z.string().min(2, "Add a short note (2+ characters)").max(500).optional(),
});
export type ClaimTransitionInput = z.infer<typeof claimTransitionSchema>;

export const claimAssignSchema = z.object({
  reviewerId: z.string().min(1, "Pick a reviewer"),
});
export type ClaimAssignInput = z.infer<typeof claimAssignSchema>;

export const documentReviewSchema = z
  .object({
    decision: z.enum(["approve", "reject"]),
    rejectionReason: z.string().min(2).max(280).optional(),
  })
  .refine((v) => v.decision === "approve" || (v.rejectionReason && v.rejectionReason.length >= 2), {
    message: "Rejection reason is required when rejecting",
    path: ["rejectionReason"],
  });
export type DocumentReviewInput = z.infer<typeof documentReviewSchema>;

export const paymentRetrySchema = z.object({}).optional();
