import { PolicyDetail } from "@/features/policies/components/PolicyDetail";

export const metadata = {
  title: "Policy",
};

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PolicyDetail id={id} />;
}
