export type AdminRole =
  | "super_admin"
  | "operations_manager"
  | "claims_reviewer"
  | "finance_admin"
  | "support_agent";

export type User = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
};

export type CustomerStatus = "active" | "inactive" | "flagged";

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
};

export type PolicyStatus = "draft" | "active" | "expired" | "cancelled";
export type PolicyType = "motor" | "travel" | "home" | "health";

export type Policy = {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: PolicyType;
  status: PolicyStatus;
  premiumAmount: number;
  paymentStatus: PaymentStatus;
  startDate: string;
  expiryDate: string;
  createdAt: string;
};

export type ClaimStatus = "submitted" | "under_review" | "approved" | "rejected" | "paid_out";

export type ClaimNote = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Claim = {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  status: ClaimStatus;
  claimAmount: number;
  description: string;
  assignedTo?: string;
  assignedToName?: string;
  submittedAt: string;
  updatedAt: string;
  notes: ClaimNote[];
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export type Payment = {
  id: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  provider: "demo_provider";
  reference: string;
  method: "card" | "bank_transfer" | "wallet";
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentStatus = "not_uploaded" | "uploaded" | "under_review" | "approved" | "rejected";
export type DocumentType = "identity" | "proof_of_address" | "vehicle_document" | "claim_evidence";

export type DocumentRecord = {
  id: string;
  customerId: string;
  customerName: string;
  type: DocumentType;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

export type ActivityKind =
  | "claim.submitted"
  | "claim.assigned"
  | "claim.transitioned"
  | "policy.activated"
  | "policy.cancelled"
  | "payment.failed"
  | "payment.retried"
  | "payment.succeeded"
  | "document.approved"
  | "document.rejected"
  | "customer.updated"
  | "renewal.reminder";

export type Activity = {
  id: string;
  kind: ActivityKind;
  message: string;
  actorId?: string;
  actorName?: string;
  subjectId?: string;
  subjectLabel?: string;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type SortDirection = "asc" | "desc";

export type ListQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: SortDirection;
  filters?: Record<string, string | string[] | undefined>;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
