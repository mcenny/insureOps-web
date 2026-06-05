import type {
  Activity,
  Claim,
  ClaimNote,
  ClaimStatus,
  Customer,
  DocumentRecord,
  DocumentStatus,
  DocumentType,
  Payment,
  PaymentStatus,
  Policy,
  PolicyStatus,
  PolicyType,
} from "@/types";

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20250604);
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]!;
const id = (prefix: string, n: number) => `${prefix}_${String(n).padStart(4, "0")}`;

const NOW = Date.now();
const daysAgo = (d: number) => new Date(NOW - d * 86_400_000).toISOString();
const daysFromNow = (d: number) => new Date(NOW + d * 86_400_000).toISOString();

const FIRST_NAMES = [
  "Amina",
  "Daniel",
  "Tolu",
  "Grace",
  "Philemon",
  "Chioma",
  "Emeka",
  "Funmi",
  "Kemi",
  "Ife",
  "Bola",
  "Sade",
  "Nneka",
  "Tunde",
  "Yemi",
  "Aisha",
  "Chuka",
  "Ngozi",
  "Tobi",
  "Lola",
  "Femi",
  "Bisi",
  "Uche",
  "Kunle",
  "Olu",
  "Hafsat",
  "Ifeanyi",
  "Folake",
  "Segun",
  "Adaeze",
];
const LAST_NAMES = [
  "Yusuf",
  "Okafor",
  "Martins",
  "Adeyemi",
  "Eniola",
  "Okonkwo",
  "Bello",
  "Balogun",
  "Adegoke",
  "Oluwasegun",
  "Aliyu",
  "Onyeka",
  "Akpan",
  "Lawal",
  "Ogun",
  "Ibrahim",
  "Eze",
  "Olatunji",
  "Adekunle",
  "Mohammed",
  "Ojo",
  "Adesanya",
  "Nwosu",
  "Babatunde",
  "Aigbe",
  "Williams",
  "Mensah",
  "Asante",
];

const POLICY_TYPES: PolicyType[] = ["motor", "travel", "home", "health"];
const POLICY_STATUSES: PolicyStatus[] = ["draft", "active", "expired", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded", "cancelled"];
const CLAIM_STATUSES: ClaimStatus[] = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "paid_out",
];
const DOC_TYPES: DocumentType[] = [
  "identity",
  "proof_of_address",
  "vehicle_document",
  "claim_evidence",
];
const DOC_STATUSES: DocumentStatus[] = [
  "not_uploaded",
  "uploaded",
  "under_review",
  "approved",
  "rejected",
];

const CLAIM_DESCRIPTIONS = [
  "Rear-end collision on the third mainland bridge causing bumper damage and rear panel dents.",
  "Hospitalization for three days following a fall at home, includes radiology and pharmacy invoices.",
  "Lost luggage on connecting flight, includes itemised loss list and airline incident reference.",
  "Burst pipe in upstairs bathroom causing water damage to ceiling and electronics on ground floor.",
  "Single-vehicle accident due to brake failure, comprehensive damage to front section.",
  "Theft of insured laptop while travelling abroad, includes police report from local precinct.",
  "Emergency dental procedure overseas during covered trip; submitting clinic invoice.",
  "Storm damage to roof tiles and fascia boards, contractor estimate attached.",
];

const PAYMENT_FAILURE_REASONS = [
  "Insufficient funds",
  "Card issuer declined",
  "Bank transfer reversed",
  "Authentication failed",
  "Card expired",
];

const REVIEWER_IDS = ["user_daniel", "user_amina", "user_philemon"];
const REVIEWER_NAMES: Record<string, string> = {
  user_daniel: "Daniel Okafor",
  user_amina: "Amina Yusuf",
  user_philemon: "Philemon Eniola",
};

function makeEmail(first: string, last: string, n: number) {
  return `${first.toLowerCase()}.${last.toLowerCase()}${n > 0 ? n : ""}@example.com`;
}

function makePhone() {
  return `+234${randInt(700, 909)}${String(randInt(1000000, 9999999)).slice(0, 7)}`;
}

function buildCustomers(): Customer[] {
  const customers: Customer[] = [];
  for (let i = 0; i < 30; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length]!;
    const last = LAST_NAMES[(i * 7) % LAST_NAMES.length]!;
    const status = pick<Customer["status"]>(["active", "active", "active", "active", "inactive", "flagged"]);
    customers.push({
      id: id("cus", i + 1),
      fullName: `${first} ${last}`,
      email: makeEmail(first, last, Math.floor(i / FIRST_NAMES.length)),
      phone: makePhone(),
      status,
      createdAt: daysAgo(randInt(20, 720)),
    });
  }
  return customers;
}

function buildPolicies(customers: Customer[]): Policy[] {
  const policies: Policy[] = [];
  let counter = 1;
  for (const customer of customers) {
    const count = randInt(1, 4);
    for (let i = 0; i < count; i++) {
      const type = pick(POLICY_TYPES);
      const status = pick<PolicyStatus>([
        "active",
        "active",
        "active",
        "active",
        "draft",
        "expired",
        "cancelled",
      ]);
      const startOffset = randInt(-365, 30);
      const durationDays = pick([180, 365, 365, 730]);
      const startDate = daysFromNow(startOffset);
      const expiryDate = daysFromNow(startOffset + durationDays);
      const paymentStatus = (() => {
        if (status === "cancelled") return pick<PaymentStatus>(["cancelled", "refunded"]);
        if (status === "draft") return "pending";
        if (status === "expired") return pick<PaymentStatus>(["paid", "refunded"]);
        return pick<PaymentStatus>(["paid", "paid", "paid", "pending", "failed"]);
      })();
      const premiumAmount = (() => {
        switch (type) {
          case "motor":
            return randInt(800, 4500);
          case "travel":
            return randInt(120, 900);
          case "home":
            return randInt(600, 3800);
          case "health":
            return randInt(1500, 9500);
        }
      })();
      policies.push({
        id: id("pol", counter),
        policyNumber: `POL-${new Date().getFullYear()}-${String(counter).padStart(5, "0")}`,
        customerId: customer.id,
        customerName: customer.fullName,
        type,
        status,
        premiumAmount,
        paymentStatus,
        startDate,
        expiryDate,
        createdAt: daysAgo(randInt(10, 700)),
      });
      counter++;
      if (policies.length >= 80) return policies;
    }
  }
  return policies;
}

function buildPayments(policies: Policy[]): Payment[] {
  const payments: Payment[] = [];
  let counter = 1;
  for (const policy of policies) {
    const cycles = randInt(1, 3);
    for (let i = 0; i < cycles; i++) {
      const status = (() => {
        if (i === 0) return policy.paymentStatus;
        return pick<PaymentStatus>(["paid", "paid", "paid", "failed", "pending"]);
      })();
      const createdAt = daysAgo(randInt(1, 200) + i * 30);
      payments.push({
        id: id("pay", counter),
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        customerId: policy.customerId,
        customerName: policy.customerName,
        amount: policy.premiumAmount,
        status,
        provider: "demo_provider",
        reference: `pi_${Math.floor(rand() * 1_000_000_000).toString(36)}`,
        method: pick(["card", "bank_transfer", "wallet"]),
        failureReason: status === "failed" ? pick(PAYMENT_FAILURE_REASONS) : undefined,
        createdAt,
        updatedAt: createdAt,
      });
      counter++;
      if (payments.length >= 120) return payments;
    }
  }
  return payments;
}

function buildClaims(policies: Policy[]): Claim[] {
  const claims: Claim[] = [];
  const eligible = policies.filter((p) => p.status !== "draft");
  let counter = 1;
  for (let i = 0; i < 50 && i < eligible.length * 2; i++) {
    const policy = eligible[i % eligible.length]!;
    const status = pick<ClaimStatus>([
      "submitted",
      "submitted",
      "under_review",
      "under_review",
      "approved",
      "rejected",
      "paid_out",
    ]);
    const submittedAt = daysAgo(randInt(0, 90));
    const reviewerId =
      status === "submitted" ? undefined : pick(REVIEWER_IDS);
    const notes: ClaimNote[] =
      status === "submitted"
        ? []
        : [
            {
              id: id("note", counter),
              authorId: reviewerId ?? "user_philemon",
              authorName: REVIEWER_NAMES[reviewerId ?? "user_philemon"] ?? "Reviewer",
              body: pick([
                "Documents look complete. Moving to review.",
                "Requesting clarification on injury timeline.",
                "Cross-checked against policy coverage; eligible.",
                "Awaiting confirmation from medical provider.",
              ]),
              createdAt: daysAgo(randInt(0, 30)),
            },
          ];
    claims.push({
      id: id("clm", counter),
      claimNumber: `CLM-${new Date().getFullYear()}-${String(counter).padStart(5, "0")}`,
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      customerId: policy.customerId,
      customerName: policy.customerName,
      status,
      claimAmount: Math.round(policy.premiumAmount * (0.4 + rand() * 5)),
      description: pick(CLAIM_DESCRIPTIONS),
      assignedTo: reviewerId,
      assignedToName: reviewerId ? REVIEWER_NAMES[reviewerId] : undefined,
      submittedAt,
      updatedAt: status === "submitted" ? submittedAt : daysAgo(randInt(0, 20)),
      notes,
    });
    counter++;
    if (claims.length >= 50) break;
  }
  return claims;
}

function buildDocuments(customers: Customer[]): DocumentRecord[] {
  const docs: DocumentRecord[] = [];
  let counter = 1;
  for (const customer of customers) {
    const count = randInt(1, 3);
    const usedTypes = new Set<DocumentType>();
    for (let i = 0; i < count; i++) {
      let type = pick(DOC_TYPES);
      let safety = 0;
      while (usedTypes.has(type) && safety < 5) {
        type = pick(DOC_TYPES);
        safety++;
      }
      usedTypes.add(type);
      const status = pick<DocumentStatus>([
        "uploaded",
        "uploaded",
        "under_review",
        "approved",
        "approved",
        "rejected",
        "not_uploaded",
      ]);
      const uploaded = status !== "not_uploaded";
      const reviewed = status === "approved" || status === "rejected";
      const reviewerId = reviewed ? pick(REVIEWER_IDS) : undefined;
      docs.push({
        id: id("doc", counter),
        customerId: customer.id,
        customerName: customer.fullName,
        type,
        status,
        rejectionReason:
          status === "rejected"
            ? pick([
                "Image unreadable - re-upload required",
                "Document expired",
                "Name mismatch with policy holder",
                "Wrong document type submitted",
              ])
            : undefined,
        uploadedAt: uploaded ? daysAgo(randInt(0, 90)) : undefined,
        reviewedAt: reviewed ? daysAgo(randInt(0, 30)) : undefined,
        reviewedBy: reviewerId,
      });
      counter++;
      if (docs.length >= 60) return docs;
    }
  }
  return docs;
}

function buildActivities(
  claims: Claim[],
  payments: Payment[],
  policies: Policy[],
  docs: DocumentRecord[],
): Activity[] {
  const out: Activity[] = [];
  let counter = 1;
  const push = (entry: Omit<Activity, "id">) => {
    out.push({ id: id("act", counter++), ...entry });
  };

  claims.slice(0, 12).forEach((claim) => {
    push({
      kind: "claim.submitted",
      message: `Claim ${claim.claimNumber} submitted by ${claim.customerName}`,
      actorId: claim.customerId,
      actorName: claim.customerName,
      subjectId: claim.id,
      subjectLabel: claim.claimNumber,
      createdAt: claim.submittedAt,
    });
    if (claim.assignedTo) {
      push({
        kind: "claim.assigned",
        message: `Claim ${claim.claimNumber} assigned to ${claim.assignedToName}`,
        actorId: "user_amina",
        actorName: "Amina Yusuf",
        subjectId: claim.id,
        subjectLabel: claim.claimNumber,
        createdAt: claim.updatedAt,
      });
    }
    if (claim.status === "approved" || claim.status === "rejected" || claim.status === "paid_out") {
      push({
        kind: "claim.transitioned",
        message: `Claim ${claim.claimNumber} marked ${claim.status.replace("_", " ")}`,
        actorId: claim.assignedTo,
        actorName: claim.assignedToName,
        subjectId: claim.id,
        subjectLabel: claim.claimNumber,
        createdAt: claim.updatedAt,
      });
    }
  });

  payments
    .filter((p) => p.status === "failed")
    .slice(0, 6)
    .forEach((p) => {
      push({
        kind: "payment.failed",
        message: `Payment ${p.reference} failed (${p.failureReason ?? "unknown"})`,
        subjectId: p.id,
        subjectLabel: p.reference,
        createdAt: p.updatedAt,
      });
    });

  policies
    .filter((p) => p.status === "active")
    .slice(0, 6)
    .forEach((p) => {
      push({
        kind: "policy.activated",
        message: `Policy ${p.policyNumber} activated for ${p.customerName}`,
        actorId: "user_amina",
        actorName: "Amina Yusuf",
        subjectId: p.id,
        subjectLabel: p.policyNumber,
        createdAt: p.startDate,
      });
    });

  docs
    .filter((d) => d.status === "approved" || d.status === "rejected")
    .slice(0, 8)
    .forEach((d) => {
      const reviewer = d.reviewedBy ? REVIEWER_NAMES[d.reviewedBy] : undefined;
      push({
        kind: d.status === "approved" ? "document.approved" : "document.rejected",
        message: `Document ${d.type.replace("_", " ")} for ${d.customerName} ${d.status}`,
        actorId: d.reviewedBy,
        actorName: reviewer,
        subjectId: d.id,
        subjectLabel: d.type,
        createdAt: d.reviewedAt ?? new Date().toISOString(),
      });
    });

  return out
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 40);
}

export function buildSeed() {
  const customers = buildCustomers();
  const policies = buildPolicies(customers);
  const payments = buildPayments(policies);
  const claims = buildClaims(policies);
  const documents = buildDocuments(customers);
  const activities = buildActivities(claims, payments, policies, documents);
  return { customers, policies, payments, claims, documents, activities };
}

export type Seed = ReturnType<typeof buildSeed>;
