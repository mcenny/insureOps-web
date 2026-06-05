import { PageHeader } from "@/components/layout/PageHeader";
import { PoliciesTable } from "@/features/policies/components/PoliciesTable";

export const metadata = {
  title: "Policies",
};

export default function PoliciesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Policies"
        description="Active and historical insurance policies across all coverage types."
      />
      <PoliciesTable />
    </div>
  );
}
