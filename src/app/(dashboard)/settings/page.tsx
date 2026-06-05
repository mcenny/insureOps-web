import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsPanel } from "@/features/settings/components/SettingsPanel";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Demo account, role switching, and how to connect a real backend."
      />
      <SettingsPanel />
    </div>
  );
}
