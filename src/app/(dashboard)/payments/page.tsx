import { PageHeader } from "@/components/layout/PageHeader";
import { PaymentsTable } from "@/features/payments/components/PaymentsTable";

export const metadata = {
  title: "Payments",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Premium payment status across policies. Failed payments can be retried by finance admins."
      />
      <PaymentsTable />
    </div>
  );
}
