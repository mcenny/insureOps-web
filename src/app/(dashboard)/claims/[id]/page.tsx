import { ClaimDetail } from "@/features/claims/components/ClaimDetail";

export const metadata = {
  title: "Claim",
};

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClaimDetail id={id} />;
}
