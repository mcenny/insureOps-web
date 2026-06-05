import { PageHeader } from "@/components/layout/PageHeader";
import { ClaimsTable } from "@/features/claims/components/ClaimsTable";

export const metadata = {
  title: "Claims",
};

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Submitted, under-review, and resolved insurance claims awaiting operational handling."
      />
      <ClaimsTable />
    </div>
  );
}
