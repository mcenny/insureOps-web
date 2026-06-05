import { JsonLd } from "@/components/seo/JsonLd";
import { LandingPage } from "@/features/marketing/components/LandingPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "InsureOps — Insurance operations dashboard demo",
  path: "/",
});

export default function Page() {
  return (
    <>
      <JsonLd path="/" />
      <LandingPage />
    </>
  );
}
