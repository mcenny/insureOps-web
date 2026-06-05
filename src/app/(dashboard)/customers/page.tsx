import { PageHeader } from "@/components/layout/PageHeader";
import { CustomersTable } from "@/features/customers/components/CustomersTable";

export const metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Customer records across the platform with linked policies, claims, payments, and documents."
      />
      <CustomersTable />
    </div>
  );
}
