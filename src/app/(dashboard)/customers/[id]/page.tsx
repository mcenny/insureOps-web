import { CustomerProfile } from "@/features/customers/components/CustomerProfile";

export const metadata = {
  title: "Customer",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerProfile id={id} />;
}
