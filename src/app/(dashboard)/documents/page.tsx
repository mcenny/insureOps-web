import { PageHeader } from "@/components/layout/PageHeader";
import { DocumentsTable } from "@/features/documents/components/DocumentsTable";

export const metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="KYC and supporting documents awaiting review. Approve or reject with a reason for the audit trail."
      />
      <DocumentsTable />
    </div>
  );
}
